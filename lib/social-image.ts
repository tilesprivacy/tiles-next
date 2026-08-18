import { TILES_SITE_TITLE } from "@/lib/product-description"

/**
 * Canonical origin for absolute social URLs.
 *
 * Open Graph and Twitter crawlers need absolute URLs, and those URLs have to be
 * served from our own domain. Pointing them at
 * `raw.githubusercontent.com/.../public/own-your-ai-og.png` made every link
 * preview depend on GitHub's raw file endpoint, which is not an image CDN: it
 * rate-limits unauthenticated traffic (crawlers fetching from shared datacenter
 * IPs get `429` instead of bytes), answers with `Content-Security-Policy:
 * default-src 'none'; sandbox` plus `X-Content-Type-Options: nosniff`, varies on
 * `Authorization`, and caches for only five minutes. It also pinned the `main`
 * branch, so moving or renaming the asset would silently 404. The result was
 * pages that advertised an `og:image` no scraper could actually load.
 */
export const SITE_ORIGIN = "https://www.tiles.run"

/**
 * Default social card, rendered by `app/api/og/route.tsx`.
 *
 * Generating it keeps the tagline in sync with
 * `TILES_PRODUCT_DESCRIPTION_CORE` in `lib/product-description.ts` instead of
 * baking copy into a checked-in raster that goes stale.
 */
export const DEFAULT_SOCIAL_IMAGE_PATH = "/api/og"

/** Pricing-specific card, rendered by `app/api/og/pricing/route.tsx`. */
export const PRICING_SOCIAL_IMAGE_PATH = "/api/og/pricing"

/** Both generated cards use the 1.91:1 dimensions crawlers expect. */
export const SOCIAL_IMAGE_WIDTH = 1200
export const SOCIAL_IMAGE_HEIGHT = 630

/** Matches the `contentType` exported by the `/api/og` routes. */
export const SOCIAL_IMAGE_TYPE = "image/png"

/** Absolute `og:image` URL for a social card served from this site. */
export function toAbsoluteSocialUrl(path: string): string {
  if (path.startsWith("http")) {
    return path
  }

  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

export const DEFAULT_SOCIAL_IMAGE_URL = toAbsoluteSocialUrl(DEFAULT_SOCIAL_IMAGE_PATH)
export const PRICING_SOCIAL_IMAGE_URL = toAbsoluteSocialUrl(PRICING_SOCIAL_IMAGE_PATH)

/**
 * Builds an `openGraph.images` entry for a generated social card. Declaring
 * width, height, and type lets crawlers lay the preview out before the image
 * finishes downloading.
 */
export function socialImage(
  alt: string = TILES_SITE_TITLE,
  path: string = DEFAULT_SOCIAL_IMAGE_PATH,
) {
  return {
    url: toAbsoluteSocialUrl(path),
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    type: SOCIAL_IMAGE_TYPE,
    alt,
  }
}
