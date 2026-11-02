import type { SharedBy } from "#lib/chat/share-page"
import { edgeCacheGet, edgeCacheKey, edgeCachePut } from "#lib/server/chat/edge-cache"
import { loadShare, parseShareToken } from "#lib/server/chat/share"

export const prerender = false

// Link-preview card for a share: /og?session=<token>. Complete cards are kept
// in the Workers cache for an hour; a card missing its share or avatar isn't
// cached anywhere, so crawlers try again later rather than keep a broken one.
const COMPLETE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"

const UNKNOWN: SharedBy = { did: "unknown", handle: null, displayName: null, avatarUrl: null }

export async function GET({ url }) {
  const token = url.searchParams.get("session") ?? ""
  let uri: string | null = null
  try {
    uri = parseShareToken(token).uri
  } catch {
    // Not a share link: the generic card below.
  }

  const key = uri ? edgeCacheKey("og/v1", { uri, v: url.searchParams.get("v") ?? "" }) : null
  const hit = key ? await edgeCacheGet(key) : null
  if (hit) return hit

  const share = uri ? await loadShare(token).catch(() => null) : null
  const { fetchAvatar, renderShareCard } = await import("#lib/server/chat/og-card")
  const sharedBy = share?.sharedBy ?? UNKNOWN
  const avatar = await fetchAvatar(sharedBy.avatarUrl)
  const png = await renderShareCard({ sharedBy, isPrivate: share?.kind === "private", avatar })

  const complete = share !== null && (!sharedBy.avatarUrl || avatar !== null)
  const response = new Response(png as BodyInit, {
    headers: { "Content-Type": "image/png", "Cache-Control": complete ? COMPLETE : "no-store" },
  })
  if (complete && key) await edgeCachePut(key, response.clone())
  return response
}
