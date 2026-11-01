import type { TurnstileCheck } from "./email-guard"

export const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

/** The `action` the newsletter widget is rendered with. */
export const TURNSTILE_NEWSLETTER_ACTION = "subscribe"

interface SiteverifyResult {
  success?: boolean
  hostname?: string
  action?: string
  "error-codes"?: string[]
}

interface TurnstileOptions {
  secret: string
  action: string
  /** Off in dev, where Cloudflare's test keys report a placeholder hostname. */
  checkHostname: boolean
  endpoint?: string
  timeoutMs?: number
}

export function createTurnstileVerifier({
  secret,
  action,
  checkHostname,
  endpoint = TURNSTILE_VERIFY_URL,
  timeoutMs = 5_000,
}: TurnstileOptions): TurnstileCheck {
  return async (token, remoteIp, hostname) => {
    const form = new FormData()
    form.set("secret", secret)
    form.set("response", token)
    if (remoteIp && remoteIp !== "unknown") form.set("remoteip", remoteIp)

    let result: SiteverifyResult
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(timeoutMs),
      })
      result = (await response.json()) as SiteverifyResult
    } catch (error) {
      console.error("[Turnstile] siteverify failed:", error)
      return false
    }

    if (result.success !== true) return false
    if (checkHostname && result.hostname !== hostname) return false
    // Widgets rendered without an action report an empty string.
    if (result.action && result.action !== action) return false
    return true
  }
}
