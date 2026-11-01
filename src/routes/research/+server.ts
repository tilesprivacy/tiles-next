import { redirect } from "@sveltejs/kit"

export const prerender = false

// Research explorations are listed in the book.
export function GET() {
  redirect(307, "/book/research")
}
