import { DownloadContent } from "@/components/download-content"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"

export default async function DownloadPage() {
  const initialDownloadArtifact = await getLatestDownloadArtifact()

  return (
    <DownloadContent
      initialDownload={{
        version: initialDownloadArtifact.version,
        downloadUrl: initialDownloadArtifact.downloadUrl,
        binarySizeLabel: initialDownloadArtifact.binarySizeLabel,
        sha256: initialDownloadArtifact.sha256,
        fileName: initialDownloadArtifact.fileName,
      }}
    />
  )
}
