import { redirect } from "@sveltejs/kit"

// "Open" as in open finances.
export function GET() {
  redirect(307, "/book/finances")
}
