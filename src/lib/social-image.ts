/**
 * Open Graph images for the site's own pages.
 *
 * Every page here is served by `app/api/og/route.tsx`, which draws the Tiles
 * name onto the shared site card. Two rules this module exists to hold:
 *
 * - Social images are served from this site, never from a third party. Pages
 *   used to point at `raw.githubusercontent.com/.../main/public/...`, which
 *   tracked a branch, went around `metadataBase`, and broke every card at once
 *   whenever a file moved or the repo's visibility changed.
 * - General site pages use one visually consistent Tiles card. Their page
 *   names remain available in the Open Graph and Twitter title metadata.
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
 * Shared Tiles card for a site page. `title` is only used for descriptive alt
 * text; the image itself always displays the Tiles brand name.
 *
 * Relative on purpose: Next resolves it against `metadataBase` in
 * `app/layout.tsx`, so preview and production each point at themselves.
 */
export function getSocialImage(title?: string): SocialImage {
  return {
    url: "/api/og",
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

interface PluginSocialImageInput {
  slug: string
  name: string
  description: string
}

/** Card for a plugin detail page, using the plugin's own identity and copy. */
export function getPluginSocialImage({
  slug,
  name,
  description,
}: PluginSocialImageInput): SocialImage {
  const searchParams = new URLSearchParams({ slug, name, description })

  return {
    url: `/api/og/plugin?${searchParams.toString()}`,
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    type: "image/png",
    alt: `${name} plugin for Tiles: ${description}`,
  }
}
