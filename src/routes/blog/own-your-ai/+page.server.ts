import { error } from "@sveltejs/kit"
import { getBlogPost } from "#lib/blog"
import type { PageServerLoad } from "./$types"

// Listed with the other posts (content/blog/own-your-ai.md), but the page
// itself is built from the talk's slides.
export const load: PageServerLoad = () => {
  const post = getBlogPost("own-your-ai")
  if (!post) error(404, "Not found")
  return { post }
}
