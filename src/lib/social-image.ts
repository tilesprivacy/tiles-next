/**
 * Open Graph images for the site's own pages.
 *
 * The cards are drawn at build time by `scripts/og-images.ts` into
 * `static/og/generated/`. Two rules this module exists to hold:
 *
 * - Social images are served from this site, never from a third party, so a
 *   moved file or a repo visibility change can't break every card at once.
 * - General site pages use one visually consistent Tiles card. Their page
 *   names remain available in the Open Graph and Twitter title metadata.
 *
 * Pages with their own artwork stay on it: blog posts use their cover images
 * (`standard-site.ts`), `/pricing` and each plugin have their own card.
 */
import { SITE_ORIGIN } from "#lib/absolute-url"

/** Size of every generated card. */
export const SOCIAL_IMAGE_WIDTH = 1200
export const SOCIAL_IMAGE_HEIGHT = 630

export interface SocialImage {
  url: string
  width: number
  height: number
  type: "image/png"
  alt: string
}

/** Absolute URL of a card in `static/og/generated/`. */
export function generatedOgImageUrl(fileName: string): string {
  return `${SITE_ORIGIN}/og/generated/${fileName}`
}

function card(fileName: string, alt: string): SocialImage {
  return {
    url: generatedOgImageUrl(fileName),
    width: SOCIAL_IMAGE_WIDTH,
    height: SOCIAL_IMAGE_HEIGHT,
    type: "image/png",
    alt,
  }
}

/**
 * Shared Tiles card for a site page. `title` is only used for descriptive alt
 * text; the image itself always displays the Tiles brand name.
 */
export function getSocialImage(title?: string): SocialImage {
  return card("og.png", title ? `${title} | Tiles` : "Tiles")
}

/** The same card, for the `twitter.images` shorthand that takes a bare URL. */
export function getSocialImageUrl(title?: string): string {
  return getSocialImage(title).url
}

/** The /pricing card, which shows the plans. */
export function getPricingSocialImageUrl(): string {
  return generatedOgImageUrl("pricing.png")
}

interface PluginSocialImageInput {
  slug: string
  name: string
  description: string
}

/** Card for a plugin detail page, using the plugin's own identity and copy. */
export function getPluginSocialImage({ slug, name, description }: PluginSocialImageInput): SocialImage {
  return card(`plugin-${slug}.png`, `${name} plugin for Tiles: ${description}`)
}
