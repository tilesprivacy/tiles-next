import { dev } from "$app/env"
import {
  NEWSLETTER_TOKEN_KEY,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  TURNSTILE_SECRET_KEY,
} from "$app/env/private"
import { SITE_ORIGIN } from "#lib/absolute-url"
import { createD1Store } from "#lib/server/d1-store"
import { createEmailGuard } from "#lib/server/email-guard"
import { devTokenKey } from "#lib/server/newsletter-dev"
import { handleSubscribe } from "#lib/server/subscribe"
import { createTurnstileVerifier, TURNSTILE_NEWSLETTER_ACTION } from "#lib/server/turnstile"
import type { RequestHandler } from "./$types"

export const prerender = false

type Guard = ReturnType<typeof createEmailGuard>

// One guard per D1 binding (in practice, one per isolate). Without the binding
// (plain `vite dev`) the guard keeps its limits in memory; production refuses.
const guards = new WeakMap<D1Database, Guard>()
let memoryGuard: Guard | undefined

function makeGuard(db: D1Database | undefined): Guard {
  return createEmailGuard({
    store: db ? createD1Store(db) : null,
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
}

function getGuard(db: D1Database | undefined): Guard {
  if (!db) return (memoryGuard ??= makeGuard(undefined))
  let guard = guards.get(db)
  if (!guard) guards.set(db, (guard = makeGuard(db)))
  return guard
}

export const POST: RequestHandler = async ({ request, url, getClientAddress, platform }) => {
  let clientIp = request.headers.get("cf-connecting-ip") ?? ""
  if (!clientIp) {
    try {
      clientIp = getClientAddress()
    } catch {
      clientIp = "unknown"
    }
  }

  const response = await handleSubscribe(request, clientIp, {
    guard: getGuard(platform?.env.DB),
    resendApiKey: RESEND_API_KEY,
    resendFromEmail: RESEND_FROM_EMAIL,
    tokenKey: NEWSLETTER_TOKEN_KEY ?? (dev ? devTokenKey() : undefined),
    siteOrigin: dev ? url.origin : SITE_ORIGIN,
    debug: dev,
  })
  response.headers.set("Cache-Control", "no-store")
  return response
}
