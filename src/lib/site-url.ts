/**
 * Canonical site origin for server-side absolute URLs (Polar successUrl, returnUrl, etc.).
 * Prefer NEXT_PUBLIC_SITE_URL in local dev (e.g. http://localhost:3000).
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) {
    return configured.replace(/\/$/, "")
  }

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "")
    return `https://${host}`
  }

  return "https://www.tiles.run"
}
