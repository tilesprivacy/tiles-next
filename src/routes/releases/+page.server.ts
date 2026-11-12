import {
  LATEST_RELEASE_SECTIONS,
  LATEST_RELEASE_TITLE,
  LATEST_RELEASE_VERSION,
} from "#lib/latest-release-copy"
import { fetchReleases, type Release } from "#lib/releases"
import { normalizeReleaseVersion } from "#lib/release-visibility"
import type { PageServerLoad } from "./$types"

// Live from GitHub on each request; fetchReleases falls back to the
// saved release data when the API is unavailable.
export const prerender = false

export const load: PageServerLoad = async ({ setHeaders }) => {
  // Same five minutes the original kept GitHub responses for.
  setHeaders({ "Cache-Control": "public, max-age=300" })

  let releases: Release[] = []
  let error: string | null = null

  try {
    // The hand-written copy only applies to the release it was written for.
    releases = (await fetchReleases())
      // Its notes are included in 0.5.1.
      .filter((release) => normalizeReleaseVersion(release.version) !== "0.5.0")
      .map((release) =>
        normalizeReleaseVersion(release.version) === LATEST_RELEASE_VERSION
          ? { ...release, title: LATEST_RELEASE_TITLE, sections: LATEST_RELEASE_SECTIONS }
          : release,
      )
  } catch {
    error = "Failed to load releases. Please try again later."
  }

  return { releases, error }
}
