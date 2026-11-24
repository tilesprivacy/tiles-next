import { formatBinarySize } from "#lib/format-binary-size"
import { extractSha256Digest, fetchGithubJson } from "#lib/github-json"
import { isDownloadReleaseVersionHidden, normalizeReleaseVersion } from "#lib/release-visibility"

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

export const FALLBACK_DOWNLOAD_VERSION = "0.5.2" as const
const FALLBACK_BINARY_SIZE_BYTES = 132_732_453

const FALLBACK_ARTIFACT: DownloadArtifact = {
  version: FALLBACK_DOWNLOAD_VERSION,
  fileName: "tiles-0.5.2-signed.pkg",
  downloadUrl: "https://download.tiles.run/tiles-0.5.2-signed.pkg",
  binarySizeBytes: FALLBACK_BINARY_SIZE_BYTES,
  binarySizeLabel: formatBinarySize(FALLBACK_BINARY_SIZE_BYTES),
  sha256: "a49d70a269878905040a58793306f8a4bd15f8bdee46fa9c320e03a95e9a1007",
}

interface GithubAsset {
  name: string
  size: number
  digest?: unknown
}

interface GithubRelease {
  tag_name: string
  prerelease: boolean
  assets: GithubAsset[]
}

function isPkgAsset(asset: unknown): asset is GithubAsset {
  if (typeof asset !== "object" || asset === null) return false
  const { name, size } = asset as Record<string, unknown>
  return typeof name === "string" && name.endsWith(".pkg") && typeof size === "number"
}

function pkgAssetOf(candidate: unknown): { release: GithubRelease; asset: GithubAsset } | null {
  if (typeof candidate !== "object" || candidate === null) return null
  const release = candidate as Partial<GithubRelease>
  const version = normalizeReleaseVersion(String(release.tag_name ?? ""))
  if (!version || release.prerelease || isDownloadReleaseVersionHidden(version)) return null
  const asset = Array.isArray(release.assets) ? release.assets.find(isPkgAsset) : undefined
  return asset ? { release: release as GithubRelease, asset } : null
}

/** Newest non-prerelease, non-hidden release with a macOS .pkg; the pinned fallback when GitHub fails. */
export async function getLatestDownloadArtifact(): Promise<DownloadArtifact> {
  try {
    const latest = await fetchGithubJson<unknown, ReturnType<typeof pkgAssetOf>>(GITHUB_RELEASES_LATEST_URL, (releases: unknown) => {
      if (!Array.isArray(releases)) return null
      for (const candidate of releases) {
        const match = pkgAssetOf(candidate)
        if (match) return match
      }
      return null
    })
    if (!latest) return FALLBACK_ARTIFACT

    const { release, asset } = latest
    return {
      version: release.tag_name.replace(/^v/, "") || "unknown",
      fileName: asset.name,
      downloadUrl: `https://download.tiles.run/${encodeURIComponent(asset.name)}`,
      binarySizeBytes: asset.size,
      binarySizeLabel: formatBinarySize(asset.size),
      sha256: extractSha256Digest(asset.digest),
    }
  } catch {
    return FALLBACK_ARTIFACT
  }
}
