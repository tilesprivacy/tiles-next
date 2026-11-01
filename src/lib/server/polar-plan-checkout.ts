import { redirect } from "@sveltejs/kit"
import {
  createPolarCheckouts,
  getPolarAccessToken,
  getPolarProductId,
  getPolarSuccessUrl,
  polarCheckoutFailedResponse,
  polarNotConfiguredResponse,
  POLAR_RETURN_URL,
  type PolarPaidPlanId,
} from "./polar"

/**
 * Mints a checkout session for one plan. Only our fixed product id and URLs
 * are sent: nothing from the visitor's query string reaches Polar.
 */
export async function createPlanCheckout(plan: PolarPaidPlanId): Promise<string | Response> {
  const accessToken = getPolarAccessToken()
  if (!accessToken) return polarNotConfiguredResponse()

  try {
    const checkout = await createPolarCheckouts(accessToken).create({
      products: [getPolarProductId(plan)],
      success_url: getPolarSuccessUrl(plan),
      return_url: POLAR_RETURN_URL,
    })
    return checkout.url
  } catch (error) {
    console.error("[polar] failed to create checkout session", error)
    return polarCheckoutFailedResponse()
  }
}

/**
 * Redirecting checkout behind `/api/polar/checkout/<plan>`: the no-JS
 * fallback for the embedded checkout, also linked from the licenses page.
 */
export async function handlePlanCheckout(plan: PolarPaidPlanId): Promise<Response> {
  const result = await createPlanCheckout(plan)
  if (typeof result !== "string") return result
  redirect(303, result)
}
