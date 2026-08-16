import { Checkout } from "@polar-sh/nextjs"
import { NextRequest } from "next/server"
import {
  getPolarAccessToken,
  getPolarProProductId,
  getPolarServer,
  isPolarCheckoutConfigured,
  polarNotConfiguredResponse,
} from "@/lib/polar"
import { getSiteUrl } from "@/lib/site-url"

/**
 * Checkout for the Tiles Pro subscription linked from `/pricing`.
 *
 * Fails closed with a 503 when `POLAR_ACCESS_TOKEN` is missing, before the
 * Polar SDK is constructed, so an unconfigured deploy cannot surface a broken
 * checkout.
 */
export async function GET(request: NextRequest) {
  if (!isPolarCheckoutConfigured()) {
    return polarNotConfiguredResponse()
  }

  const siteUrl = getSiteUrl()

  // Default to the Tiles Pro product so the caller can just hit
  // `/api/polar/checkout/pro` with no query params.
  const url = new URL(request.url)
  if (!url.searchParams.has("products")) {
    url.searchParams.set("products", getPolarProProductId())
  }

  // Built lazily: `Checkout()` instantiates a Polar client immediately, and we
  // only want that to happen once the token is known to be real.
  const handler = Checkout({
    accessToken: getPolarAccessToken(),
    server: getPolarServer(),
    successUrl: `${siteUrl}/pricing/success`,
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
