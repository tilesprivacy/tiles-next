import { NextResponse } from "next/server"
import { getCanaryRelease } from "@/lib/canary-release"

export async function GET() {
  // Recheck the same mutable tag, including asset replacements. The CDN shares
  // this fresh response for one minute; browsers revalidate on every check.
  const release = await getCanaryRelease(0)
  if (!release) {
    return NextResponse.json(
      { error: "Canary release temporarily unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    )
  }

  return NextResponse.json(release, {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=60" },
  })
}
