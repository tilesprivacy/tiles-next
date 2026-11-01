// What a blog post is, parsed from its markdown file. The file is the same
// whether it comes from content/blog (dev) or from the PDS (production):
// see #lib/server/blog for where posts are loaded from.
import { list, num, parseFrontmatter, str } from "#lib/frontmatter"
import { getPersonById } from "#lib/people"

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: Date
  /** `publishDate` exactly as written (YYYY-MM-DD). */
  publishDate: string
  updatedAt?: string
  /** Person ID from `people.ts`. */
  author?: string
  coverImage?: string
  coverImageDark?: string
  coverAlt?: string
  coverWidth: number
  coverHeight: number
  /** False when the cover is only for social cards and the listing. */
  showCover: boolean
  listingImage?: string
  listingImageDark?: string
  listingImagePosition?: "left" | "center" | "right"
  /** Social card image, also uploaded to the PDS record. */
  ogImage?: string
  ogImageWidth: number
  ogImageHeight: number
  ogImageAlt?: string
  tags: string[]
  keywords: string[]
  section?: string
  twitterCreator?: string
  /** at:// URI of the site.standard.document record; set from the PDS in production builds. */
  atUri?: string
  /** at:// URI of the Bluesky post whose replies form the discussion. */
  blueskyPostUri?: string
  toc: boolean
  bodyClass?: string
  draft: boolean
}

export interface BlogPost {
  meta: BlogPostMeta
  /** Markdown body without frontmatter. */
  body: string
}

export function parseBlogPost(slug: string, source: string): BlogPost {
  const { data, body } = parseFrontmatter(source)
  const publishDate = str(data.publishDate) ?? "1970-01-01"
  const author = str(data.author)
  const tags = list(data.tags)
  const position = str(data.listingImagePosition)

  const meta: BlogPostMeta = {
    slug,
    title: str(data.title) ?? slug,
    description: str(data.description) ?? "",
    date: new Date(`${publishDate}T00:00:00Z`),
    publishDate,
    updatedAt: str(data.updatedAt),
    author: author && getPersonById(author) ? author : undefined,
    coverImage: str(data.coverImage),
    coverImageDark: str(data.coverImageDark),
    coverAlt: str(data.coverAlt),
    coverWidth: num(data.coverWidth) ?? 1200,
    coverHeight: num(data.coverHeight) ?? 600,
    showCover: data.showCover !== false,
    listingImage: str(data.listingImage),
    listingImageDark: str(data.listingImageDark),
    listingImagePosition:
      position === "left" || position === "right" || position === "center" ? position : undefined,
    ogImage: str(data.ogImage),
    ogImageWidth: num(data.ogImageWidth) ?? 1200,
    ogImageHeight: num(data.ogImageHeight) ?? 630,
    ogImageAlt: str(data.ogImageAlt),
    tags,
    keywords: data.keywords === undefined ? tags : list(data.keywords),
    section: str(data.section),
    twitterCreator: str(data.twitterCreator),
    blueskyPostUri: str(data.blueskyPostUri),
    toc: data.toc !== false,
    bodyClass: str(data.bodyClass),
    draft: data.draft === true,
  }

  // A leading "# Title" is allowed (it reads well on GitHub) but the page
  // already renders the title, so drop it.
  return { meta, body: body.replace(/^\s*#\s[^\n]*\n/, "").replace(/^\s+/, "") }
}
