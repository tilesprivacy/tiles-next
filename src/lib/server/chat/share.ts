// Loads a shared chat for its page and OG card: the link's token names an
// at:// record; public records are rendered here, private ones are passed
// on still encrypted (the key is in the URL fragment and never reaches us).
// Results are kept in the Workers cache for a few minutes per record.
import { error } from "@sveltejs/kit"
import katex from "katex"
import { CHAT_LEGACY_SESSION, CHAT_ORIGIN, CHAT_SESSION_SNAPSHOT, chatHostPath } from "#lib/chat/links"
import { qrMatrix } from "#lib/chat/qr"
import { renderSession, type RenderedSession } from "#lib/chat/render"
import { normalizeSession } from "#lib/chat/session"
import type { SharedBy, SharePageData } from "#lib/chat/share-page"
import { ChatFetchError, getProfile, getRecord, PLC_DID, resolvePds, WEB_DID } from "#lib/server/chat/atproto"
import { edgeCacheGet, edgeCacheKey, edgeCachePut } from "#lib/server/chat/edge-cache"

interface ShareRecordUri {
  uri: string
  did: string
  collection: string
  rkey: string
}

export type LoadedShare = { uri: string; collection: string; sharedBy: SharedBy } & (
  | { kind: "public"; session: RenderedSession }
  | { kind: "private"; ciphertext: string }
)

const COLLECTIONS = new Set([CHAT_SESSION_SNAPSHOT, CHAT_LEGACY_SESSION])
const MAX_TOKEN_LENGTH = 2048
const RKEY = /^[A-Za-z0-9._:~-]{1,512}$/

const ERROR_MESSAGES = {
  invalid: "This link isn't a valid shared chat. Check that you copied the whole link.",
  collection: "This link points to something other than a Tiles shared chat.",
  missing: "This shared chat wasn't found. It may have been deleted by the person who shared it.",
  upstream: "The server that stores this chat didn't respond. Try again in a moment.",
  tooLarge: "This shared chat is too large to show here.",
}

function decodeBase64Utf8(token: string): string | null {
  // Forgiving like the old decoder: base64url, missing padding, stray characters.
  const cleaned = token.replace(/-/g, "+").replace(/_/g, "/").replace(/[^A-Za-z0-9+/]/g, "")
  const trimmed = cleaned.length % 4 === 1 ? cleaned.slice(0, -1) : cleaned
  try {
    const binary = atob(trimmed.padEnd(trimmed.length + ((4 - (trimmed.length % 4)) % 4), "="))
    return new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (char) => char.charCodeAt(0))).trim()
  } catch {
    return null
  }
}

/** Reads a share link's token (standard or url-safe base64 of an at:// URI). */
export function parseShareToken(rawToken: string): ShareRecordUri {
  if (rawToken.length > MAX_TOKEN_LENGTH) error(404, ERROR_MESSAGES.invalid)
  let token = rawToken
  try {
    token = decodeURIComponent(rawToken)
  } catch {
    // Already decoded, or a stray %: use it as is.
  }
  token = token
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^share\//, "")
    .replace(/\/api\/og$/i, "")

  // Some links lost the leading "Y" of "YXQ6Ly9" (base64 of "at://").
  const candidates = token.startsWith("XQ6Ly9") ? [`Y${token}`, token] : [token]
  const uri = candidates.map(decodeBase64Utf8).find((value) => value?.startsWith("at://"))
  const parts = uri?.match(/^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/)
  if (!uri || !parts) error(404, ERROR_MESSAGES.invalid)

  const [, did, collection, rkey] = parts
  if (!COLLECTIONS.has(collection)) error(400, ERROR_MESSAGES.collection)
  if (!(PLC_DID.test(did) || WEB_DID.test(did)) || !RKEY.test(rkey) || rkey === "." || rkey === "..") {
    error(404, ERROR_MESSAGES.invalid)
  }
  return { uri, did, collection, rkey }
}

/* Cache: a few minutes per record */

const CACHE_SECONDS = 300
const cacheKey = (uri: string) => edgeCacheKey("share/v1", { uri })

async function cached(uri: string): Promise<LoadedShare | null> {
  const hit = await edgeCacheGet(cacheKey(uri))
  return hit ? ((await hit.json()) as LoadedShare) : null
}

async function store(share: LoadedShare): Promise<void> {
  const body = JSON.stringify(share)
  const headers = { "Content-Type": "application/json", "Cache-Control": `public, max-age=${CACHE_SECONDS}` }
  await edgeCachePut(cacheKey(share.uri), new Response(body, { headers }))
}

/* Loading */

async function fetchShare({ uri, did, collection, rkey }: ShareRecordUri): Promise<LoadedShare> {
  const [record, sharedBy] = await Promise.all([resolvePds(did).then((pds) => getRecord(pds, did, collection, rkey)), getProfile(did)])

  if (typeof record.enc_content === "string" && record.enc_content) {
    return { kind: "private", uri, collection, sharedBy, ciphertext: record.enc_content }
  }
  return { kind: "public", uri, collection, sharedBy, session: renderSession(normalizeSession(record), { remoteImages: true, katex }) }
}

export async function loadShare(token: string): Promise<LoadedShare> {
  const target = parseShareToken(token)
  const hit = await cached(target.uri)
  if (hit) return hit

  try {
    const share = await fetchShare(target)
    await store(share)
    return share
  } catch (cause) {
    if (!(cause instanceof ChatFetchError)) throw cause
    console.warn(`[chat] ${target.uri}: ${cause.message}`)
    if (cause.kind === "not-found") error(404, ERROR_MESSAGES.missing)
    error(502, cause.kind === "too-large" ? ERROR_MESSAGES.tooLarge : ERROR_MESSAGES.upstream)
  }
}

/** The page's data: what it shows, plus its title, description and card. */
export function sharePageData(share: LoadedShare, url: URL, token: string): SharePageData {
  const pageUrl = `${CHAT_ORIGIN}${chatHostPath(url.pathname)}${url.search}`
  const isPrivate = share.kind === "private"
  const handle = share.sharedBy.handle
  const title = `${isPrivate ? "Private shared chat session" : "Shared chat session"}${handle ? ` by @${handle}` : ""} | Tiles`

  // Crawlers cache cards by image URL, so a cache-busting ?v= on the page carries over.
  const image = new URL("/og", CHAT_ORIGIN)
  image.searchParams.set("session", token)
  const version = url.searchParams.get("v")
  if (version) image.searchParams.set("v", version)

  return {
    pageUrl,
    sourceUri: share.uri,
    collection: share.collection,
    sharedBy: share.sharedBy,
    meta: {
      title,
      description: `Shared ${isPrivate ? "private" : "public"} chat session on Tiles. Powered by AT Protocol.`,
      image: image.href,
    },
    share: share.kind === "public" ? { kind: "public", session: share.session, qr: qrMatrix(pageUrl) } : { kind: "private", ciphertext: share.ciphertext },
  }
}
