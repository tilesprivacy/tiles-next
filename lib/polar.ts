/**
 * Polar.sh billing configuration.
 *
 * The integration is real: `POLAR_BILLING_ENABLED` is on and the Tiles Pro
 * product id below is the live one. What is deliberately NOT committed is the
 * pair of secrets, which stay spoofed until they are set in the environment.
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

/**
 * Live Polar product backing the Tiles Pro subscription.
 *
 * Product ids are not secrets, so this is committed as the default and only
 * needs `POLAR_PRO_PRODUCT_ID` set to point a preview build somewhere else.
 */
export const POLAR_PRO_PRODUCT_ID = "98d19697-7811-437f-933e-c5a55caa9362"

/**
 * Public Polar Checkout Link for Tiles Pro, opened directly by the embedded
 * checkout on `/pricing`.
 *
 * Create it in the Polar dashboard (**Checkout Links > New Link**, select the
 * Tiles Pro product) and paste the resulting `https://buy.polar.sh/polar_cl_…`
 * URL here. It is a public URL, safe to commit, and needs **no** access token:
 * the embed loads it straight into an iframe.
 *
 * A product id is not a checkout link and cannot be turned into one from the
 * browser, so this cannot be derived from `POLAR_PRO_PRODUCT_ID`. Clear it to
 * fall back to creating a checkout session on demand, which needs
 * `POLAR_ACCESS_TOKEN` instead.
 */
export const POLAR_PRO_CHECKOUT_LINK =
  "https://buy.polar.sh/polar_cl_3LyXhxgqyNTiHERg0sdzEzKM7Z7jRxsFFH24d3asCns"

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

/** Polar product id backing the Tiles Pro plan on `/pricing`. */
export function getPolarProProductId(): string {
  return readEnv("POLAR_PRO_PRODUCT_ID", POLAR_PRO_PRODUCT_ID)
}

/**
 * Public checkout link for Tiles Pro, or null when none is configured.
 * `POLAR_PRO_CHECKOUT_LINK` in the environment overrides the committed value.
 */
export function getPolarProCheckoutLink(): string | null {
  const value =
    process.env.POLAR_PRO_CHECKOUT_LINK?.trim() || POLAR_PRO_CHECKOUT_LINK.trim()
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

export function getPolarCheckoutMode(): PolarCheckoutMode {
  if (!POLAR_BILLING_ENABLED) return { kind: "unavailable" }

  const link = getPolarProCheckoutLink()
  if (link) return { kind: "link", url: link }

  if (!isPolarPlaceholder(getPolarAccessToken())) return { kind: "session" }

  return { kind: "unavailable" }
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
