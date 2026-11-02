// The Workers cache (caches.default, per data centre). It doesn't exist in
// `vite dev`, where nothing is cached. The DOM typings for `caches` lack
// Cloudflare's `default`, hence the cast.
import { CHAT_HOST } from "#lib/chat/links"

const cache = typeof caches === "undefined" ? null : ((caches as unknown as { default?: Cache }).default ?? null)

/** Cache keys must be URLs; these never leave the Worker. */
export const edgeCacheKey = (kind: string, params: Record<string, string>) =>
  `https://${CHAT_HOST}/__cache/${kind}?${new URLSearchParams(params)}`

export async function edgeCacheGet(key: string): Promise<Response | null> {
  const hit = await cache?.match(key).catch(() => undefined)
  // Cached responses have read-only headers; hooks.server.ts adds its own.
  return hit ? new Response(hit.body, hit) : null
}

export async function edgeCachePut(key: string, response: Response): Promise<void> {
  await cache?.put(key, response).catch(() => {})
}
