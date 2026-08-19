/**
 * Open Graph images for the site's own pages.
 *
 * Every page here is served by `app/api/og/route.tsx`, which draws the page
 * title onto the site card. Two rules this module exists to hold:
 *
 * - Social images are served from this site, never from a third party. Pages
 *   used to point at `raw.githubusercontent.com/.../main/public/...`, which
 *   tracked a branch, went around `metadataBase`, and broke every card at once
 *   whenever a file moved or the repo's visibility changed.
 * - A page's card names that page. One shared image across Pricing, Terms,
 *   Roadmap, and the rest tells a reader nothing about where a link goes.
 *
 * Pages with their own artwork stay on it: blog posts use their cover images
 * (`lib/standard-site.ts`), and `/pricing` uses `app/api/og/pricing`.
 */

/** Matches the `size` export in `app/api/og/route.tsx`. */
export const SOCIAL_IMAGE_WIDTH = 1200
export const SOCIAL_IMAGE_HEIGHT = 630

export interface SocialImage {
  url: string
  width: number
  height: number
  type: "image/png"
  alt: string
}

/**
 * Card for one page. `title` is what gets drawn, so pass the page name on its
 * own ("Pricing"), not the full document title.
 *
 * Relative on purpose: Next resolves it against `metadataBase` in
 * `app/layout.tsx`, so preview and production each point at themselves.
 */
export function getSocialImage(title?: string): SocialImage {
  const url = title
    ? `/api/og?title=${encodeURIComponent(title)}`
    : "/api/og"

  return {
    url,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    type: "image/png",
    alt: title ? `${title} | Tiles` : "Tiles",
  }
}

/** The same card, for the `twitter.images` shorthand that takes a bare URL. */
export function getSocialImageUrl(title?: string): string {
  return getSocialImage(title).url
}
