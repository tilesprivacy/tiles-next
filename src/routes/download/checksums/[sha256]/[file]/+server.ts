import { error } from "@sveltejs/kit"
import { getCanaryRelease } from "#lib/canary-release"
import { FALLBACK_ARTIFACT, getLatestDownloadArtifact } from "#lib/download-artifact"
import { CANARY_FALLBACK_DOWNLOAD } from "#lib/download-page-data"
import type { RequestHandler } from "./$types"

export const prerender = false

export const GET: RequestHandler = async ({ params }) => {
  const { file, sha256 } = params
  if (!/^[a-f0-9]{64}$/.test(sha256) || !/^[^/\\\r\n]+\.pkg\.sha256$/i.test(file)) {
    error(404, "Checksum unavailable")
  }

  const fileName = file.slice(0, -".sha256".length)
  const matches = (name: string, digest: string) => name === fileName && digest === sha256
  const pinned = matches(FALLBACK_ARTIFACT.fileName, FALLBACK_ARTIFACT.sha256)
    || matches(CANARY_FALLBACK_DOWNLOAD.name, CANARY_FALLBACK_DOWNLOAD.sha256)

  if (!pinned) {
    const [network, canary] = await Promise.all([getLatestDownloadArtifact(), getCanaryRelease()])
    if (!matches(network.fileName, network.sha256) && !canary?.assets.some((asset) => matches(asset.name, asset.sha256))) {
      error(404, "Checksum unavailable")
    }
  }

  return new Response(`${sha256}  ${fileName}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
