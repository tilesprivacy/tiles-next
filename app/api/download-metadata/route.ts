import { NextResponse } from "next/server"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"

export async function GET() {
  const artifact = await getLatestDownloadArtifact()

  return NextResponse.json(artifact, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  })
}

