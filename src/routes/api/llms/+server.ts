import { redirect } from "@sveltejs/kit"

// Prerendered into a _redirects rule. A static file without an extension
// would be served as application/octet-stream, so the old path points at
// the .txt instead.
export const prerender = true

export const GET = () => redirect(301, "/llms.txt")
