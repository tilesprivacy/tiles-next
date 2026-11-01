import { getLatestDownloadArtifact } from "#lib/download-artifact"
import { getLatestReleaseVersion } from "#lib/releases"
import type { RequestHandler } from "./$types"

export const prerender = false

export const GET: RequestHandler = async () => {
  const [artifact, latestReleaseVersion] = await Promise.all([
    getLatestDownloadArtifact(),
    getLatestReleaseVersion(),
  ])

  return Response.json(
    { ...artifact, latestReleaseVersion },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  )
}
