import { resolveCheckoutPlan } from "#lib/server/polar-checkout-plan"
import type { PageServerLoad } from "./$types"

// Depends on the query string, so it can't be prerendered.
export const prerender = false

export const load: PageServerLoad = async ({ url, setHeaders }) => {
  setHeaders({ "Cache-Control": "private, no-store" })

  // Our {CHECKOUT_ID} template and dashboard Checkout Links spell the id differently.
  const plan = await resolveCheckoutPlan(
    url.searchParams.get("plan"),
    url.searchParams.get("checkoutId") ?? url.searchParams.get("checkout_id"),
  )

  return { plan: plan ?? ("unknown" as const) }
}
