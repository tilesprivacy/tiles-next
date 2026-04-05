import { formatBinarySize } from "@/lib/format-binary-size"

export interface DownloadArtifact {
  version: string
  fileName: string
  downloadUrl: string
  binarySizeBytes: number
  binarySizeLabel: string
  sha256: string
}

const GITHUB_RELEASES_LATEST_URL =
  "https://api.github.com/repos/tilesprivacy/tiles/releases/latest"

const githubHeaders = {
  Accept: "application/vnd.github+json",
}

const FALLBACK_ARTIFACT: DownloadArtifact = {
  version: "0.4.7",
  fileName: "tiles-0.4.7-signed.pkg",
  downloadUrl: "https://download.tiles.run/tiles-0.4.7-signed.pkg",
  binarySizeBytes: 71040022,
  binarySizeLabel: "67.78 MB",
  sha256: "2c17999f25d34d78a9e4e21100d8ebdb8daf15fe375a2a10ec8c6f27c2195d9b",
}

function extractSha256Digest(asset: any): string {
  if (typeof asset?.digest === "string" && asset.digest.startsWith("sha256:")) {
    return asset.digest.slice("sha256:".length)
  }

  return "Unavailable"
}

export async function getLatestDownloadArtifact(): Promise<DownloadArtifact> {
  try {
    const res = await fetch(GITHUB_RELEASES_LATEST_URL, {
      headers: githubHeaders,
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch latest release: ${res.status}`)
    }

    const release = await res.json()
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
