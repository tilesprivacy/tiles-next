import { fetchGithubJson } from "#lib/github-json"

export interface CanaryReleaseData {
  body: string | null
  published_at: string | null
  updated_at: string | null
  assets: Array<{ name: string; size: number; browser_download_url: string }>
}

type CanaryAsset = CanaryReleaseData["assets"][number]

const stringOrNull = (value: unknown) => (typeof value === "string" ? value : null)

function toPkgAsset(asset: unknown): CanaryAsset | null {
  if (typeof asset !== "object" || asset === null) return null
  const { name, size, browser_download_url } = asset as Record<string, unknown>
  if (typeof name !== "string" || !/\.pkg$/i.test(name)) return null
  if (typeof size !== "number" || typeof browser_download_url !== "string") return null
  // Only the fields the page uses; GitHub's asset objects are large.
  return { name, size, browser_download_url }
}

function toCanaryRelease(release: unknown): CanaryReleaseData {
  if (typeof release !== "object" || release === null) throw new Error("Unexpected canary release shape")
  const { body, published_at, updated_at, assets } = release as Record<string, unknown>
  return {
    body: stringOrNull(body),
    published_at: stringOrNull(published_at),
    updated_at: stringOrNull(updated_at),
    assets: Array.isArray(assets) ? assets.map(toPkgAsset).filter((asset) => asset !== null) : [],
  }
}

/** The rolling `canary` release's macOS installers, or null when GitHub is unavailable. Server only. */
export async function getCanaryRelease(revalidate = 300): Promise<CanaryReleaseData | null> {
  try {
    return await fetchGithubJson<unknown, CanaryReleaseData>(
      "https://api.github.com/repos/tilesprivacy/tiles/releases/tags/canary",
      toCanaryRelease,
      { revalidate },
    )
  } catch {
    return null
  }
}
