import { GITHUB_TOKEN } from "$app/env/private"

const DEFAULT_REVALIDATE_SECONDS = 300

function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tiles.run",
  }

  const token = GITHUB_TOKEN?.trim()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export function fetchGithubJson<T, R = T>(
  url: string,
  transform?: (data: T) => R,
  options: { revalidate?: number } = {}
): Promise<R> {
  // On Cloudflare, `cf.cacheTtl` caches the subrequest at the edge, so GitHub's
  // rate limit isn't hit on every page view. Elsewhere it is ignored.
  // `revalidate: 0` means "always ask GitHub", so no edge cache at all.
  const ttl = options.revalidate ?? DEFAULT_REVALIDATE_SECONDS
  const init = {
    headers: getGithubHeaders(),
    signal: AbortSignal.timeout(10_000),
    ...(ttl > 0 && { cf: { cacheTtl: ttl, cacheEverything: true } }),
  }
  return fetch(url, init as RequestInit).then(async (response) => {
    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`)
    }

    const data = (await response.json()) as T
    return transform ? transform(data) : (data as unknown as R)
  })
}
