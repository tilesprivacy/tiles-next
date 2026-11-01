import { getCanaryRelease } from "#lib/canary-release"
import { getLatestDownloadArtifact } from "#lib/download-artifact"

// Release data comes from GitHub at request time; both helpers fall back to
// known-good values when GitHub is down or rate limited.
export const prerender = false

export async function load({ setHeaders }) {
  const [artifact, canaryRelease] = await Promise.all([getLatestDownloadArtifact(), getCanaryRelease()])

  setHeaders({ "Cache-Control": "public, max-age=0, s-maxage=300" })

  return {
    download: {
      version: artifact.version,
      downloadUrl: artifact.downloadUrl,
      binarySizeLabel: artifact.binarySizeLabel,
      sha256: artifact.sha256,
      fileName: artifact.fileName,
    },
    canaryRelease,
  }
}
