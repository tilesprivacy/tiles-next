const DEFAULT_REVALIDATE_SECONDS = 300

function getGithubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "tiles.run",
  }

  const token = process.env.GITHUB_TOKEN?.trim()
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
  return fetch(url, {
    headers: getGithubHeaders(),
    next: {
      revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
    },
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`GitHub request failed: ${response.status}`)
    }

    const data = (await response.json()) as T
    return transform ? transform(data) : (data as unknown as R)
  })
}
