import { isPolarPaidPlanId, polarJsonError } from "#lib/server/polar"
import { createPlanCheckout } from "#lib/server/polar-plan-checkout"
import type { RequestHandler } from "./$types"

export const prerender = false

/**
 * Mints a checkout session for `?plan=plus|pro` (default `pro`) and returns its
 * URL for the embedded checkout. Only used when a plan has no public checkout
 * link; sessions are short lived, so this runs on click.
 */
export const POST: RequestHandler = async ({ request, url }) => {
  // Only our own /pricing page calls this; refuse cross-site requests.
  if (request.headers.get("origin") !== url.origin) {
    return polarJsonError(403, "forbidden", "Cross-site requests are not allowed.")
  }

  const plan = url.searchParams.get("plan")?.trim() || "pro"
  if (!isPolarPaidPlanId(plan)) {
    return polarJsonError(400, "unknown_plan", "Unknown plan.")
  }

  const result = await createPlanCheckout(plan)
  if (typeof result !== "string") return result
  return Response.json({ url: result }, { headers: { "Cache-Control": "no-store" } })
}
