import { DownloadContent } from "@/components/download-content"
import { getCanaryRelease } from "@/lib/canary-release"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"
import { getGithubSponsorsGoalData } from "@/lib/sponsors-goal"

export default async function DownloadPage() {
  const [initialDownloadArtifact, sponsorsGoal, initialCanaryRelease] = await Promise.all([
    getLatestDownloadArtifact(),
    getGithubSponsorsGoalData(),
    getCanaryRelease(),
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
      initialCanaryRelease={initialCanaryRelease}
      sponsorsGoal={sponsorsGoal}
    />
  )
}
