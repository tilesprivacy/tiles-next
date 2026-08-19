/**
 * Polar.sh billing configuration.
 *
 * The integration is real: `POLAR_BILLING_ENABLED` is on and the Tiles Plus and
 * Tiles Pro product ids below are the live ones. What is deliberately NOT
 * committed is the pair of secrets, which stay spoofed until they are set in
 * the environment.
 * Checkout therefore fails closed with a 503 until `POLAR_ACCESS_TOKEN` is
 * present, rather than erroring somewhere inside the Polar SDK.
 *
 * Server only: these read `process.env` and must not be imported into client
 * components. `app/pricing/page.tsx` resolves the checkout state server side
 * and passes it down as a prop.
 *
 * See the "Polar.sh Integration" section of AGENTS.md for the go-live steps.
 */

import { POLAR_BILLING_ENABLED } from "@/lib/feature-flags"

/**
 * Spoofed placeholders for the two secrets. These are intentionally not real
 * credentials, and are shaped so a missing env var can never be mistaken for a
 * working secret.
 */
export const POLAR_PLACEHOLDER_ACCESS_TOKEN =
  "polar_oat_SPOOFED_PLACEHOLDER_NOT_A_REAL_TOKEN"
export const POLAR_PLACEHOLDER_WEBHOOK_SECRET =
  "polar_whs_SPOOFED_PLACEHOLDER_NOT_A_REAL_SECRET"

/** The paid plans on `/pricing`, each backed by its own Polar product. */
export type PolarPaidPlanId = "plus" | "pro"

/**
 * Live Polar products backing the paid subscriptions.
 *
 * Product ids are not secrets, so these are committed as the defaults and only
 * need `POLAR_PLUS_PRODUCT_ID` / `POLAR_PRO_PRODUCT_ID` set to point a preview
 * build somewhere else. Both live under the same Polar organization.
 */
export const POLAR_PLUS_PRODUCT_ID = "e8338574-288a-42c3-93d6-b8c5e0fa0809"
export const POLAR_PRO_PRODUCT_ID = "98d19697-7811-437f-933e-c5a55caa9362"

/**
 * Public Polar Checkout Links, opened directly by the embedded checkout on
 * `/pricing`.
 *
 * Create one per product in the Polar dashboard (**Checkout Links > New Link**)
 * and paste the resulting `https://buy.polar.sh/polar_cl_…` URL here. These are
 * public URLs, safe to commit, and need **no** access token: the embed loads
 * them straight into an iframe.
 *
 * A product id is not a checkout link and cannot be turned into one from the
 * browser, so these cannot be derived from the product ids above. Leave one
 * empty to fall back to creating a checkout session on demand for that plan,
 * which needs `POLAR_ACCESS_TOKEN` instead.
 */
export const POLAR_PLUS_CHECKOUT_LINK =
  "https://buy.polar.sh/polar_cl_cIV2Vl0K60hJzHJqoOCrvd2xYuQtECY6PPlPy4gdoxp"

export const POLAR_PRO_CHECKOUT_LINK =
  "https://buy.polar.sh/polar_cl_3LyXhxgqyNTiHERg0sdzEzKM7Z7jRxsFFH24d3asCns"

/**
 * Per-plan Polar wiring. Adding a paid plan means adding a row here plus a
 * matching entry in `PRICING_PLANS` (`lib/pricing-plans.ts`).
 */
const PAID_PLANS: Record<
  PolarPaidPlanId,
  {
    productId: string
    productIdEnv: string
    checkoutLink: string
    checkoutLinkEnv: string
  }
> = {
  plus: {
    productId: POLAR_PLUS_PRODUCT_ID,
    productIdEnv: "POLAR_PLUS_PRODUCT_ID",
    checkoutLink: POLAR_PLUS_CHECKOUT_LINK,
    checkoutLinkEnv: "POLAR_PLUS_CHECKOUT_LINK",
  },
  pro: {
    productId: POLAR_PRO_PRODUCT_ID,
    productIdEnv: "POLAR_PRO_PRODUCT_ID",
    checkoutLink: POLAR_PRO_CHECKOUT_LINK,
    checkoutLinkEnv: "POLAR_PRO_CHECKOUT_LINK",
  },
}

/**
 * Polar benefit id for the Tiles Pro **License Key**.
 *
 * Entitlement is carried by the license key itself, so there is no entitlement
 * store on this site. The Tiles app validates a key against Polar's customer
 * portal endpoint, which is unauthenticated and needs no access token:
 *
 * ```ts
 * await polar.customerPortal.licenseKeys.validate({
 *   key,
 *   organizationId: POLAR_ORGANIZATION_ID,
 *   benefitId: POLAR_PRO_LICENSE_KEY_BENEFIT_ID, // scopes it to Tiles Pro
 * })
 * ```
 *
 * Device limits come from the benefit's activation limit, via `activate()` /
 * `deactivate()`. Not a secret; safe to commit.
 */
export const POLAR_PRO_LICENSE_KEY_BENEFIT_ID =
  "c9ebdd84-854f-44ef-a27f-7b729dd1840e"

/**
 * Tiles Plus's own License Key benefit id, once one is attached to the Plus
 * product in the Polar dashboard. Benefits are per product, so Plus cannot
 * reuse the Pro id above; the organization id below is shared.
 */
export const POLAR_PLUS_LICENSE_KEY_BENEFIT_ID = ""

/**
 * Polar organization id, required alongside the key when validating.
 * Not a secret. Only needed by whichever client validates license keys, so
 * this site records it for reference rather than reading it at runtime.
 */
export const POLAR_ORGANIZATION_ID = "028ca25d-5316-46a1-8771-28c6403d8348"

export type PolarServer = "sandbox" | "production"

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim()
  return value ? value : fallback
}

/** Polar environment. Defaults to production now that checkout is live. */
export function getPolarServer(): PolarServer {
  return process.env.POLAR_SERVER?.trim() === "sandbox"
    ? "sandbox"
    : "production"
}

/** Organization access token (`polar_oat_...`). */
export function getPolarAccessToken(): string {
  return readEnv("POLAR_ACCESS_TOKEN", POLAR_PLACEHOLDER_ACCESS_TOKEN)
}

/** Webhook signing secret (`polar_whs_...`) used to validate incoming events. */
export function getPolarWebhookSecret(): string {
  return readEnv("POLAR_WEBHOOK_SECRET", POLAR_PLACEHOLDER_WEBHOOK_SECRET)
}

/** Polar product id backing a paid plan on `/pricing`. */
export function getPolarProductId(plan: PolarPaidPlanId): string {
  const config = PAID_PLANS[plan]
  return readEnv(config.productIdEnv, config.productId)
}

/** True for the paid plan ids Polar knows about, for validating route input. */
export function isPolarPaidPlanId(value: string): value is PolarPaidPlanId {
  return Object.hasOwn(PAID_PLANS, value)
}

/**
 * Which plan a Polar product id belongs to, or null for anything else. Used to
 * name the plan on `/pricing/success` from a completed checkout.
 */
export function getPolarPlanForProductId(
  productId: string,
): PolarPaidPlanId | null {
  for (const plan of Object.keys(PAID_PLANS) as PolarPaidPlanId[]) {
    if (getPolarProductId(plan) === productId) return plan
  }
  return null
}

/**
 * Public checkout link for a paid plan, or null when none is configured.
 * The matching env var overrides the committed value.
 */
export function getPolarCheckoutLink(plan: PolarPaidPlanId): string | null {
  const config = PAID_PLANS[plan]
  const value =
    process.env[config.checkoutLinkEnv]?.trim() || config.checkoutLink.trim()
  return value ? value : null
}

/**
 * How the Subscribe action on `/pricing` should behave.
 *
 * - `link`: a public checkout link exists, so the embed opens it directly with
 *   no server round trip and no secrets.
 * - `session`: no checkout link, but an access token is set, so the browser
 *   asks `/api/polar/checkout/session` to mint a fresh checkout session on
 *   click and the embed opens that. Sessions are short lived, which is why
 *   they are created on demand rather than at render time.
 * - `unavailable`: neither is configured, so the action renders disabled.
 */
export type PolarCheckoutMode =
  | { kind: "link"; url: string }
  | { kind: "session" }
  | { kind: "unavailable" }

export function getPolarCheckoutMode(
  plan: PolarPaidPlanId,
): PolarCheckoutMode {
  if (!POLAR_BILLING_ENABLED) return { kind: "unavailable" }

  const link = getPolarCheckoutLink(plan)
  if (link) return { kind: "link", url: link }

  if (!isPolarPlaceholder(getPolarAccessToken())) return { kind: "session" }

  return { kind: "unavailable" }
}

/** Checkout mode for every paid plan, keyed by plan id. */
export function getPolarCheckoutModes(): Record<
  PolarPaidPlanId,
  PolarCheckoutMode
> {
  return { plus: getPolarCheckoutMode("plus"), pro: getPolarCheckoutMode("pro") }
}

/** True when a value is still one of the spoofed placeholders above. */
export function isPolarPlaceholder(value: string): boolean {
  return value.includes("SPOOFED_PLACEHOLDER")
}

/**
 * Checkout needs the access token. Kept separate from the webhook check so a
 * missing signing secret cannot take down checkout, and vice versa.
 */
export function isPolarCheckoutConfigured(): boolean {
  return POLAR_BILLING_ENABLED && !isPolarPlaceholder(getPolarAccessToken())
}

/** Webhook delivery needs the signing secret. */
export function isPolarWebhookConfigured(): boolean {
  return POLAR_BILLING_ENABLED && !isPolarPlaceholder(getPolarWebhookSecret())
}

/**
 * Shared 503 for Polar routes whose credentials are missing, so callers get a
 * clear reason instead of an opaque SDK error from a spoofed secret.
 */
export function polarNotConfiguredResponse(): Response {
  return Response.json(
    {
      error: "billing_not_configured",
      message: "Tiles billing is not configured on this server.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  )
}
