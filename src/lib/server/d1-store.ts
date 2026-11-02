// The newsletter limits on Cloudflare D1 (schema in migrations/). Each check
// is one SQL statement, and D1 runs statements one at a time, so two signups
// for the same address can never both win the claim.
import { IP_WINDOW_SECONDS, MAX_SENDS_PER_IP, type GuardStore } from "./email-guard"

const D1_TIMEOUT_MS = 2_000

// A hung query must not hold the request open; the guard treats it as an outage.
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error("D1 timed out")), D1_TIMEOUT_MS)
    }),
  ]).finally(() => clearTimeout(timer))
}

export function createD1Store(db: D1Database, now: () => number = Date.now): GuardStore {
  return {
    async hitIpLimit(key) {
      const at = now()
      const windowStart = at - IP_WINDOW_SECONDS * 1_000
      // Only records the hit if the IP is still under the limit.
      const [, inserted] = await withTimeout(
        db.batch([
          db.prepare("DELETE FROM ip_hits WHERE at <= ?1").bind(windowStart),
          db
            .prepare(
              `INSERT INTO ip_hits (key, at)
               SELECT ?1, ?2 WHERE (SELECT COUNT(*) FROM ip_hits WHERE key = ?1 AND at > ?3) < ?4`,
            )
            .bind(key, at, windowStart, MAX_SENDS_PER_IP),
        ]),
      )
      return inserted.meta.changes === 1
    },

    async claim(key, ttlSeconds) {
      const at = now()
      // Expired claims are deleted (the privacy policy promises at most 30
      // days); then a new key is claimed and a live claim is left alone.
      const [, claimed] = await withTimeout(
        db.batch([
          db.prepare("DELETE FROM email_claims WHERE expires_at <= ?1").bind(at),
          db
            .prepare("INSERT INTO email_claims (key, expires_at) VALUES (?1, ?2) ON CONFLICT (key) DO NOTHING")
            .bind(key, at + ttlSeconds * 1_000),
        ]),
      )
      return claimed.meta.changes === 1
    },

    async release(key) {
      await withTimeout(db.prepare("DELETE FROM email_claims WHERE key = ?1").bind(key).run())
    },
  }
}
