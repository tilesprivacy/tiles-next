import { dev } from "$app/env"
import { error } from "@sveltejs/kit"
import { buildFundingNewsletter } from "#lib/server/email/funding-newsletter"
import { toPlainText } from "#lib/server/email/plain-text"
import type { RequestHandler } from "./$types"

export const prerender = false

// Development-only preview of the funding newsletter. ?theme=light|dark forces
// a color scheme, ?format=text shows the plain-text part, ?styles=inline drops
// the <style> block, ?images=off blanks every image.
export const GET: RequestHandler = ({ url }) => {
  if (!dev) error(404, "Not found")

  const emailHtml = buildFundingNewsletter()
  const headers = {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
    // The /email-previews gallery frames this page.
    "X-Frame-Options": "SAMEORIGIN",
  }

  if (url.searchParams.get("format") === "text") {
    return new Response(toPlainText(emailHtml), {
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
    })
  }

  // Preview the repository's image assets; email links still use public URLs.
  let html = emailHtml.replaceAll('src="https://tiles.run/', 'src="/')
  const theme = url.searchParams.get("theme")
  if (theme === "dark" || theme === "light") {
    html = html.replaceAll(
      "@media (prefers-color-scheme: dark)",
      theme === "dark" ? "@media all" : "@media not all",
    )
  }
  if (url.searchParams.get("styles") === "inline") {
    html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
  }
  if (url.searchParams.get("images") === "off") {
    html = html.replace(/(<img\b[^>]*\bsrc=")[^"]*(")/gi, "$1data:,$2")
  }

  return new Response(html, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } })
}
