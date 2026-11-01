import type { Handle } from "@sveltejs/kit/hooks"
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
  const pageTheme = pageThemeFor(event.url.pathname)

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%tiles.page_theme%", pageTheme ? ` data-page-theme="${pageTheme}"` : ""),
  })

  for (const [name, value] of Object.entries(securityHeaders)) {
    if (!response.headers.has(name)) response.headers.set(name, value)
  }
  return response
}
