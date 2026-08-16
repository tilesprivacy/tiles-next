import { Webhooks } from "@polar-sh/nextjs"
import type { NextRequest } from "next/server"
import {
  getPolarWebhookSecret,
  isPolarBillingLive,
  polarBillingNotLiveResponse,
} from "@/lib/polar"

/**
 * Polar webhook receiver.
 *
 * Inert until the 0.5.0 Private Beta. While billing is not live this returns
 * 503 without validating or processing anything, because the signing secret is
 * still the spoofed placeholder from `lib/polar.ts` and every signature check
 * would fail anyway.
 *
 * When billing goes live, register this URL in the Polar dashboard
 * (Settings > Webhooks) as `https://www.tiles.run/api/polar/webhooks` and fill
 * in the handlers below to grant and revoke Pro entitlements. See the
 * "Polar.sh Integration" section of AGENTS.md.
 */
export async function POST(request: NextRequest) {
  if (!isPolarBillingLive()) {
    return polarBillingNotLiveResponse()
  }

  // Built lazily so the secret is only read once it is real.
  const handler = Webhooks({
    webhookSecret: getPolarWebhookSecret(),

    onSubscriptionActive: async (payload) => {
      // TODO(0.5.0): grant Pro entitlements for payload.data.customer.
      console.info("[polar] subscription active", payload.data.id)
    },

    onSubscriptionCanceled: async (payload) => {
      // TODO(0.5.0): mark the subscription as ending at period end.
      console.info("[polar] subscription canceled", payload.data.id)
    },

    onSubscriptionRevoked: async (payload) => {
      // TODO(0.5.0): revoke Pro entitlements for payload.data.customer.
      console.info("[polar] subscription revoked", payload.data.id)
    },

    onOrderPaid: async (payload) => {
      // TODO(0.5.0): record the payment against the customer's account.
      console.info("[polar] order paid", payload.data.id)
    },
  })

  return handler(request)
}
