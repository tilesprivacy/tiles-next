import { redirect } from "@sveltejs/kit"
import { SHOW_PRICING } from "#lib/feature-flags"
import { getPolarCheckoutModes } from "#lib/server/polar"
import type { PageServerLoad } from "./$types"

// Rendered per request so checkout-link overrides in the environment apply.
export const prerender = false

export const load: PageServerLoad = () => {
  if (!SHOW_PRICING) redirect(307, "/download")

  return { checkoutModes: getPolarCheckoutModes() }
}
