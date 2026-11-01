// Where blog posts come from. In `npm run dev` it's the markdown files in
// content/blog, so writers see a post before it's published anywhere. Builds
// for deployment read the posts from the Tiles PDS instead, which makes the
// published records the source of truth for what tiles.run shows.
import { dev } from "$app/env"
import { parseBlogPost, type BlogPost, type BlogPostMeta } from "#lib/blog"
import { BLOG_SLUG_PATTERN } from "#lib/blog-atproto"
import { loadBlogPostsFromPds } from "#lib/server/blog-pds"

// Lazy, so production bundles never load the local files.
const localSources = import.meta.glob(["/content/blog/*.md", "!/content/blog/README.md"], {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>

async function loadLocalPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = []
  for (const [path, load] of Object.entries(localSources)) {
    const slug = path.split("/").pop()!.replace(/\.md$/, "")
    if (!BLOG_SLUG_PATTERN.test(slug)) throw new Error(`Blog file name isn't a valid slug: ${path}`)
    posts.push(parseBlogPost(slug, await load()))
  }
  return posts
}

const newestFirst = (a: BlogPost, b: BlogPost) =>
  b.meta.date.getTime() - a.meta.date.getTime() || a.meta.slug.localeCompare(b.meta.slug)

let pdsPosts: Promise<BlogPost[]> | undefined

// Dev rereads the files every time so edits show on refresh. Builds fetch the
// PDS once; if it can't be reached the build fails rather than shipping a
// blog with posts missing.
function loadPosts(): Promise<BlogPost[]> {
  if (dev) return loadLocalPosts().then((posts) => posts.sort(newestFirst))
  pdsPosts ??= loadBlogPostsFromPds().then((posts) => posts.sort(newestFirst))
  return pdsPosts
}

/** Published posts, newest first. Used by listings, RSS, sitemap and LLM indexes. */
export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  return (await loadPosts()).filter((post) => !post.meta.draft).map((post) => post.meta)
}

/** Posts that get a page: drafts only show in dev. */
export async function getVisibleBlogPosts(): Promise<BlogPostMeta[]> {
  return (await loadPosts()).filter((post) => dev || !post.meta.draft).map((post) => post.meta)
}

export async function getBlogPost(slug: string): Promise<BlogPostMeta | undefined> {
  return (await getVisibleBlogPosts()).find((post) => post.slug === slug)
}

/** Markdown body without frontmatter. */
export async function getBlogPostMarkdown(slug: string): Promise<string> {
  return (await loadPosts()).find((post) => post.meta.slug === slug)?.body ?? ""
}
