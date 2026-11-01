// standard.site (ATproto) identity for the blog. The publication URI must
// match `publicationUri` in sequoia.json, which the publish CI uses.
import { SITE_ORIGIN } from "#lib/absolute-url"

export const STANDARD_SITE_PUBLICATION_URI =
  "at://did:plc:mqmcsjuerbjhu65mpmvkcuw2/site.standard.publication/3mnmiw6ypye2s"

const DEFAULT_BLOG_OG_IMAGE_PATH = "/og-image.jpg"

/** Absolute social card URL. Cards need a raster image (PNG/JPEG/WebP), never SVG. */
export function toBlogSocialImageUrl(assetPath?: string): string {
  const path = assetPath?.trim() || DEFAULT_BLOG_OG_IMAGE_PATH
  if (path.startsWith("http")) return path
  return `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`
}

export function socialImageType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase()
  if (ext === "png") return "image/png"
  if (ext === "webp") return "image/webp"
  return "image/jpeg"
}

export const BLOG_LISTING_SOCIAL_IMAGE_URL = toBlogSocialImageUrl(DEFAULT_BLOG_OG_IMAGE_PATH)

/** Body of /.well-known/site.standard.publication, which proves we own the publication. */
export function standardSitePublicationResponse(): Response {
  return new Response(`${STANDARD_SITE_PUBLICATION_URI}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
