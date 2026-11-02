// Abuse checks for public endpoints that send email. Without them any script,
// or any third-party page running in a visitor's browser, can make the site
// send mail from its verified domain to arbitrary addresses.
//
// A form that emails the address typed into it can never refuse a human who
// types someone else's address, so the goal is a hard ceiling instead: bots
// are rejected by Turnstile, and any one address gets at most one email per
// cooldown period no matter how many requests or IPs are involved.

// Room for a Turnstile token (up to 2,048 characters) plus the form fields.
const MAX_REQUEST_BYTES = 4_096
const MAX_EMAIL_LENGTH = 254
const MIN_FILL_MS = 1_000
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000

export const MAX_SENDS_PER_IP = 5
export const IP_WINDOW_SECONDS = 60 * 60
// Long enough to stop repeated mail to one inbox, short enough that someone
// who lost the confirmation email can ask again the next day.
export const RECIPIENT_COOLDOWN_SECONDS = 24 * 60 * 60
const MAX_TRACKED_KEYS = 10_000

type Outcome = "allowed" | "denied" | "unavailable"

/** Shared store for the limits. Methods throw when the store is unreachable. */
export interface GuardStore {
  /** Counts one request for `key`; false once the hourly limit is reached. */
  hitIpLimit(key: string): Promise<boolean>
  /** Atomically claims `key` for `ttlSeconds`; false if it is already claimed. */
  claim(key: string, ttlSeconds: number): Promise<boolean>
  release(key: string): Promise<void>
}

export type TurnstileCheck = (token: string, remoteIp: string, hostname: string) => Promise<boolean>

export interface EmailGuardOptions {
  /** Shared store, or null when Redis is not configured. */
  store: GuardStore | null
  /** Turnstile verification, or null when no secret is configured. */
  verifyTurnstile: TurnstileCheck | null
  /** Production fails closed when the store or Turnstile is missing. */
  production: boolean
  /**
   * The site's canonical origin, the only one allowed to post. Null in dev,
   * where the request's own origin is accepted.
   */
  canonicalOrigin: string | null
}

export type GuardedEmailRequest =
  | { ok: true; email: string; release: () => Promise<void> }
  | { ok: false; response: Response }

// Keys are hashed so Redis never stores raw IPs or email addresses.
async function hashKey(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

const ipKey = async (ip: string) => `ip:${await hashKey(ip)}`
const recipientKey = async (email: string) =>
  `email-guard:recipient:${await hashKey(email.toLowerCase())}`

function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function reject(error: string, status: number): Response {
  return Response.json({ error }, { status })
}

const unavailable = () =>
  reject("Signups are temporarily unavailable. Please try again later.", 503)

// Per-instance stand-in for local dev, where Redis is usually not configured.
// Production never uses it: one isolate cannot enforce a per-address ceiling.
export function createMemoryStore(now: () => number = Date.now): GuardStore {
  const ipLog = new Map<string, number[]>()
  const claims = new Map<string, number>()

  function prune<V>(map: Map<string, V>, isExpired: (value: V) => boolean) {
    if (map.size <= MAX_TRACKED_KEYS) return
    for (const [key, value] of map) if (isExpired(value)) map.delete(key)
  }

  return {
    async hitIpLimit(key) {
      const windowStart = now() - IP_WINDOW_SECONDS * 1_000
      prune(ipLog, (times) => times[times.length - 1] <= windowStart)
      const recent = (ipLog.get(key) ?? []).filter((t) => t > windowStart)
      const allowed = recent.length < MAX_SENDS_PER_IP
      if (allowed) recent.push(now())
      ipLog.set(key, recent)
      return allowed
    },
    async claim(key, ttlSeconds) {
      prune(claims, (expiresAt) => expiresAt <= now())
      const expiresAt = claims.get(key)
      if (expiresAt && expiresAt > now()) return false
      claims.set(key, now() + ttlSeconds * 1_000)
      return true
    },
    async release(key) {
      claims.delete(key)
    },
  }
}

export function createEmailGuard({
  store,
  verifyTurnstile,
  production,
  canonicalOrigin,
}: EmailGuardOptions) {
  // Dev without Redis still exercises the limits, per process.
  const activeStore = store ?? createMemoryStore()

  async function attempt(run: () => Promise<boolean>, label: string): Promise<Outcome> {
    try {
      return (await run()) ? "allowed" : "denied"
    } catch (error) {
      console.error(`[EmailGuard] ${label} failed:`, error)
      return "unavailable"
    }
  }

  /**
   * Validates a request to send an email. `silentSuccess` is the response for
   * requests that are quietly dropped (honeypot hits, repeat addresses), so
   * callers can match their normal success shape and nothing is revealed.
   */
  return async function guardEmailRequest(
    request: Request,
    clientIp: string,
    silentSuccess: () => Response,
  ): Promise<GuardedEmailRequest> {
    // Browsers always send Origin on fetch POSTs and page scripts cannot change
    // it, so this blocks other sites from triggering sends through a visitor's
    // browser. Scripts that set the header themselves are Turnstile's job.
    const expectedOrigin = canonicalOrigin ?? new URL(request.url).origin
    const origin = request.headers.get("origin")
    if (!origin || origin !== expectedOrigin) {
      return { ok: false, response: reject("Invalid request origin.", 403) }
    }

    // application/json is not a CORS "simple" content type, so a cross-site page
    // cannot send it without a preflight, which this route never approves.
    const contentType = request.headers.get("content-type") ?? ""
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return { ok: false, response: reject("Expected a JSON request body.", 415) }
    }

    const contentLength = Number(request.headers.get("content-length") || "0")
    if (contentLength > MAX_REQUEST_BYTES) {
      return { ok: false, response: reject("Request is too large.", 413) }
    }

    let raw: string
    try {
      raw = await request.text()
    } catch {
      return { ok: false, response: reject("Invalid request body.", 400) }
    }
    if (raw.length > MAX_REQUEST_BYTES) {
      return { ok: false, response: reject("Request is too large.", 413) }
    }

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return { ok: false, response: reject("Invalid request body. Expected JSON.", 400) }
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { ok: false, response: reject("Invalid request body. Expected JSON.", 400) }
    }
    const fields = body as Record<string, unknown>

    // Honeypot: real users never see this field. Answer like a success so
    // automated submitters do not learn which check caught them.
    if (typeof fields.website === "string" && fields.website.trim()) {
      return { ok: false, response: silentSuccess() }
    }

    const now = Date.now()
    const startedAt = typeof fields.startedAt === "number" ? fields.startedAt : 0
    const elapsed = now - startedAt
    if (!startedAt || elapsed < MIN_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
      return { ok: false, response: reject("Please reload the page and try again.", 400) }
    }

    const email = typeof fields.email === "string" ? fields.email.trim() : ""
    if (!isValidEmail(email)) {
      return { ok: false, response: reject("Enter a valid email address.", 400) }
    }

    if (production && (!store || !verifyTurnstile)) {
      console.error("[EmailGuard] Redis or Turnstile is not configured; refusing to send.")
      return { ok: false, response: unavailable() }
    }

    // Runs before the rate limits so bots never use up a real person's quota.
    if (verifyTurnstile) {
      const token = typeof fields.turnstileToken === "string" ? fields.turnstileToken : ""
      const hostname = new URL(expectedOrigin).hostname
      if (!token || !(await verifyTurnstile(token, clientIp, hostname))) {
        return {
          ok: false,
          response: reject("Verification failed. Please reload the page and try again.", 403),
        }
      }
    }

    const ipOutcome = await attempt(
      async () => activeStore.hitIpLimit(await ipKey(clientIp)),
      "IP limit",
    )
    if (ipOutcome === "unavailable") return { ok: false, response: unavailable() }
    if (ipOutcome === "denied") {
      return { ok: false, response: reject("Too many requests. Please try again later.", 429) }
    }

    // Only the first request for an address in the cooldown may send; the rest
    // are answered exactly like a success, without sending.
    const key = await recipientKey(email)
    const recipientOutcome = await attempt(
      () => activeStore.claim(key, RECIPIENT_COOLDOWN_SECONDS),
      "Recipient claim",
    )
    if (recipientOutcome === "unavailable") return { ok: false, response: unavailable() }
    if (recipientOutcome === "denied") return { ok: false, response: silentSuccess() }

    // Frees the claim when storing or sending fails, so the person can retry.
    const release = async () => {
      try {
        await activeStore.release(key)
      } catch (error) {
        console.error("[EmailGuard] Recipient release failed:", error)
      }
    }

    return { ok: true, email, release }
  }
}
