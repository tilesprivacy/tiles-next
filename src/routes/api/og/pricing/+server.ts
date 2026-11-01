import { redirect } from "@sveltejs/kit"

// See api/og: prerendered into a _redirects rule.
export const prerender = true

export const GET = () => redirect(301, "/og/generated/pricing.png")
