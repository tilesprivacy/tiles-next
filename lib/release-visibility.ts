const HIDDEN_RELEASE_VERSIONS = new Set(["0.4.12"])

export function normalizeReleaseVersion(version: string): string {
  return version.trim().replace(/^v/i, "")
}

export function isReleaseVersionHidden(version: string): boolean {
  return HIDDEN_RELEASE_VERSIONS.has(normalizeReleaseVersion(version))
}
