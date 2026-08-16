/**
 * Polar.sh billing configuration.
 *
 * Billing is scaffolded but deliberately inert. `/pricing` is a placeholder
 * until the 0.5.0 Private Beta, so every credential below falls back to an
 * obviously spoofed value and `isPolarBillingLive()` stays false. The API
 * routes under `app/api/polar/` check that helper and short-circuit before
 * they ever call the Polar SDK.
 *
 * Server only: these read `process.env` and must not be imported into client
 * components. Client code should branch on `POLAR_BILLING_ENABLED` from
 * `lib/feature-flags.ts` instead.
 *
 * See the "Polar.sh Integration" section of AGENTS.md for the go-live steps.
 */

import { POLAR_BILLING_ENABLED } from "@/lib/feature-flags"

/**
 * Spoofed placeholders. These are intentionally not real credentials, and are
 * shaped so a missing env var can never be mistaken for a working secret.
 */
export const POLAR_PLACEHOLDER_ACCESS_TOKEN =
  "polar_oat_SPOOFED_PLACEHOLDER_NOT_A_REAL_TOKEN"
export const POLAR_PLACEHOLDER_WEBHOOK_SECRET =
  "polar_whs_SPOOFED_PLACEHOLDER_NOT_A_REAL_SECRET"
export const POLAR_PLACEHOLDER_PRODUCT_ID =
  "00000000-0000-0000-0000-000000000000"

export type PolarServer = "sandbox" | "production"

function readEnv(name: string, placeholder: string): string {
  const value = process.env[name]?.trim()
  return value ? value : placeholder
}

/** Polar environment. Defaults to sandbox so a stray token cannot charge anyone. */
export function getPolarServer(): PolarServer {
  return process.env.POLAR_SERVER?.trim() === "production"
    ? "production"
    : "sandbox"
}

/** Organization access token (`polar_oat_...`). */
export function getPolarAccessToken(): string {
  return readEnv("POLAR_ACCESS_TOKEN", POLAR_PLACEHOLDER_ACCESS_TOKEN)
}

/** Webhook signing secret (`polar_whs_...`) used to validate incoming events. */
export function getPolarWebhookSecret(): string {
  return readEnv("POLAR_WEBHOOK_SECRET", POLAR_PLACEHOLDER_WEBHOOK_SECRET)
}

/** Polar product id backing the $10/month Pro plan on `/pricing`. */
export function getPolarProProductId(): string {
  return readEnv("POLAR_PRO_PRODUCT_ID", POLAR_PLACEHOLDER_PRODUCT_ID)
}

/** True when a value is still one of the spoofed placeholders above. */
export function isPolarPlaceholder(value: string): boolean {
  return (
    value === POLAR_PLACEHOLDER_ACCESS_TOKEN ||
    value === POLAR_PLACEHOLDER_WEBHOOK_SECRET ||
    value === POLAR_PLACEHOLDER_PRODUCT_ID ||
    value.includes("SPOOFED_PLACEHOLDER")
  )
}

/**
 * Billing only runs when the flag is on *and* every placeholder has been
 * replaced with a real credential. Both halves are required so flipping the
 * flag on a machine without secrets fails closed instead of erroring at Polar.
 */
export function isPolarBillingLive(): boolean {
  if (!POLAR_BILLING_ENABLED) return false

  return [
    getPolarAccessToken(),
    getPolarWebhookSecret(),
    getPolarProProductId(),
  ].every((value) => !isPolarPlaceholder(value))
}

/**
 * Shared 503 for Polar routes while billing is inert, so callers get a clear
 * reason instead of an opaque SDK error from a spoofed token.
 */
export function polarBillingNotLiveResponse(): Response {
  return Response.json(
    {
      error: "billing_not_live",
      message:
        "Tiles billing is not open yet. Checkout goes live with the 0.5.0 Private Beta.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  )
}
