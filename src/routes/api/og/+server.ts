import { redirect } from "@sveltejs/kit"

// The card is a static file now; old shared links still land on it.
// Prerendered into a _redirects rule.
export const prerender = true

export const GET = () => redirect(301, "/og/generated/og.png")
