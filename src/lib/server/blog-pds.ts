// Reads the published blog from the Tiles PDS: every site.standard.document
// record in our publication that carries the post's markdown (written by
// scripts/publish-blog.ts). Records are public, so no credentials are needed.
import { parseBlogPost, type BlogPost } from "#lib/blog"
import {
  BLOG_DOCUMENT_COLLECTION,
  BLOG_MARKDOWN_TYPE,
  BLOG_SLUG_PATTERN,
  MAX_BLOG_SOURCE_BYTES,
  STANDARD_SITE_PUBLICATION_URI,
  TILES_DID,
  TILES_PDS_URL,
} from "#lib/blog-atproto"

interface ListRecordsPage {
  records?: { uri?: unknown; value?: unknown }[]
  cursor?: unknown
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

function toBlogPost(uri: unknown, value: unknown): BlogPost | null {
  if (typeof uri !== "string" || !isObject(value)) return null
  if (value.site !== STANDARD_SITE_PUBLICATION_URI || typeof value.path !== "string") return null

  const content = value.content
  if (!isObject(content) || content.$type !== BLOG_MARKDOWN_TYPE || typeof content.source !== "string") {
    // Published by something else (or before the markdown was stored): skip.
    console.warn(`[blog] ${uri} has no markdown content; not shown`)
    return null
  }
  if (new TextEncoder().encode(content.source).length > MAX_BLOG_SOURCE_BYTES) {
    console.warn(`[blog] ${uri} is larger than ${MAX_BLOG_SOURCE_BYTES} bytes; not shown`)
    return null
  }

  const slug = value.path.replace(/^\//, "")
  if (!BLOG_SLUG_PATTERN.test(slug)) return null

  const post = parseBlogPost(slug, content.source)
  // The record's own URI is authoritative, whatever the file said.
  post.meta.atUri = uri
  return post.meta.draft ? null : post
}

export async function loadBlogPostsFromPds(fetchFn: typeof fetch = fetch): Promise<BlogPost[]> {
  const posts: BlogPost[] = []
  const seen = new Set<string>()
  let cursor: string | undefined

  // A publication has a handful of posts; the page cap just bounds a runaway cursor.
  for (let page = 0; page < 50; page++) {
    const url = new URL("/xrpc/com.atproto.repo.listRecords", TILES_PDS_URL)
    url.searchParams.set("repo", TILES_DID)
    url.searchParams.set("collection", BLOG_DOCUMENT_COLLECTION)
    url.searchParams.set("limit", "100")
    if (cursor) url.searchParams.set("cursor", cursor)

    const response = await fetchFn(url, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) {
      throw new Error(`Could not read blog posts from ${TILES_PDS_URL} (HTTP ${response.status})`)
    }
    const data = (await response.json()) as ListRecordsPage

    for (const record of data.records ?? []) {
      const post = toBlogPost(record.uri, record.value)
      if (!post || seen.has(post.meta.slug)) continue
      seen.add(post.meta.slug)
      posts.push(post)
    }

    cursor = typeof data.cursor === "string" && data.cursor ? data.cursor : undefined
    if (!cursor) break
  }

  // An empty blog is never what we want to deploy: most likely nothing has been
  // published with scripts/publish-blog.ts yet.
  if (posts.length === 0) {
    throw new Error(`No blog posts with markdown content on ${TILES_PDS_URL}. Run \`npm run blog:publish\` first.`)
  }
  return posts
}
