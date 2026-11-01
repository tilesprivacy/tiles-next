import { getCanaryRelease } from "#lib/canary-release"
import type { RequestHandler } from "./$types"

export const prerender = false

export const GET: RequestHandler = async () => {
  // The canary tag is mutable (assets get replaced), so skip the subrequest
  // cache; the CDN shares this response for one minute.
  const release = await getCanaryRelease(0)
  if (!release) {
    return Response.json(
      { error: "Canary release temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    )
  }

  return Response.json(release, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=60" },
  })
}
