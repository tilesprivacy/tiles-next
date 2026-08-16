import { Checkout } from "@polar-sh/nextjs"
import { NextRequest } from "next/server"
import {
  getPolarAccessToken,
  getPolarProProductId,
  getPolarServer,
  isPolarBillingLive,
  polarBillingNotLiveResponse,
} from "@/lib/polar"
import { getSiteUrl } from "@/lib/site-url"

/**
 * Checkout for the $10/month Pro plan on `/pricing`.
 *
 * Inert until the 0.5.0 Private Beta: `isPolarBillingLive()` is false while the
 * spoofed placeholders in `lib/polar.ts` are in place, so this returns 503
 * before the Polar SDK is ever constructed. `/pricing` does not link here yet.
 */
export async function GET(request: NextRequest) {
  if (!isPolarBillingLive()) {
    return polarBillingNotLiveResponse()
  }

  const siteUrl = getSiteUrl()

  // Default to the Pro product so the id stays server side and callers can
  // just hit `/api/polar/checkout/pro` with no query params.
  const url = new URL(request.url)
  if (!url.searchParams.has("products")) {
    url.searchParams.set("products", getPolarProProductId())
  }

  // Built lazily: `Checkout()` instantiates a Polar client immediately, and we
  // only want that to happen once real credentials are configured.
  const handler = Checkout({
    accessToken: getPolarAccessToken(),
    server: getPolarServer(),
    successUrl: `${siteUrl}/download`,
    returnUrl: `${siteUrl}/pricing`,
  })

  return handler(new NextRequest(url, { headers: request.headers }))
}
