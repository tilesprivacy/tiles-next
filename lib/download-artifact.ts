import { formatBinarySize } from "@/lib/format-binary-size"
import { fetchGithubJson } from "@/lib/github-json"
import { isDownloadReleaseVersionHidden, normalizeReleaseVersion } from "@/lib/release-visibility"

export interface DownloadArtifact {
  version: string
  fileName: string
  downloadUrl: string
  binarySizeBytes: number
  binarySizeLabel: string
  sha256: string
}

const GITHUB_RELEASES_LATEST_URL =
  "https://api.github.com/repos/tilesprivacy/tiles/releases?per_page=20"

export const FALLBACK_DOWNLOAD_VERSION = "0.4.13" as const

const FALLBACK_ARTIFACT: DownloadArtifact = {
  version: FALLBACK_DOWNLOAD_VERSION,
  fileName: "tiles-0.4.13-signed.pkg",
  downloadUrl: "https://download.tiles.run/tiles-0.4.13-signed.pkg",
  binarySizeBytes: 98120563,
  binarySizeLabel: "93.58 MB",
  sha256: "443fbb7dde2ec53fe34da0daf38ad18624edf267852158a393d0c8c1d7d5861c",
}

function extractSha256Digest(asset: any): string {
  if (typeof asset?.digest === "string" && asset.digest.startsWith("sha256:")) {
    return asset.digest.slice("sha256:".length)
  }

  return "Unavailable"
}

export async function getLatestDownloadArtifact(): Promise<DownloadArtifact> {
  try {
    const release = await fetchGithubJson<any[], any | undefined>(
      GITHUB_RELEASES_LATEST_URL,
      (releases) => {
        if (!Array.isArray(releases)) {
          return undefined
        }

        return releases.find((candidate: any) => {
          const version = normalizeReleaseVersion(String(candidate?.tag_name || ""))
          const assets = Array.isArray(candidate?.assets) ? candidate.assets : []

          return (
            version.length > 0 &&
            !candidate?.prerelease &&
            !isDownloadReleaseVersionHidden(version) &&
            assets.some(
              (asset: any) =>
                typeof asset?.name === "string" &&
                asset.name.endsWith(".pkg") &&
                typeof asset?.size === "number"
            )
          )
        })
      }
    )

    if (!release) {
      throw new Error("No visible .pkg release found")
    }

    const assets = Array.isArray(release?.assets) ? release.assets : []
    const pkgAsset = assets.find(
      (asset: any) =>
        typeof asset?.name === "string" &&
        asset.name.endsWith(".pkg") &&
        typeof asset?.size === "number"
    )

    if (!pkgAsset) {
      throw new Error("No .pkg asset found in latest release")
    }

    const fileName = pkgAsset.name
    const binarySizeBytes = pkgAsset.size

    return {
      version: String(release?.tag_name || "").replace(/^v/, "") || "unknown",
      fileName,
      downloadUrl: `https://download.tiles.run/${fileName}`,
      binarySizeBytes,
      binarySizeLabel: formatBinarySize(binarySizeBytes),
      sha256: extractSha256Digest(pkgAsset),
    }
  } catch {
    return FALLBACK_ARTIFACT
  }
}
