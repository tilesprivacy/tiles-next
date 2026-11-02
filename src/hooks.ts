import type { Reroute } from "@sveltejs/kit/hooks"
import { CHAT_HOST } from "#lib/chat/links"

// chat.tiles.run/<token> is served by the /chat routes. Cloudflare rewrites
// the path before the Worker sees it; this does the same for the browser's
// router (and for requests that arrive without the rewrite).
export const reroute: Reroute = ({ url }) => {
  if (url.hostname !== CHAT_HOST || url.pathname === "/chat" || url.pathname.startsWith("/chat/")) return
  return url.pathname === "/" ? "/chat" : `/chat${url.pathname}`
}
