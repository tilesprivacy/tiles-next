import { Checkout } from "@polar-sh/nextjs"
import { NextRequest } from "next/server"
import {
  getPolarAccessToken,
  getPolarProductId,
  getPolarServer,
  isPolarCheckoutConfigured,
  polarNotConfiguredResponse,
  type PolarPaidPlanId,
} from "@/lib/polar"
import { getSiteUrl } from "@/lib/site-url"

/**
 * Redirecting checkout for one paid plan, shared by the `plus` and `pro`
 * routes. Used as the no-JS fallback for the embedded checkout on `/pricing`,
 * and linked directly from `content/licenses.mdx`.
 *
 * Fails closed with a 503 when `POLAR_ACCESS_TOKEN` is missing, before the
 * Polar SDK is constructed, so an unconfigured deploy cannot surface a broken
 * checkout.
 */
export async function handlePlanCheckout(
  request: NextRequest,
  plan: PolarPaidPlanId,
) {
  if (!isPolarCheckoutConfigured()) {
    return polarNotConfiguredResponse()
  }

  const siteUrl = getSiteUrl()

  // Default to the plan's product so the caller can just hit the route with no
  // query params.
  const url = new URL(request.url)
  if (!url.searchParams.has("products")) {
    url.searchParams.set("products", getPolarProductId(plan))
  }

  // Built lazily: `Checkout()` instantiates a Polar client immediately, and we
  // only want that to happen once the token is known to be real.
  const handler = Checkout({
    accessToken: getPolarAccessToken(),
    server: getPolarServer(),
    // `plan` lets `/pricing/success` name the plan without an API lookup.
    successUrl: `${siteUrl}/pricing/success?plan=${plan}`,
    returnUrl: `${siteUrl}/pricing`,
  })

  const response = await handler(
    new NextRequest(url, { headers: request.headers }),
  )

  // On an API failure the Polar adapter returns `NextResponse.error()`, which
  // has status 0 and makes Next throw "Invalid status code: 0" instead of
  // serving anything. Convert it into a real response.
  if (response.status === 0 || response.type === "error") {
    return Response.json(
      {
        error: "checkout_failed",
        message: "Could not start checkout. Please try again.",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    )
  }

  return response
}
