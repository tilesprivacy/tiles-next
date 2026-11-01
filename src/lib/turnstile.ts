// Cloudflare Turnstile for the newsletter form. Imported dynamically, so
// visitors who never see the form never download this or Cloudflare's script.
import { loadScript } from "#lib/load-script"

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const TOKEN_TIMEOUT_MS = 15_000

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

export interface TurnstileWidget {
  /** A fresh token, or "" if none arrives in time (the server then rejects). */
  token: () => Promise<string>
  /** Tokens are single use; call after each submission. */
  reset: () => void
  destroy: () => void
}

export async function createTurnstileWidget(container: HTMLElement, siteKey: string): Promise<TurnstileWidget> {
  await loadScript(TURNSTILE_SRC)
  const api = (window as Window & { turnstile?: TurnstileApi }).turnstile
  if (!api) throw new Error("Turnstile did not initialise")

  let current = ""
  let waiters: Array<(token: string) => void> = []

  const settle = (token: string) => {
    current = token
    if (!token) return
    for (const resolve of waiters) resolve(token)
    waiters = []
  }

  const widgetId = api.render(container, {
    sitekey: siteKey,
    // Invisible unless Cloudflare needs the visitor to click something.
    appearance: "interaction-only",
    // Must match what /api/subscribe expects when it verifies the token.
    action: "subscribe",
    callback: settle,
    "expired-callback": () => settle(""),
    "error-callback": () => settle(""),
  })

  return {
    token() {
      if (current) return Promise.resolve(current)
      return new Promise((resolve) => {
        const done = (token: string) => {
          clearTimeout(timer)
          resolve(token)
        }
        const timer = setTimeout(() => {
          waiters = waiters.filter((waiter) => waiter !== done)
          resolve("")
        }, TOKEN_TIMEOUT_MS)
        waiters.push(done)
      })
    },
    reset() {
      current = ""
      api.reset(widgetId)
    },
    destroy() {
      api.remove(widgetId)
    },
  }
}
