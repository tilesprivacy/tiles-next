import { Webhooks } from "@polar-sh/nextjs"
import type { NextRequest } from "next/server"
import {
  getPolarWebhookSecret,
  isPolarWebhookConfigured,
  polarNotConfiguredResponse,
} from "@/lib/polar"

/**
 * Polar webhook receiver for Tiles Pro subscriptions.
 *
 * Returns 503 without validating anything while `POLAR_WEBHOOK_SECRET` is
 * missing, since every signature check would fail against the spoofed
 * placeholder in `lib/polar.ts` anyway.
 *
 * Register this URL in the Polar dashboard (Settings > Webhooks) as
 * `https://www.tiles.run/api/polar/webhooks`, then fill in the handlers below
 * to grant and revoke Tiles Pro entitlements. See the "Polar.sh Integration"
 * section of AGENTS.md.
 */
export async function POST(request: NextRequest) {
  if (!isPolarWebhookConfigured()) {
    return polarNotConfiguredResponse()
  }

  // Built lazily so the secret is only read once it is real.
  const handler = Webhooks({
    webhookSecret: getPolarWebhookSecret(),

    onSubscriptionActive: async (payload) => {
      // TODO: grant Tiles Pro entitlements for payload.data.customer.
      console.info("[polar] subscription active", payload.data.id)
    },

    onSubscriptionCanceled: async (payload) => {
      // TODO: mark the subscription as ending at period end.
      console.info("[polar] subscription canceled", payload.data.id)
    },

    onSubscriptionRevoked: async (payload) => {
      // TODO: revoke Tiles Pro entitlements for payload.data.customer.
      console.info("[polar] subscription revoked", payload.data.id)
    },

    onOrderPaid: async (payload) => {
      // TODO: record the payment against the customer's account.
      console.info("[polar] order paid", payload.data.id)
    },
  })

  return handler(request)
}
