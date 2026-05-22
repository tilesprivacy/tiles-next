import { NextResponse } from "next/server"

const GITHUB_REPO_API_URL = "https://api.github.com/repos/tilesprivacy/tiles"
const RESPONSE_REVALIDATE_SECONDS = 1800

export async function GET() {
  try {
    const response = await fetch(GITHUB_REPO_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "tiles-next-site",
      },
      next: {
        revalidate: RESPONSE_REVALIDATE_SECONDS,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub repo request failed with status ${response.status}`)
    }

    const data = (await response.json()) as { stargazers_count?: number }
    const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : null

    return NextResponse.json(
      {
        stars,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      }
    )
  } catch {
    return NextResponse.json(
      {
        stars: null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
        },
      }
    )
  }
}
