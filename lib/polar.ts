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
