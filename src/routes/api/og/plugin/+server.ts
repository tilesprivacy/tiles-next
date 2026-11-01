import { redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

// Old plugin card URLs carried the name and description in the query string;
// only the slug is used now, and only if it looks like one.
export const prerender = false

const SLUG = /^[a-z0-9-]{1,64}$/

export const GET: RequestHandler = ({ url, setHeaders }) => {
  setHeaders({ "Cache-Control": "public, max-age=86400" })
  const slug = url.searchParams.get("slug")?.trim() ?? ""
  redirect(301, SLUG.test(slug) ? `/og/generated/plugin-${slug}.png` : "/og/generated/og.png")
}
