import { fetchGithubJson } from "#lib/github-json"
import type { RequestHandler } from "./$types"

export const prerender = false

const GITHUB_REPO_API_URL = "https://api.github.com/repos/tilesprivacy/tiles"

export const GET: RequestHandler = async () => {
  try {
    const stars = await fetchGithubJson<{ stargazers_count?: unknown }, number | null>(
      GITHUB_REPO_API_URL,
      (data) => (typeof data.stargazers_count === "number" ? data.stargazers_count : null),
      { revalidate: 1800 },
    )
    return Response.json(
      { stars },
      { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } },
    )
  } catch {
    return Response.json(
      { stars: null },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
    )
  }
}
