import { redirect } from "@sveltejs/kit"

// The sponsor page became a section of /about.
export function GET() {
  redirect(308, "/about#sponsor")
}
