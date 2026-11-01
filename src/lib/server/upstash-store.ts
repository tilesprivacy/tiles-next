import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis/cloudflare"
import { IP_WINDOW_SECONDS, MAX_SENDS_PER_IP, type GuardStore } from "./email-guard"

const REDIS_TIMEOUT_MS = 2_000

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Redis timed out")), REDIS_TIMEOUT_MS),
    ),
  ])
}

export function createUpstashStore(url: string, token: string): GuardStore {
  const redis = new Redis({ url, token, retry: { retries: 1, backoff: () => 200 } })
  const limiter = new Ratelimit({
    redis,
    prefix: "email-guard",
    limiter: Ratelimit.slidingWindow(MAX_SENDS_PER_IP, `${IP_WINDOW_SECONDS} s`),
    timeout: REDIS_TIMEOUT_MS,
  })

  return {
    async hitIpLimit(key) {
      const { success, reason } = await limiter.limit(key)
      // On timeout the library reports success, which would switch limiting off.
      if (reason === "timeout") throw new Error("Upstash rate limit timed out")
      return success
    },
    async claim(key, ttlSeconds) {
      const result = await withTimeout(redis.set(key, Date.now(), { nx: true, ex: ttlSeconds }))
      return result === "OK"
    },
    async release(key) {
      await withTimeout(redis.del(key))
    },
  }
}
