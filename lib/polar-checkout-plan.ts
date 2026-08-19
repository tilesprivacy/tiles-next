import { Polar } from "@polar-sh/sdk"
import { cache } from "react"
import {
  getPolarAccessToken,
  getPolarPlanForProductId,
  getPolarServer,
  isPolarCheckoutConfigured,
  isPolarPaidPlanId,
  type PolarPaidPlanId,
} from "@/lib/polar"

/**
 * Works out which plan a completed checkout was for, so `/pricing/success` can
 * name it instead of guessing.
 *
 * Two sources, in order:
 *
 * 1. `?plan=plus|pro`. Our own checkout routes put it on their `successUrl`,
 *    and a dashboard-created Checkout Link can carry it too. No secret needed.
 * 2. The checkout id Polar appends to the success URL, looked up through the
 *    API and matched against the committed product ids. Needs
 *    `POLAR_ACCESS_TOKEN`, so it only runs where checkout is configured.
 *
 * Returns null when neither answers, and the page falls back to plan-neutral
 * copy rather than naming the wrong plan.
 *
 * Server only. Wrapped in `cache` so the page body and `generateMetadata` share
 * one lookup per request.
 */
export const resolveCheckoutPlan = cache(
  async (
    planParam: string | undefined,
    checkoutId: string | undefined,
  ): Promise<PolarPaidPlanId | null> => {
    const plan = planParam?.trim()
    if (plan && isPolarPaidPlanId(plan)) return plan

    const id = checkoutId?.trim()
    if (!id || !isPolarCheckoutConfigured()) return null

    try {
      const polar = new Polar({
        accessToken: getPolarAccessToken(),
        server: getPolarServer(),
      })
      const checkout = await polar.checkouts.get({ id })
      const productId = checkout.productId ?? checkout.product?.id
      return productId ? getPolarPlanForProductId(productId) : null
    } catch (error) {
      console.error("[polar] could not resolve checkout plan", error)
      return null
    }
  },
)
