import { redirect } from "@sveltejs/kit"

export const prerender = false

export function GET() {
  redirect(308, "/tiles-at-india-foss")
}
