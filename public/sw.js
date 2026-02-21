const SW_VERSION = "v1"
const CORE_CACHE = `tiles-core-${SW_VERSION}`
const PAGE_CACHE = `tiles-pages-${SW_VERSION}`
const CONTENT_CACHE = `tiles-content-${SW_VERSION}`
const ASSET_CACHE = `tiles-assets-${SW_VERSION}`

const CORE_PRECACHED_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/logo.png",
  "/apple-icon.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_PRECACHED_URLS)).then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![CORE_CACHE, PAGE_CACHE, CONTENT_CACHE, ASSET_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

const isContentPath = (pathname) => pathname.startsWith("/blog") || pathname.startsWith("/book")

self.addEventListener("fetch", (event) => {
  const { request } = event

  if (request.method !== "GET") {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    return
  }

  if (request.mode === "navigate") {
    if (isContentPath(url.pathname)) {
      event.respondWith(staleWhileRevalidate(request, CONTENT_CACHE))
      return
    }

    event.respondWith(networkFirst(request, PAGE_CACHE, "/offline"))
    return
  }

  if (["style", "script", "font", "image"].includes(request.destination)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE))
    return
  }

  if (isContentPath(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, CONTENT_CACHE))
  }
})

async function networkFirst(request, cacheName, offlinePath) {
  const cache = await caches.open(cacheName)

  try {
    const networkResponse = await fetch(request)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    const fallback = await caches.match(offlinePath)
    if (fallback) {
      return fallback
    }

    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    })
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) {
    return cached
  }

  const response = await fetch(request)
  cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const networkPromise = fetch(request)
    .then((response) => {
      cache.put(request, response.clone())
      return response
    })
    .catch(() => undefined)

  if (cached) {
    return cached
  }

  const networkResponse = await networkPromise
  if (networkResponse) {
    return networkResponse
  }

  return new Response("Offline", {
    status: 503,
    headers: { "Content-Type": "text/plain" },
  })
}
