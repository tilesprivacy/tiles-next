import { dev } from "$app/env"
import {
  RESEND_API_KEY,
  RESEND_SEGMENT_ID,
  RESEND_FROM_EMAIL,
  TURNSTILE_SECRET_KEY,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "$app/env/private"
import { SITE_ORIGIN } from "#lib/absolute-url"
import { createEmailGuard } from "#lib/server/email-guard"
import { handleSubscribe } from "#lib/server/subscribe"
import { createTurnstileVerifier, TURNSTILE_NEWSLETTER_ACTION } from "#lib/server/turnstile"
import { createUpstashStore } from "#lib/server/upstash-store"
import type { RequestHandler } from "./$types"

export const prerender = false

let guard: ReturnType<typeof createEmailGuard> | undefined

function getGuard() {
  guard ??= createEmailGuard({
    store:
      UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN
        ? createUpstashStore(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
        : null,
    verifyTurnstile: TURNSTILE_SECRET_KEY
      ? createTurnstileVerifier({
          secret: TURNSTILE_SECRET_KEY,
          action: TURNSTILE_NEWSLETTER_ACTION,
          checkHostname: !dev,
        })
      : null,
    production: !dev,
    canonicalOrigin: dev ? null : SITE_ORIGIN,
  })
  return guard
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  let clientIp = request.headers.get("cf-connecting-ip") ?? ""
  if (!clientIp) {
    try {
      clientIp = getClientAddress()
    } catch {
      clientIp = "unknown"
    }
  }

  const response = await handleSubscribe(request, clientIp, {
    guard: getGuard(),
    resendApiKey: RESEND_API_KEY,
    resendFromEmail: RESEND_FROM_EMAIL,
    resendSegmentId: RESEND_SEGMENT_ID,
    production: !dev,
    debug: dev,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
