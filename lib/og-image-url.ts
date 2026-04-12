/** Appends a cache-busting query param so updated OG images are not served stale from social/CDN caches. */
export function getOGImageUrl(baseUrl: string): string {
  const version = Date.now()
  const separator = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${separator}v=${version}`
}
