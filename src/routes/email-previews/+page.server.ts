import { dev } from "$app/env"
import { error } from "@sveltejs/kit"

// Development-only gallery of the email template.
export const prerender = false

export const load = () => {
  if (!dev) error(404, "Not found")
}
