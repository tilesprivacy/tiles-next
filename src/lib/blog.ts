// Blog posts are the markdown files in content/blog. Everything the site
// knows about a post (listing card, metadata, ATproto links) comes from the
// frontmatter; the body is rendered by markdown.server.ts.
import { dev } from "$app/env"
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
  /** Social card image, published to ATproto by sequoia as well. */
  ogImage?: string
  ogImageWidth: number
  ogImageHeight: number
  ogImageAlt?: string
  tags: string[]
  keywords: string[]
  section?: string
  twitterCreator?: string
  /** at:// URI of the site.standard.document record, written by the publish CI. */
  atUri?: string
  /** at:// URI of the Bluesky post whose replies form the discussion. */
  blueskyPostUri?: string
  toc: boolean
  bodyClass?: string
  draft: boolean
}

const sources = import.meta.glob(["/content/blog/*.md", "!/content/blog/README.md"], {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

function toPost(path: string, source: string): { meta: BlogPostMeta; body: string } {
  const slug = path.split("/").pop()!.replace(/\.md$/, "")
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
    atUri: str(data.atUri),
    blueskyPostUri: str(data.blueskyPostUri),
    toc: data.toc !== false,
    bodyClass: str(data.bodyClass),
    draft: data.draft === true,
  }

  // A leading "# Title" is allowed (it reads well on GitHub) but the page
  // already renders the title, so drop it.
  return { meta, body: body.replace(/^\s*#\s[^\n]*\n/, "").replace(/^\s+/, "") }
}

const posts = Object.entries(sources)
  .map(([path, source]) => toPost(path, source))
  .sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime() || a.meta.slug.localeCompare(b.meta.slug))

/** Published posts, newest first. Used by listings, RSS, sitemap and LLM indexes. */
export function getBlogPosts(): BlogPostMeta[] {
  return posts.filter((post) => !post.meta.draft).map((post) => post.meta)
}

/** Posts that get a page in this environment: drafts only show in dev. */
export function getVisibleBlogPosts(): BlogPostMeta[] {
  return posts.filter((post) => !post.meta.draft || dev).map((post) => post.meta)
}

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return getVisibleBlogPosts().find((post) => post.slug === slug)
}

/** Markdown body without frontmatter. */
export function getBlogPostMarkdown(slug: string): string {
  return posts.find((post) => post.meta.slug === slug)?.body ?? ""
}

/** "February 17, 2026", as shown under a post title. */
export function formatBlogPostDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
