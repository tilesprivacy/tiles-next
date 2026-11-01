// Offline cache. Pages are network-first so visitors always get the latest
// deploy when online; only content-hashed build files and fonts, which never
// change at the same URL, are served cache-first.

import { self } from "$app/service-worker"
import { version } from "$app/env"

const PAGES = `site-pages-${version}`
const ASSETS = `site-assets-${version}`
const CURRENT = new Set([PAGES, ASSETS])

const isImmutable = (url: URL) => url.pathname.startsWith("/_app/immutable/") || url.pathname.startsWith("/fonts/")

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Drops older versions, and the previous site's site-cache-*/book-cache-* caches.
      for (const name of await caches.keys()) {
        if (!CURRENT.has(name)) await caches.delete(name)
      }
      await self.clients.claim()
    })(),
  )
})

async function networkFirstPage(event: FetchEvent): Promise<Response> {
  const cache = await caches.open(PAGES)
  try {
    const response = await fetch(event.request)
    // Not awaited, so the page can stream while the copy is stored.
    if (response.ok && response.type === "basic") {
      event.waitUntil(cache.put(event.request, response.clone()).catch(() => {}))
    }
    return response
  } catch {
    const cached = (await cache.match(event.request)) ?? (await cache.match("/"))
    return (
      cached ??
      new Response("Offline. Reconnect and refresh to load this page.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    )
  }
}

async function cacheFirstAsset(event: FetchEvent): Promise<Response> {
  const cache = await caches.open(ASSETS)
  const cached = await cache.match(event.request)
  if (cached) return cached
  const response = await fetch(event.request)
  if (response.ok && response.type === "basic") {
    event.waitUntil(cache.put(event.request, response.clone()).catch(() => {}))
  }
  return response
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith("/api/")) return

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(event))
  } else if (isImmutable(url)) {
    event.respondWith(cacheFirstAsset(event))
  }
  // Everything else goes to the network as normal.
})
