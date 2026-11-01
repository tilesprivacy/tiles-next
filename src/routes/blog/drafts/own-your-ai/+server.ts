import { redirect } from "@sveltejs/kit"

export const prerender = false

// The draft talk was published as /tiles-at-india-foss.
export function GET() {
  redirect(307, "/tiles-at-india-foss")
}
