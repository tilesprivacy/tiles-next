// Addresses for the shared-chat viewer at chat.tiles.run. In production a
// Cloudflare URL Rewrite rule serves chat.tiles.run/<path> from the Worker's
// /chat/<path>; src/hooks.ts maps the same in the browser so routing works.

export const CHAT_HOST = "chat.tiles.run"
export const CHAT_ORIGIN = `https://${CHAT_HOST}`

export const CHAT_SESSION_SNAPSHOT = "run.tiles.chat.sessionSnapshot"
/** Older records, still shown. */
export const CHAT_LEGACY_SESSION = "run.tiles.session"

export const isChatRoute = (routeId: string | null | undefined) => routeId === "/chat" || !!routeId?.startsWith("/chat/")

/** The path a /chat/... route has on chat.tiles.run. */
export const chatHostPath = (pathname: string) => pathname.replace(/^\/chat(?=\/|$)/, "") || "/"

export function bskyProfileUrl(handle: string | null, did: string): string {
  const id = handle?.trim().replace(/^@+/, "") || did
  return `https://bsky.app/profile/${encodeURIComponent(id)}`
}

export function huggingFaceModelUrl(model: string): string {
  // An Ollama-style tag (":Q4_K_M") isn't part of the repo id.
  const repo = model.split(":")[0]
  return `https://huggingface.co/${repo.split("/").map(encodeURIComponent).join("/")}`
}

export const atprotoRecordUrl = (uri: string) => `https://atproto.at/uri/${encodeURIComponent(uri)}`

/** "chat.tiles.run/YXQ6Ly...ZA==" for the header. */
export function shortShareLabel(href: string): string {
  try {
    const url = new URL(href)
    const host = url.host.replace(/^www\./, "")
    const token = url.pathname.startsWith("/share/") ? url.pathname.slice(7) : url.pathname.replace(/^\/+/, "")
    if (!token) return `${host}${url.pathname.length > 20 ? `${url.pathname.slice(0, 20)}...${url.pathname.slice(-6)}` : url.pathname}`
    return `${host}/${token.length <= 14 ? token : `${token.slice(0, 6)}...${token.slice(-6)}`}`
  } catch {
    return href.length > 42 ? `${href.slice(0, 26)}...${href.slice(-8)}` : href
  }
}
