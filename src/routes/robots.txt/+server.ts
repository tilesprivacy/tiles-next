import { SITE_ORIGIN } from "#lib/absolute-url"
import { preview } from "#lib/deployment"

export const prerender = true

const ROBOTS = preview ? "User-Agent: *\nDisallow: /\n" : `User-Agent: *
Allow: /
Allow: /api/og
Allow: /api/og/
Allow: /llms.txt
Allow: /api/llms
Allow: /api/llms/
Disallow: /blog/drafts/

Host: ${new URL(SITE_ORIGIN).host}
Sitemap: ${SITE_ORIGIN}/sitemap.xml
`

export const GET = () =>
  new Response(ROBOTS, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
