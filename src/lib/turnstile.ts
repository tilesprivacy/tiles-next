// Cloudflare Turnstile for the newsletter form. Imported dynamically, so
// visitors who never see the form never download this or Cloudflare's script.
import { loadScript } from "#lib/load-script"

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
const TOKEN_TIMEOUT_MS = 15_000
// Once Cloudflare shows the checkbox, give the visitor time to use it.
const INTERACTIVE_TIMEOUT_MS = 120_000

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  execute: (widgetId: string) => void
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

export interface TurnstileWidget {
  /** Runs the check and returns its token, or "" if none arrives in time (the server then rejects). */
  token: () => Promise<string>
  /** Tokens are single use; call after each submission. */
  reset: () => void
  destroy: () => void
}

export interface TurnstileOptions {
  theme: "light" | "dark"
  /** Told when the checkbox appears (true) and goes away again (false). */
  onVisibleChange: (visible: boolean) => void
}

export async function createTurnstileWidget(
  container: HTMLElement,
  siteKey: string,
  { theme, onVisibleChange }: TurnstileOptions,
): Promise<TurnstileWidget> {
  await loadScript(TURNSTILE_SRC)
  const api = (window as Window & { turnstile?: TurnstileApi }).turnstile
  if (!api) throw new Error("Turnstile did not initialise")

  let current = ""
  // The check in progress, if any: one at a time, started by token().
  let pending: { promise: Promise<string>; resolve: (token: string) => void; timer: ReturnType<typeof setTimeout> } | null = null

  const finish = (token: string) => {
    if (!pending) return
    clearTimeout(pending.timer)
    pending.resolve(token)
    pending = null
  }
  const waitUpTo = (ms: number) => {
    if (!pending) return
    clearTimeout(pending.timer)
    pending.timer = setTimeout(() => finish(""), ms)
  }

  const widgetId = api.render(container, {
    sitekey: siteKey,
    // Nothing runs until token() calls execute, i.e. when someone clicks
    // Subscribe; even then it stays invisible unless Cloudflare needs a click.
    execution: "execute",
    appearance: "interaction-only",
    // Same width as the email field and button above it.
    size: "flexible",
    theme,
    // Must match what /api/subscribe expects when it verifies the token.
    action: "subscribe",
    callback: (token: string) => {
      current = token
      finish(token)
    },
    "before-interactive-callback": () => {
      onVisibleChange(true)
      waitUpTo(INTERACTIVE_TIMEOUT_MS)
    },
    "expired-callback": () => (current = ""),
    "error-callback": () => {
      current = ""
    },
  })

  return {
    token() {
      if (current) return Promise.resolve(current)
      if (!pending) {
        let resolve!: (token: string) => void
        const promise = new Promise<string>((done) => (resolve = done))
        pending = { promise, resolve, timer: setTimeout(() => finish(""), TOKEN_TIMEOUT_MS) }
        api.execute(widgetId)
      }
      return pending.promise
    },
    reset() {
      current = ""
      finish("")
      api.reset(widgetId)
      onVisibleChange(false)
    },
    destroy() {
      finish("")
      api.remove(widgetId)
    },
  }
}
