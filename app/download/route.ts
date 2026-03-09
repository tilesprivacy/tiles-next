import { redirect } from "next/navigation"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"

export async function GET() {
  const artifact = await getLatestDownloadArtifact()
  redirect(artifact.downloadUrl)
}

