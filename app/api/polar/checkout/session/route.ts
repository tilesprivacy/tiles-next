import { Polar } from "@polar-sh/sdk"
import {
  getPolarAccessToken,
  getPolarProProductId,
  getPolarServer,
  isPolarCheckoutConfigured,
  polarNotConfiguredResponse,
} from "@/lib/polar"
import { getSiteUrl } from "@/lib/site-url"

/**
 * Mints a Tiles Pro checkout session and returns its URL as JSON, for the
 * embedded checkout on `/pricing` to open in an iframe.
 *
 * Only used when no public Polar Checkout Link is configured. Sessions are
 * short lived, so this runs on click rather than at page render.
 */
export async function POST() {
  if (!isPolarCheckoutConfigured()) {
    return polarNotConfiguredResponse()
  }

  const siteUrl = getSiteUrl()

  // Polar substitutes {CHECKOUT_ID} server side, so keep the braces unescaped.
  const successUrl = new URL(`${siteUrl}/pricing/success`)
  successUrl.searchParams.set("checkoutId", "{CHECKOUT_ID}")

  const polar = new Polar({
    accessToken: getPolarAccessToken(),
    server: getPolarServer(),
  })

  try {
    const checkout = await polar.checkouts.create({
      products: [getPolarProProductId()],
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
