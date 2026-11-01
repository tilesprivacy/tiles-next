import { error } from "@sveltejs/kit"
import { getBlogPost } from "#lib/server/blog"
import type { PageServerLoad } from "./$types"

// Listed with the other posts (own-your-ai.md), but the page
// itself is built from the talk's slides.
export const load: PageServerLoad = async () => {
  const post = await getBlogPost("own-your-ai")
  if (!post) error(404, "Not found")
  return { post }
}
