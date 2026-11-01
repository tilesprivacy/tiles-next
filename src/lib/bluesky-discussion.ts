// Loads the replies, quote posts and reposts of a post's Bluesky
// announcement from Bluesky's public AppView, for the blog discussion.
// Everything that comes back is untrusted: it is narrowed to the few fields
// we show, text stays text, and only http(s) links and https avatars survive.

const API = "https://public.api.bsky.app/xrpc"
const MAX_DEPTH = 3

export interface DiscussionAuthor {
  name: string
  handle: string
  profileUrl: string
  avatar?: string
}

/** A run of post text, linked when it carries a link, mention or tag facet. */
export interface TextSegment {
  text: string
  href?: string
}

export interface DiscussionPost {
  url: string
  author: DiscussionAuthor
  createdAt: string
  text: TextSegment[]
}

export interface DiscussionReply extends DiscussionPost {
  kind: "reply"
  replies: DiscussionReply[]
  /** Set when deeper replies exist past the depth we show. */
  continueUrl?: string
}

export interface DiscussionQuote extends DiscussionPost {
  kind: "quote"
}

export interface Discussion {
  postUrl: string
  replyCount: number
  quoteCount: number
  repostCount: number
  /** A few reposters, picked at random. */
  reposters: { handle: string; profileUrl: string }[]
  timeline: (DiscussionReply | DiscussionQuote)[]
}

type Json = Record<string, unknown>

const isObject = (value: unknown): value is Json => typeof value === "object" && value !== null
const asObject = (value: unknown): Json => (isObject(value) ? value : {})
const asString = (value: unknown): string => (typeof value === "string" ? value : "")
const asNumber = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0)
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

function safeUrl(value: unknown, protocols: string[]): string | undefined {
  try {
    const url = new URL(asString(value))
    return protocols.includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

const profileUrl = (handleOrDid: string) => `https://bsky.app/profile/${encodeURIComponent(handleOrDid)}`

/** Web permalink on bsky.app for an `at://did/app.bsky.feed.post/rkey` URI. */
export function blueskyPostWebUrl(uri: string): string | null {
  const match = uri.match(/^at:\/\/([^/]+)\/app\.bsky\.feed\.post\/([^/?#]+)$/)
  return match ? `${profileUrl(match[1])}/post/${encodeURIComponent(match[2])}` : null
}

function toAuthor(value: unknown): DiscussionAuthor {
  const author = asObject(value)
  const handle = asString(author.handle)
  return {
    name: asString(author.displayName) || handle,
    handle,
    profileUrl: profileUrl(asString(author.did) || handle),
    avatar: safeUrl(author.avatar, ["https:"]),
  }
}

function facetHref(feature: Json): string | undefined {
  const did = asString(feature.did)
  const tag = asString(feature.tag)
  switch (feature.$type) {
    case "app.bsky.richtext.facet#link":
      return safeUrl(feature.uri, ["https:", "http:"])
    case "app.bsky.richtext.facet#mention":
      return did ? profileUrl(did) : undefined
    case "app.bsky.richtext.facet#tag":
      return tag ? `https://bsky.app/hashtag/${encodeURIComponent(tag)}` : undefined
    default:
      return undefined
  }
}

// Facets index into the UTF-8 bytes of the text, not its characters.
function toSegments(text: string, facets: unknown): TextSegment[] {
  const bytes = new TextEncoder().encode(text)
  const decoder = new TextDecoder()
  const slice = (start: number, end: number) => decoder.decode(bytes.slice(start, end))
  const ranges = asArray(facets)
    .map(asObject)
    .map((facet) => {
      const index = asObject(facet.index)
      return { start: asNumber(index.byteStart), end: asNumber(index.byteEnd), feature: asObject(asArray(facet.features)[0]) }
    })
    .sort((a, b) => a.start - b.start)

  const segments: TextSegment[] = []
  let cursor = 0
  for (const { start, end, feature } of ranges) {
    if (start < cursor || end <= start || end > bytes.length) continue
    if (start > cursor) segments.push({ text: slice(cursor, start) })
    segments.push({ text: slice(start, end), href: facetHref(feature) })
    cursor = end
  }
  if (cursor < bytes.length) segments.push({ text: slice(cursor, bytes.length) })
  return segments
}

const createdAt = (post: unknown) => asString(asObject(asObject(post).record).createdAt)
const time = (iso: string) => new Date(iso).getTime() || 0
const isThreadPost = (value: unknown): value is Json =>
  isObject(value) && value.$type === "app.bsky.feed.defs#threadViewPost"

function toPost(value: unknown): DiscussionPost {
  const post = asObject(value)
  const record = asObject(post.record)
  return {
    url: blueskyPostWebUrl(asString(post.uri)) ?? "https://bsky.app",
    author: toAuthor(post.author),
    createdAt: createdAt(post),
    text: toSegments(asString(record.text), record.facets),
  }
}

function toReply(thread: Json, depth: number, hidden: Set<string>): DiscussionReply {
  const post = toPost(thread.post)
  const nested = asArray(thread.replies)
    .filter(isThreadPost)
    .filter((reply) => !hidden.has(asString(asObject(reply.post).uri)))
    .sort((a, b) => time(createdAt(a.post)) - time(createdAt(b.post)))

  if (nested.length > 0 && depth >= MAX_DEPTH) {
    return { ...post, kind: "reply", replies: [], continueUrl: post.url }
  }
  return { ...post, kind: "reply", replies: nested.map((reply) => toReply(reply, depth + 1, hidden)) }
}

function isDetachedQuote(post: Json): boolean {
  const record = asObject(asObject(post.embed).record)
  const detached = "app.bsky.embed.record#viewDetached"
  return record.$type === detached || asObject(record.record).$type === detached
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

async function getJson(url: string): Promise<Json> {
  try {
    const response = await fetch(url, { cache: "no-store" })
    return response.ok ? asObject(await response.json()) : {}
  } catch {
    return {}
  }
}

/** Null when the post can't be loaded, so the section is left out. */
export async function loadDiscussion(postUri: string): Promise<Discussion | null> {
  const postUrl = blueskyPostWebUrl(postUri)
  if (!postUrl) return null

  const uri = encodeURIComponent(postUri)
  const [threadRes, quotesRes, repostsRes] = await Promise.all([
    getJson(`${API}/app.bsky.feed.getPostThread?uri=${uri}&depth=${MAX_DEPTH}`),
    getJson(`${API}/app.bsky.feed.getQuotes?uri=${uri}&limit=25`),
    getJson(`${API}/app.bsky.feed.getRepostedBy?uri=${uri}&limit=25`),
  ])

  const thread = threadRes.thread
  if (!isThreadPost(thread)) return null

  const root = asObject(thread.post)
  const rootAuthor = asString(asObject(root.author).did)
  const hidden = new Set(asArray(asObject(asObject(threadRes.threadgate).record).hiddenReplies).map(asString))

  // The author's own direct replies continue the post rather than discuss it.
  const replies = asArray(thread.replies)
    .filter(isThreadPost)
    .filter((reply) => {
      const post = asObject(reply.post)
      return asString(asObject(post.author).did) !== rootAuthor && !hidden.has(asString(post.uri))
    })
    .map((reply) => toReply(reply, 0, hidden))

  const quotes = asArray(quotesRes.posts)
    .map(asObject)
    .filter((post) => !isDetachedQuote(post))
    .map((post): DiscussionQuote => ({ ...toPost(post), kind: "quote" }))

  const repostCount = asNumber(root.repostCount)
  const reposters = shuffle(asArray(repostsRes.repostedBy).map(asObject))
    .slice(0, repostCount <= 4 ? 1 : 3)
    .map((author) => ({ handle: asString(author.handle), profileUrl: profileUrl(asString(author.did)) }))

  return {
    postUrl,
    replyCount: asNumber(root.replyCount),
    quoteCount: asNumber(root.quoteCount),
    repostCount,
    reposters,
    timeline: [...replies, ...quotes].sort((a, b) => time(a.createdAt) - time(b.createdAt)),
  }
}
