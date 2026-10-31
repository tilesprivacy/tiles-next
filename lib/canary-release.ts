import "server-only"

import { cache } from "react"
import { fetchGithubJson } from "@/lib/github-json"

export interface CanaryReleaseData {
  body: string | null
  published_at: string | null
  updated_at: string | null
  assets: Array<{ name: string; size: number; browser_download_url: string }>
}

export const getCanaryRelease = cache(async (revalidate = 300): Promise<CanaryReleaseData | null> => {
  try {
    return await fetchGithubJson<CanaryReleaseData>(
      "https://api.github.com/repos/tilesprivacy/tiles/releases/tags/canary",
      release => ({
        body: release.body,
        published_at: release.published_at,
        updated_at: release.updated_at,
        assets: release.assets.filter(asset => /\.pkg$/i.test(asset.name)),
      }),
      { revalidate },
    )
  } catch {
    return null
  }
})
