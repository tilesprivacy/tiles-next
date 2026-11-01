/** Versions omitted from the public download page and latest-artifact APIs. */
const DOWNLOAD_HIDDEN_RELEASE_VERSIONS = new Set(["0.4.12"])

export function normalizeReleaseVersion(version: string): string {
  return version.trim().replace(/^v/i, "")
}

function matchesHiddenVersion(version: string, hiddenVersions: Set<string>): boolean {
  const normalizedVersion = normalizeReleaseVersion(version)
  return (
    hiddenVersions.has(normalizedVersion) ||
    [...hiddenVersions].some((hiddenVersion) =>
      normalizedVersion.startsWith(`${hiddenVersion}-`)
    )
  )
}

export function isDownloadReleaseVersionHidden(version: string): boolean {
  return matchesHiddenVersion(version, DOWNLOAD_HIDDEN_RELEASE_VERSIONS)
}
