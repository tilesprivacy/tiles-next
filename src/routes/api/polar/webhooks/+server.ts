import { webhooks } from "@polar-sh/sdk/2026-10"
import { getPolarWebhookSecret, polarJsonError, polarNotConfiguredResponse } from "#lib/server/polar"
import type { RequestHandler } from "./$types"

export const prerender = false

const MAX_BODY_BYTES = 1_000_000

/**
 * Polar webhook receiver, registered as https://tiles.run/api/polar/webhooks.
 * Entitlement rides on license keys, so the handlers are logging stubs until
 * something needs server-side authorization (see AGENTS.md).
 */
export const POST: RequestHandler = async ({ request }) => {
  const secret = getPolarWebhookSecret()
  if (!secret) return polarNotConfiguredResponse()

  const tooLarge = () => polarJsonError(413, "payload_too_large", "Webhook payload too large.")
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLarge()
  const body = new Uint8Array(await request.arrayBuffer())
  if (body.byteLength > MAX_BODY_BYTES) return tooLarge()

  let event: webhooks.WebhookPayload
  try {
    event = await webhooks.validateEvent(
      body,
      {
        "webhook-id": request.headers.get("webhook-id") ?? "",
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
      },
      secret,
    )
  } catch (error) {
    if (error instanceof webhooks.PolarWebhookVerificationError) {
      return polarJsonError(403, "invalid_signature", "Invalid webhook signature.")
    }
    // A verified event of a type this SDK version doesn't know: acknowledge it
    // so Polar doesn't keep retrying.
    if (error instanceof webhooks.PolarWebhookUnknownTypeError) {
      return new Response(null, { status: 202 })
    }
    return polarJsonError(400, "invalid_payload", "Invalid webhook payload.")
  }

  // Handlers must stay idempotent: Polar retries on any non-2xx.
  switch (event.type) {
    case "subscription.active":
      // TODO: grant Tiles Pro entitlements for event.data.customer.
      console.info("[polar] subscription active", event.data.id)
      break
    case "subscription.canceled":
      // TODO: mark the subscription as ending at period end.
      console.info("[polar] subscription canceled", event.data.id)
      break
    case "subscription.revoked":
      // TODO: revoke Tiles Pro entitlements for event.data.customer.
      console.info("[polar] subscription revoked", event.data.id)
      break
    case "order.paid":
      // TODO: record the payment against the customer's account.
      console.info("[polar] order paid", event.data.id)
      break
  }

  return new Response(null, { status: 202 })
}
