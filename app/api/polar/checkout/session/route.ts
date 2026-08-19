import { Polar } from "@polar-sh/sdk"
import type { NextRequest } from "next/server"
import {
  getPolarAccessToken,
  getPolarProductId,
  getPolarServer,
  isPolarCheckoutConfigured,
  isPolarPaidPlanId,
  polarNotConfiguredResponse,
} from "@/lib/polar"
import { getSiteUrl } from "@/lib/site-url"

/**
 * Mints a checkout session for one paid plan and returns its URL as JSON, for
 * the embedded checkout on `/pricing` to open in an iframe.
 *
 * The plan comes from `?plan=plus|pro` and defaults to `pro`. Only used when no
 * public Polar Checkout Link is configured for that plan. Sessions are short
 * lived, so this runs on click rather than at page render.
 */
export async function POST(request: NextRequest) {
  if (!isPolarCheckoutConfigured()) {
    return polarNotConfiguredResponse()
  }

  const requestedPlan = request.nextUrl.searchParams.get("plan")?.trim() ?? "pro"
  if (!isPolarPaidPlanId(requestedPlan)) {
    return Response.json(
      { error: "unknown_plan", message: `Unknown plan "${requestedPlan}".` },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    )
  }

  const siteUrl = getSiteUrl()

  // Polar substitutes {CHECKOUT_ID} server side, so keep the braces unescaped.
  // `plan` lets `/pricing/success` name the plan without an API lookup.
  const successUrl = new URL(`${siteUrl}/pricing/success`)
  successUrl.searchParams.set("plan", requestedPlan)
  successUrl.searchParams.set("checkoutId", "{CHECKOUT_ID}")

  const polar = new Polar({
    accessToken: getPolarAccessToken(),
    server: getPolarServer(),
  })

  try {
    const checkout = await polar.checkouts.create({
      products: [getPolarProductId(requestedPlan)],
      successUrl: decodeURI(successUrl.toString()),
    })

    return Response.json(
      { url: checkout.url },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("[polar] failed to create checkout session", error)
    return Response.json(
      {
        error: "checkout_failed",
        message: "Could not start checkout. Please try again.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    )
  }
}
