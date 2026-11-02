import { dev } from "$app/env"
import type { Handle } from "@sveltejs/kit/hooks"
import { CHAT_HOST, CHAT_ORIGIN, chatHostPath, isChatRoute } from "#lib/chat/links"
import { pageThemeFor } from "#lib/page-theme"

// Same as _headers, for responses the worker renders itself.
const securityHeaders: Record<string, string> = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    'camera=(), microphone=(), geolocation=(), payment=(self "https://polar.sh" "https://buy.polar.sh"), usb=(), interest-cohort=()',
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
}

export const handle: Handle = async ({ event, resolve }) => {
  const chat = isChatRoute(event.route.id)

  // The chat viewer lives only on chat.tiles.run (dev serves /chat/... directly).
  if (chat && !dev && event.url.hostname !== CHAT_HOST) {
    return new Response(null, {
      status: 301,
      headers: { Location: `${CHAT_ORIGIN}${chatHostPath(event.url.pathname)}${event.url.search}` },
    })
  }

  const pageTheme = pageThemeFor(event.url.pathname, event.route.id)

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%tiles.page_theme%", pageTheme ? ` data-page-theme="${pageTheme}"` : ""),
  })

  for (const [name, value] of Object.entries(securityHeaders)) {
    if (!response.headers.has(name)) response.headers.set(name, value)
  }
  // Shared chats belong to the people who shared them; keep them out of search.
  if (chat) response.headers.set("X-Robots-Tag", "noindex")
  return response
}
