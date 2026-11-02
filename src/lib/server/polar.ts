/**
 * Polar.sh billing configuration. Server only: this reads secrets, and lives
 * under `server/` so SvelteKit refuses to bundle it for the browser.
 *
 * Product ids and checkout links are public and committed. The access token
 * and webhook secret come from the environment, and every route fails closed
 * with a 503 while they are missing. See "Polar.sh Integration" in AGENTS.md.
 */

import {
  POLAR_ACCESS_TOKEN,
  POLAR_PLUS_CHECKOUT_LINK,
  POLAR_PLUS_PRODUCT_ID,
  POLAR_PRO_CHECKOUT_LINK,
  POLAR_PRO_PRODUCT_ID,
  POLAR_SERVER,
  POLAR_WEBHOOK_SECRET,
} from "$app/env/private"
import { PUBLIC_SITE_URL } from "$app/env/public"
import { createPolarCore } from "@polar-sh/sdk/2026-10"
import { createCheckoutsService } from "@polar-sh/sdk/2026-10/services/checkouts"
import { POLAR_BILLING_ENABLED } from "#lib/feature-flags"
import type { PolarCheckoutMode, PolarPaidPlanId } from "#lib/pricing-plans"

export type { PolarCheckoutMode, PolarPaidPlanId }

/**
 * Canonical origin for success and return URLs. Never derived from the
 * request, so a spoofed Host header cannot redirect buyers elsewhere.
 */
const SITE_ORIGIN = (PUBLIC_SITE_URL ?? "https://tiles.run").replace(/\/$/, "")

// Not secrets. Env vars override them only to point a preview at other products.
const PAID_PLANS: Record<PolarPaidPlanId, { productId: string; checkoutLink: string }> = {
  plus: {
    productId: POLAR_PLUS_PRODUCT_ID ?? "e8338574-288a-42c3-93d6-b8c5e0fa0809",
    checkoutLink:
      POLAR_PLUS_CHECKOUT_LINK ??
      "https://buy.polar.sh/polar_cl_cIV2Vl0K60hJzHJqoOCrvd2xYuQtECY6PPlPy4gdoxp",
  },
  pro: {
    productId: POLAR_PRO_PRODUCT_ID ?? "98d19697-7811-437f-933e-c5a55caa9362",
    checkoutLink:
      POLAR_PRO_CHECKOUT_LINK ??
      "https://buy.polar.sh/polar_cl_3LyXhxgqyNTiHERg0sdzEzKM7Z7jRxsFFH24d3asCns",
  },
}

// Entitlement rides on Polar license keys, which the Tiles app validates
// itself (organization 028ca25d-5316-46a1-8771-28c6403d8348, Tiles Pro
// license benefit c9ebdd84-854f-44ef-a27f-7b729dd1840e; Plus has none yet).
// This site never needs them at runtime.

export function getPolarServer(): "sandbox" | "production" {
  return POLAR_SERVER === "sandbox" ? "sandbox" : "production"
}

export function isPolarPaidPlanId(value: string): value is PolarPaidPlanId {
  return Object.hasOwn(PAID_PLANS, value)
}

export function getPolarProductId(plan: PolarPaidPlanId): string {
  return PAID_PLANS[plan].productId
}

export function getPolarPlanForProductId(productId: string): PolarPaidPlanId | null {
  for (const plan of Object.keys(PAID_PLANS) as PolarPaidPlanId[]) {
    if (PAID_PLANS[plan].productId === productId) return plan
  }
  return null
}

/** The organization access token, only when billing is on and it is set. */
export function getPolarAccessToken(): string | null {
  return POLAR_BILLING_ENABLED && POLAR_ACCESS_TOKEN ? POLAR_ACCESS_TOKEN : null
}

/** The webhook signing secret, gated separately from checkout. */
export function getPolarWebhookSecret(): string | null {
  return POLAR_BILLING_ENABLED && POLAR_WEBHOOK_SECRET ? POLAR_WEBHOOK_SECRET : null
}

/** Checkouts API client. Callers pass the token from `getPolarAccessToken()`. */
export function createPolarCheckouts(accessToken: string) {
  return createCheckoutsService(
    createPolarCore({ accessToken, environment: getPolarServer(), timeout: 15 }),
  )
}

/**
 * How the Subscribe action on `/pricing` behaves: open the public checkout
 * link directly, mint a session on click (needs the token), or render disabled.
 */
export function getPolarCheckoutMode(plan: PolarPaidPlanId): PolarCheckoutMode {
  if (!POLAR_BILLING_ENABLED) return { kind: "unavailable" }

  const link = PAID_PLANS[plan].checkoutLink
  if (link) return { kind: "link", url: link }

  if (getPolarAccessToken()) return { kind: "session" }

  return { kind: "unavailable" }
}

export function getPolarCheckoutModes(): Record<PolarPaidPlanId, PolarCheckoutMode> {
  return { plus: getPolarCheckoutMode("plus"), pro: getPolarCheckoutMode("pro") }
}

/**
 * Where Polar sends a buyer after paying. `plan` lets the page name it without
 * an API call; Polar fills in {CHECKOUT_ID} itself, so the braces stay unescaped.
 */
export function getPolarSuccessUrl(plan: PolarPaidPlanId): string {
  return `${SITE_ORIGIN}/pricing/success?plan=${plan}&checkoutId={CHECKOUT_ID}`
}

export const POLAR_RETURN_URL = `${SITE_ORIGIN}/pricing`

const noStore = { "Cache-Control": "no-store" }

export function polarJsonError(status: number, error: string, message: string): Response {
  return Response.json({ error, message }, { status, headers: noStore })
}

export function polarNotConfiguredResponse(): Response {
  return polarJsonError(503, "billing_not_configured", "Tiles billing is not configured on this server.")
}

export function polarCheckoutFailedResponse(): Response {
  return polarJsonError(502, "checkout_failed", "Could not start checkout. Please try again.")
}
