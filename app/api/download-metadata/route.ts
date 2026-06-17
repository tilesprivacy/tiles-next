import { NextResponse } from "next/server"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"
import { getLatestReleaseVersion } from "@/lib/releases"

export async function GET() {
  const [artifact, latestReleaseVersion] = await Promise.all([
    getLatestDownloadArtifact(),
    getLatestReleaseVersion(),
  ])

  return NextResponse.json(
    {
      ...artifact,
      latestReleaseVersion,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    }
  )
}

