import { error } from "@sveltejs/kit"
import { getBlogPost, getBlogPostMarkdown, getVisibleBlogPosts } from "#lib/server/blog"
import { renderMarkdown } from "#lib/markdown.server"
import type { EntryGenerator, PageServerLoad } from "./$types"

// Posts with their own route (the talk page) are not rendered from markdown.
const DEDICATED_PAGES = new Set(["own-your-ai"])

export const entries: EntryGenerator = async () =>
  (await getVisibleBlogPosts())
    .filter((post) => !DEDICATED_PAGES.has(post.slug))
    .map((post) => ({ slug: post.slug }))

export const load: PageServerLoad = async ({ params }) => {
  const post = await getBlogPost(params.slug)
  if (!post || DEDICATED_PAGES.has(post.slug)) error(404, "Not found")

  const { html, toc } = renderMarkdown(await getBlogPostMarkdown(post.slug))
  return { post, html, toc }
}
