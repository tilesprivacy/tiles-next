import { redirect } from "@sveltejs/kit"

export const prerender = false

// The post was renamed after it was first shared.
export function GET() {
  redirect(308, "/blog/tiles-joins-mozilla-ai-incubator")
}
