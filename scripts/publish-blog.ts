// Publishes content/blog/*.md to the Tiles PDS as site.standard.document
// records. Each record carries the post's whole markdown file (which the
// production build renders) and a plain-text copy for other standard.site
// readers. New posts get their record's at:// URI written back into the file.
//
//   node scripts/publish-blog.ts            publish what changed
//   node scripts/publish-blog.ts --dry-run  show what would change
//
// Needs ATP_IDENTIFIER (tiles.run) and ATP_APP_PASSWORD; PDS_URL is optional.
// Plain Node with type stripping: no enums or other TS-only syntax.

import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fromMarkdown } from "mdast-util-from-markdown"
import { toString } from "mdast-util-to-string"
import {
  BLOG_DOCUMENT_COLLECTION,
  BLOG_MARKDOWN_TYPE,
  BLOG_SLUG_PATTERN,
  MAX_BLOG_SOURCE_BYTES,
  STANDARD_SITE_PUBLICATION_URI,
  TILES_DID,
  TILES_PDS_URL,
} from "../src/lib/blog-atproto.ts"
import { list, parseFrontmatter, str } from "../src/lib/frontmatter.ts"

const ROOT = path.resolve(import.meta.dirname, "..")
const BLOG_DIR = path.join(ROOT, "content/blog")
const STATIC_DIR = path.join(ROOT, "static")
const SITE_BLOG_URL = "https://www.tiles.run/blog"
const DRY_RUN = process.argv.includes("--dry-run")

type Json = Record<string, unknown>

interface LocalPost {
  slug: string
  file: string
  /** The file as written, minus the atUri line, which is ours to manage. */
  source: string
  atUri?: string
  data: ReturnType<typeof parseFrontmatter>["data"]
  body: string
}

interface ExistingRecord {
  uri: string
  cid: string
  value: Json
}

const ATURI_LINE = /^atUri:.*\r?\n/m

async function readPosts(): Promise<LocalPost[]> {
  const posts: LocalPost[] = []
  for (const name of (await readdir(BLOG_DIR)).sort()) {
    if (!name.endsWith(".md") || name === "README.md") continue
    const slug = name.replace(/\.md$/, "")
    if (!BLOG_SLUG_PATTERN.test(slug)) throw new Error(`${name}: file name must be a lowercase slug`)

    const file = path.join(BLOG_DIR, name)
    const raw = await readFile(file, "utf8")
    const { data, body } = parseFrontmatter(raw)
    if (data.draft === true) continue
    if (!str(data.title) || !/^\d{4}-\d{2}-\d{2}$/.test(str(data.publishDate) ?? "")) {
      throw new Error(`${name}: needs a title and a publishDate (YYYY-MM-DD)`)
    }

    const source = raw.replace(ATURI_LINE, "")
    if (Buffer.byteLength(source) > MAX_BLOG_SOURCE_BYTES) throw new Error(`${name}: larger than ${MAX_BLOG_SOURCE_BYTES} bytes`)
    posts.push({ slug, file, source, atUri: str(data.atUri), data, body })
  }
  return posts
}

/** Plain text of the body, one block per paragraph, for readers that don't render markdown. */
function plainText(title: string, body: string): string {
  const tree = fromMarkdown(body.replace(/^\s*#\s[^\n]*\n/, ""))
  const blocks = tree.children
    .filter((node) => node.type !== "html" && node.type !== "code")
    .map((node) => toString(node).trim())
    .filter(Boolean)
  return [title, ...blocks].join("\n\n")
}

class Pds {
  private readonly base: string
  private token = ""
  did = ""

  constructor(base: string) {
    this.base = base.replace(/\/$/, "")
  }

  private async call(method: string, init: RequestInit & { query?: Record<string, string> } = {}) {
    const url = new URL(`/xrpc/${method}`, this.base)
    for (const [key, value] of Object.entries(init.query ?? {})) url.searchParams.set(key, value)
    const headers = new Headers(init.headers)
    if (this.token) headers.set("Authorization", `Bearer ${this.token}`)
    const response = await fetch(url, { ...init, headers, signal: AbortSignal.timeout(30_000) })
    if (!response.ok) throw new Error(`${method} failed: HTTP ${response.status} ${await response.text()}`)
    return (await response.json()) as Json
  }

  private json(method: string, body: Json) {
    return this.call(method, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  }

  async login(identifier: string, password: string) {
    const session = await this.json("com.atproto.server.createSession", { identifier, password })
    this.token = String(session.accessJwt)
    this.did = String(session.did)
  }

  async listDocuments(): Promise<ExistingRecord[]> {
    const records: ExistingRecord[] = []
    let cursor = ""
    do {
      const query: Record<string, string> = { repo: this.did, collection: BLOG_DOCUMENT_COLLECTION, limit: "100" }
      if (cursor) query.cursor = cursor
      const page = await this.call("com.atproto.repo.listRecords", { query })
      for (const record of (page.records as Json[] | undefined) ?? []) {
        records.push({ uri: String(record.uri), cid: String(record.cid), value: record.value as Json })
      }
      cursor = typeof page.cursor === "string" ? page.cursor : ""
    } while (cursor)
    return records
  }

  async uploadBlob(bytes: Buffer, mimeType: string): Promise<Json> {
    const result = await this.call("com.atproto.repo.uploadBlob", {
      method: "POST",
      headers: { "Content-Type": mimeType },
      body: bytes,
    })
    return result.blob as Json
  }

  create(record: Json) {
    return this.json("com.atproto.repo.createRecord", { repo: this.did, collection: BLOG_DOCUMENT_COLLECTION, record })
  }

  put(rkey: string, record: Json, swapRecord: string) {
    return this.json("com.atproto.repo.putRecord", {
      repo: this.did,
      collection: BLOG_DOCUMENT_COLLECTION,
      rkey,
      record,
      swapRecord,
    })
  }
}

const IMAGE_TYPES: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" }

/** The record's cover blob: reused while the image path is unchanged, uploaded otherwise. */
async function coverBlob(pds: Pds, post: LocalPost, existing: ExistingRecord | undefined): Promise<Json | undefined> {
  const imagePath = str(post.data.ogImage) ?? str(post.data.coverImage)
  if (!imagePath?.startsWith("/")) return undefined

  const previous = existing?.value.content as Json | undefined
  const previousPath = typeof previous?.source === "string"
    ? (str(parseFrontmatter(previous.source).data.ogImage) ?? str(parseFrontmatter(previous.source).data.coverImage))
    : undefined
  if (existing?.value.coverImage && previousPath === imagePath) return existing.value.coverImage as Json

  const mimeType = IMAGE_TYPES[path.extname(imagePath).toLowerCase()]
  const file = path.join(STATIC_DIR, imagePath)
  if (!mimeType || !file.startsWith(STATIC_DIR + path.sep)) return undefined
  if (DRY_RUN) return { $type: "blob", note: `would upload ${imagePath}` }
  return pds.uploadBlob(await readFile(file), mimeType)
}

function buildRecord(post: LocalPost, cover: Json | undefined): Json {
  const title = str(post.data.title)!
  const updatedAt = str(post.data.updatedAt)
  const record: Json = {
    $type: BLOG_DOCUMENT_COLLECTION,
    site: STANDARD_SITE_PUBLICATION_URI,
    path: `/${post.slug}`,
    title,
    publishedAt: `${str(post.data.publishDate)}T00:00:00.000Z`,
    canonicalUrl: `${SITE_BLOG_URL}/${post.slug}`,
    textContent: plainText(title, post.body),
    content: { $type: BLOG_MARKDOWN_TYPE, source: post.source },
  }
  const description = str(post.data.description)
  if (description) record.description = description
  const tags = list(post.data.tags)
  if (tags.length) record.tags = tags
  if (updatedAt) record.updatedAt = `${updatedAt}T00:00:00.000Z`
  if (cover) record.coverImage = cover
  return record
}

// Key order doesn't matter when deciding whether a record changed.
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stable((value as Json)[k])}`).join(",")}}`
  }
  return JSON.stringify(value)
}

async function writeAtUri(post: LocalPost, uri: string) {
  if (DRY_RUN) return
  const raw = (await readFile(post.file, "utf8")).replace(ATURI_LINE, "")
  await writeFile(post.file, raw.replace(/^---\r?\n/, `---\natUri: "${uri}"\n`))
}

async function main() {
  const identifier = process.env.ATP_IDENTIFIER?.trim()
  const password = process.env.ATP_APP_PASSWORD?.trim()
  if (!identifier || !password) throw new Error("Set ATP_IDENTIFIER and ATP_APP_PASSWORD (an app password, not the account password).")

  const pds = new Pds(process.env.PDS_URL?.trim() || TILES_PDS_URL)
  await pds.login(identifier, password)
  // Records written to any other account would never show up on the site.
  if (pds.did !== TILES_DID) throw new Error(`Logged in as ${pds.did}, but the blog belongs to ${TILES_DID}.`)

  const posts = await readPosts()
  const existing = (await pds.listDocuments()).filter((record) => record.value.site === STANDARD_SITE_PUBLICATION_URI)
  const byUri = new Map(existing.map((record) => [record.uri, record]))
  const byPath = new Map(existing.map((record) => [String(record.value.path), record]))

  let changed = 0
  for (const post of posts) {
    // Match on the file's atUri, or on the path if the line went missing.
    const current = (post.atUri && byUri.get(post.atUri)) || byPath.get(`/${post.slug}`)
    const record = buildRecord(post, await coverBlob(pds, post, current))

    if (current && stable(current.value) === stable(record)) {
      if (!post.atUri) await writeAtUri(post, current.uri)
      continue
    }

    changed++
    if (DRY_RUN) {
      console.log(`${current ? "update" : "create"} ${post.slug}`)
      continue
    }

    if (current) {
      await pds.put(current.uri.split("/").pop()!, record, current.cid)
      if (post.atUri !== current.uri) await writeAtUri(post, current.uri)
      console.log(`updated ${post.slug}`)
    } else {
      const created = await pds.create(record)
      await writeAtUri(post, String(created.uri))
      console.log(`created ${post.slug} -> ${created.uri}`)
    }
  }

  // Records whose file was deleted stay on the PDS; say so rather than delete.
  const localPaths = new Set(posts.map((post) => `/${post.slug}`))
  for (const record of existing) {
    if (!localPaths.has(String(record.value.path))) console.log(`note: ${record.uri} (${record.value.path}) has no file here`)
  }

  console.log(`${DRY_RUN ? "would change" : "changed"} ${changed} of ${posts.length} posts`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
