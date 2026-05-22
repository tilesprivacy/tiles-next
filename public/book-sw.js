const CACHE_VERSION = 'book-cache-v1'
const BOOK_PAGE_CACHE = `${CACHE_VERSION}-pages`
const BOOK_ASSET_CACHE = `${CACHE_VERSION}-assets`
const IS_LOCALHOST =
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.hostname === '[::1]'

const BOOK_FILE_PATTERN = /\.(?:css|js|mjs|png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?|ttf)$/i

const toAbsoluteBookUrl = (route) => {
  const path = route.startsWith('/') ? route : `/${route}`
  return new URL(path, self.location.origin).toString()
}

self.addEventListener('install', (event) => {
  if (IS_LOCALHOST) {
    event.waitUntil(self.skipWaiting())
    return
  }

  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      if (IS_LOCALHOST) {
        const registrations = await self.registration.unregister()
        void registrations
      }

      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('book-cache-') && !name.startsWith(CACHE_VERSION))
          .map((name) => caches.delete(name)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (IS_LOCALHOST) {
    return
  }

  if (!event.data || event.data.type !== 'PRECACHE_BOOK_ROUTES') {
    return
  }

  const routes = Array.isArray(event.data.routes) ? event.data.routes : []

  event.waitUntil(
    (async () => {
      const pageCache = await caches.open(BOOK_PAGE_CACHE)
      const assetCache = await caches.open(BOOK_ASSET_CACHE)

      await Promise.all(
        routes
          .filter((route) => typeof route === 'string' && route.startsWith('/book'))
          .map(async (route) => {
            const url = toAbsoluteBookUrl(route)

            try {
              const pageResponse = await fetch(url, { credentials: 'same-origin' })
              if (pageResponse.ok) {
                await pageCache.put(url, pageResponse.clone())

                const contentType = pageResponse.headers.get('content-type') ?? ''
                if (contentType.includes('text/html')) {
                  const html = await pageResponse.text()
                  const assetMatches = html.match(/(?:href|src)="([^"]+)"/g) ?? []

                  await Promise.all(
                    assetMatches.map(async (attribute) => {
                      const match = attribute.match(/"([^"]+)"/)
                      if (!match) return

                      const assetUrl = new URL(match[1], url)
                      if (assetUrl.origin !== self.location.origin) return

                      const isBookAsset =
                        assetUrl.pathname.startsWith('/_next/') ||
                        assetUrl.pathname.startsWith('/book') ||
                        BOOK_FILE_PATTERN.test(assetUrl.pathname)

                      if (!isBookAsset) return

                      try {
                        const assetResponse = await fetch(assetUrl.toString(), { credentials: 'same-origin' })
                        if (assetResponse.ok) {
                          await assetCache.put(assetUrl.toString(), assetResponse)
                        }
                      } catch {
                        // Ignore cache misses and network issues during background precaching.
                      }
                    }),
                  )
                }
              }
            } catch {
              // Ignore network failures; runtime fetch handler serves best-effort cache.
            }
          }),
      )
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  if (IS_LOCALHOST) {
    return
  }

  const request = event.request

  if (request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.origin !== self.location.origin) {
    return
  }

  const isBookDocument = request.mode === 'navigate' && requestUrl.pathname.startsWith('/book')
  const isBookAsset =
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    requestUrl.pathname.startsWith('/_next/') ||
    requestUrl.pathname.startsWith('/book') ||
    BOOK_FILE_PATTERN.test(requestUrl.pathname)

  if (!isBookDocument && !isBookAsset) {
    return
  }

  if (isBookDocument) {
    event.respondWith(
      (async () => {
        const pageCache = await caches.open(BOOK_PAGE_CACHE)
        try {
          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            await pageCache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch {
          const cachedResponse = await pageCache.match(request)
          if (cachedResponse) {
            return cachedResponse
          }

          const fallback = await pageCache.match('/book')
          if (fallback) {
            return fallback
          }

          return new Response('Offline. Please reconnect and refresh.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        }
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const assetCache = await caches.open(BOOK_ASSET_CACHE)
      const cachedResponse = await assetCache.match(request)

      if (cachedResponse) {
        return cachedResponse
      }

      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        await assetCache.put(request, networkResponse.clone())
      }
      return networkResponse
    })(),
  )
})
