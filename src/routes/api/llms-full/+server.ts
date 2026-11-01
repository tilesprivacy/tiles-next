import { redirect } from "@sveltejs/kit"

// See api/llms: prerendered into a _redirects rule.
export const prerender = true

export const GET = () => redirect(301, "/llms-full.txt")
