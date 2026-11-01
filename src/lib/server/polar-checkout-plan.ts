import {
  createPolarCheckouts,
  getPolarAccessToken,
  getPolarPlanForProductId,
  isPolarPaidPlanId,
  type PolarPaidPlanId,
} from "./polar"

// Polar checkout ids are UUIDs. Anything else never reaches the API.
const CHECKOUT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Which plan a completed checkout was for, so `/pricing/success` can name it.
 *
 * `?plan=` wins (our checkout routes set it, and dashboard Checkout Links can
 * carry it). Otherwise the checkout id Polar appends is looked up and matched
 * against our product ids, which needs the access token. Null means the page
 * falls back to plan-neutral copy rather than guessing.
 */
export async function resolveCheckoutPlan(
  planParam: string | null,
  checkoutId: string | null,
): Promise<PolarPaidPlanId | null> {
  const plan = planParam?.trim()
  if (plan && isPolarPaidPlanId(plan)) return plan

  const id = checkoutId?.trim()
  const accessToken = getPolarAccessToken()
  if (!id || !CHECKOUT_ID_PATTERN.test(id) || !accessToken) return null

  try {
    const checkout = await createPolarCheckouts(accessToken).get(id)
    const productId = checkout.product_id ?? checkout.product?.id
    return productId ? getPolarPlanForProductId(productId) : null
  } catch (error) {
    console.error("[polar] could not resolve checkout plan", error)
    return null
  }
}
