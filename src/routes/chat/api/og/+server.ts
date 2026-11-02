import { redirect } from "@sveltejs/kit"
import { dev } from "$app/env"

export const prerender = false

// The viewer's earlier card address; crawlers may still hold it.
export function GET({ url }) {
  redirect(301, `${dev ? "/chat" : ""}/og${url.search}`)
}
