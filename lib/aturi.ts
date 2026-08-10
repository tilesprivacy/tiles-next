/**
 * Universal Atmosphere links, per https://aturi.to/docs.
 *
 * aturi.to turns an `at://` URI into a landing page where readers pick
 * their preferred AT Protocol client, so one URL works for everyone.
 */
export function buildAturiUrl(atUri: string): string | null {
  if (!atUri.startsWith("at://")) {
    return null
  }

  return `https://aturi.to/profile/${atUri.replace(/^at:\/\//, "")}`
}
