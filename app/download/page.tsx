import { DownloadContent } from "@/components/download-content"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"
import { getLatestReleaseVersion } from "@/lib/releases"

export default async function DownloadPage() {
  const [initialDownloadArtifact, initialLatestReleaseVersion] = await Promise.all([
    getLatestDownloadArtifact(),
    getLatestReleaseVersion(),
  ])

  return (
    <DownloadContent
      initialDownload={{
        version: initialDownloadArtifact.version,
        downloadUrl: initialDownloadArtifact.downloadUrl,
        binarySizeLabel: initialDownloadArtifact.binarySizeLabel,
        sha256: initialDownloadArtifact.sha256,
        fileName: initialDownloadArtifact.fileName,
      }}
      initialLatestReleaseVersion={initialLatestReleaseVersion}
    />
  )
}
