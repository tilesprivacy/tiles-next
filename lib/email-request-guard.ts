import { createHash } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"

// Shared abuse checks for public endpoints that send email. Without them any
// script, or any third-party page running in a visitor's browser, can make the
// site send mail from its verified domain to arbitrary addresses.

const MAX_REQUEST_BYTES = 2_048
const MAX_EMAIL_LENGTH = 254
const MIN_FILL_MS = 1_000
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000

const RATE_WINDOW_MS = 60 * 60 * 1_000
const MAX_SENDS_PER_IP = 5
const MAX_SENDS_PER_RECIPIENT = 2
const MAX_TRACKED_KEYS = 10_000

// Upstash Redis enforces the limits across every serverless instance. The
// Vercel Marketplace integration sets KV_REST_API_*; a direct Upstash database
// uses UPSTASH_REDIS_REST_*.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null

function createLimiter(kind: string, max: number): Ratelimit | null {
  if (!redis) return null
  return new Ratelimit({
    redis,
    prefix: `email-guard:${kind}`,
    limiter: Ratelimit.slidingWindow(max, "1 h"),
    timeout: 1_000,
  })
}

const ipLimiter = createLimiter("ip", MAX_SENDS_PER_IP)
const recipientLimiter = createLimiter("to", MAX_SENDS_PER_RECIPIENT)

// Keys are hashed so Redis never stores raw IPs or email addresses.
function hashKey(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

async function isRateLimited(
  limiter: Ratelimit | null,
  kind: string,
  value: string,
  max: number,
  now: number,
): Promise<boolean> {
  const key = hashKey(value)
  if (limiter) {
    try {
      const { success, reason } = await limiter.limit(key)
      // On timeout the library reports success; count locally instead of
      // letting a slow Redis switch limiting off.
      if (reason !== "timeout") return !success
    } catch (error) {
      console.error("[EmailGuard] Upstash rate limit failed, using in-memory fallback:", error)
    }
  }
  return isRateLimitedInMemory(`${kind}:${key}`, max, now)
}

// Fallback when Redis is not configured (local dev) or unreachable. Counters
// live in one instance's memory, so this only stops bursts on a warm instance.
const sendLog = new Map<string, number[]>()

function isRateLimitedInMemory(key: string, max: number, now: number): boolean {
  if (sendLog.size > MAX_TRACKED_KEYS) {
    for (const [k, times] of sendLog) {
      if (times[times.length - 1] <= now - RATE_WINDOW_MS) sendLog.delete(k)
    }
  }
  const recent = (sendLog.get(key) ?? []).filter((t) => t > now - RATE_WINDOW_MS)
  if (recent.length >= max) {
    sendLog.set(key, recent)
    return true
  }
  recent.push(now)
  sendLog.set(key, recent)
  return false
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

export type GuardedEmailRequest =
  | { ok: true; email: string }
  | { ok: false; response: NextResponse }

export async function guardEmailRequest(request: NextRequest): Promise<GuardedEmailRequest> {
  // Browsers always send Origin on fetch POSTs. Requiring it to match blocks
  // other sites from triggering sends through a visitor's browser.
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

  // Honeypot: real users never see this field. Answer with a normal-looking
  // success so automated submitters do not learn which check caught them.
  if (typeof fields.website === "string" && fields.website.trim()) {
    return { ok: false, response: NextResponse.json({ success: true }) }
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

  if (
    (await isRateLimited(ipLimiter, "ip", getClientIp(request), MAX_SENDS_PER_IP, now)) ||
    (await isRateLimited(recipientLimiter, "to", email.toLowerCase(), MAX_SENDS_PER_RECIPIENT, now))
  ) {
    return { ok: false, response: reject("Too many requests. Please try again later.", 429) }
  }

  return { ok: true, email }
}
