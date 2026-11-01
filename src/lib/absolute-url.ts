// Social tags need absolute URLs. The original resolved these against
// metadataBase (https://www.tiles.run) on every environment, so do the same.
export const SITE_ORIGIN = "https://www.tiles.run"

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).href
}
