import { createHash } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { checkBotId } from "botid/server"
import { NextRequest, NextResponse } from "next/server"

// Abuse checks for public endpoints that send email. Without them any script,
// or any third-party page running in a visitor's browser, can make the site
// send mail from its verified domain to arbitrary addresses.
//
// A form that emails the address typed into it can never refuse a human who
// types someone else's address, so the goal is a hard ceiling instead: bots
// are rejected by BotID, and any one address gets at most one email per
// cooldown period no matter how many requests or IPs are involved.

const MAX_REQUEST_BYTES = 2_048
const MAX_EMAIL_LENGTH = 254
const MIN_FILL_MS = 1_000
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000

const MAX_SENDS_PER_IP = 5
const RECIPIENT_COOLDOWN_SECONDS = 30 * 24 * 60 * 60
const REDIS_TIMEOUT_MS = 2_000
const MAX_TRACKED_KEYS = 10_000

// Production must not send without the shared store: per-instance memory
// cannot enforce the per-recipient ceiling across serverless instances.
const isProduction = process.env.NODE_ENV === "production"

// The Vercel Marketplace integration sets KV_REST_API_*; a database created
// directly on upstash.com uses UPSTASH_REDIS_REST_*.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken, retry: { retries: 1, backoff: () => 200 } })
    : null

const ipLimiter = redis
  ? new Ratelimit({
      redis,
      prefix: "email-guard:ip",
      limiter: Ratelimit.slidingWindow(MAX_SENDS_PER_IP, "1 h"),
      timeout: REDIS_TIMEOUT_MS,
    })
  : null

// Keys are hashed so Redis never stores raw IPs or email addresses.
function hashKey(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

function recipientKey(email: string): string {
  return `email-guard:recipient:${hashKey(email.toLowerCase())}`
}

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Redis timed out")), REDIS_TIMEOUT_MS),
    ),
  ])
}

// In-memory stand-ins for local dev, where Redis is usually not configured.
const ipLog = new Map<string, number[]>()
const recipientClaims = new Map<string, number>()

function pruneIfLarge<V>(map: Map<string, V>, isExpired: (value: V) => boolean) {
  if (map.size <= MAX_TRACKED_KEYS) return
  for (const [key, value] of map) {
    if (isExpired(value)) map.delete(key)
  }
}

function isIpLimitedInMemory(key: string, now: number): boolean {
  const windowStart = now - 60 * 60 * 1_000
  pruneIfLarge(ipLog, (times) => times[times.length - 1] <= windowStart)
  const recent = (ipLog.get(key) ?? []).filter((t) => t > windowStart)
  const limited = recent.length >= MAX_SENDS_PER_IP
  if (!limited) recent.push(now)
  ipLog.set(key, recent)
  return limited
}

type Outcome = "allowed" | "denied" | "unavailable"

async function checkIpLimit(ip: string, now: number): Promise<Outcome> {
  const key = hashKey(ip)
  if (ipLimiter) {
    try {
      const { success, reason } = await ipLimiter.limit(key)
      // On timeout the library reports success, which would switch limiting off.
      if (reason !== "timeout") return success ? "allowed" : "denied"
    } catch (error) {
      console.error("[EmailGuard] Upstash IP limit failed:", error)
    }
    if (isProduction) return "unavailable"
  }
  return isIpLimitedInMemory(key, now) ? "denied" : "allowed"
}

// Atomically reserves the address for the cooldown period. Only the first
// request in that period may send; the rest are answered without sending.
async function claimRecipient(email: string, now: number): Promise<Outcome> {
  const key = recipientKey(email)
  if (redis) {
    try {
      const result = await withTimeout(
        redis.set(key, now, { nx: true, ex: RECIPIENT_COOLDOWN_SECONDS }),
      )
      return result === "OK" ? "allowed" : "denied"
    } catch (error) {
      console.error("[EmailGuard] Upstash recipient claim failed:", error)
    }
    if (isProduction) return "unavailable"
  }
  pruneIfLarge(recipientClaims, (expiresAt) => expiresAt <= now)
  const expiresAt = recipientClaims.get(key)
  if (expiresAt && expiresAt > now) return "denied"
  recipientClaims.set(key, now + RECIPIENT_COOLDOWN_SECONDS * 1_000)
  return "allowed"
}

// Frees the claim when the send itself fails, so the person can retry.
async function releaseRecipient(email: string): Promise<void> {
  const key = recipientKey(email)
  recipientClaims.delete(key)
  if (!redis) return
  try {
    await withTimeout(redis.del(key))
  } catch (error) {
    console.error("[EmailGuard] Upstash recipient release failed:", error)
  }
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  )
}

function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function reject(error: string, status: number) {
  return NextResponse.json({ error }, { status })
}

const unavailable = () => reject("Signups are temporarily unavailable. Please try again later.", 503)

export type GuardedEmailRequest =
  | { ok: true; email: string; release: () => Promise<void> }
  | { ok: false; response: NextResponse }

/**
 * Validates a request to send an email. `silentSuccess` is the response for
 * requests that are quietly dropped (honeypot hits, repeat addresses), so
 * callers can match their normal success shape and nothing is revealed.
 */
export async function guardEmailRequest(
  request: NextRequest,
  silentSuccess: () => NextResponse,
): Promise<GuardedEmailRequest> {
  // Browsers always send Origin on fetch POSTs and page scripts cannot change
  // it, so this blocks other sites from triggering sends through a visitor's
  // browser. It does not stop scripts that set the header themselves; BotID
  // below is what handles those.
  const origin = request.headers.get("origin")
  if (!origin || origin !== new URL(request.url).origin) {
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

  if (isProduction && !redis) {
    console.error("[EmailGuard] Upstash Redis is not configured; refusing to send.")
    return { ok: false, response: unavailable() }
  }

  // Runs before the rate limits so bots never use up a real person's quota.
  // Bypassed in development; enforced on Vercel deployments.
  const verification = await checkBotId()
  if (verification.isBot) {
    return { ok: false, response: reject("Request blocked.", 403) }
  }

  const ipOutcome = await checkIpLimit(getClientIp(request), now)
  if (ipOutcome === "unavailable") return { ok: false, response: unavailable() }
  if (ipOutcome === "denied") {
    return { ok: false, response: reject("Too many requests. Please try again later.", 429) }
  }

  const recipientOutcome = await claimRecipient(email, now)
  if (recipientOutcome === "unavailable") return { ok: false, response: unavailable() }
  if (recipientOutcome === "denied") {
    return { ok: false, response: silentSuccess() }
  }

  return { ok: true, email, release: () => releaseRecipient(email) }
}
