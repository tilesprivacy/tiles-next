const CACHE_VERSION = 'tiles-book-v1'
const BOOK_CACHE_NAME = `${CACHE_VERSION}-pages`

const normalizeToPath = (value) => {
  if (!value || typeof value !== 'string') return null

  try {
    const parsed = new URL(value, self.location.origin)
    if (parsed.origin !== self.location.origin) return null
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return null
  }
}

const cacheUrls = async (urls) => {
  const cache = await caches.open(BOOK_CACHE_NAME)
  const candidates = Array.from(new Set(urls.map(normalizeToPath).filter(Boolean)))

  await Promise.allSettled(
    candidates.map(async (url) => {
      const response = await fetch(url, { credentials: 'same-origin' })
      if (response.ok) {
        await cache.put(url, response)
      }
    }),
  )
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith('tiles-book-') && key !== BOOK_CACHE_NAME)
          .map((key) => caches.delete(key)),
      )

      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'BOOK_PRECACHE' || !Array.isArray(event.data?.urls)) {
    return
  }

  event.waitUntil(cacheUrls(event.data.urls))
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  const url = new URL(request.url)
  const isSameOrigin = url.origin === self.location.origin
  const isBookRequest = url.pathname.startsWith('/book')
  const isNextAsset = url.pathname.startsWith('/_next/')

  if (!isSameOrigin || (!isBookRequest && !isNextAsset)) {
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(BOOK_CACHE_NAME)
      const cached = await cache.match(request)
      if (cached) {
        return cached
      }

      try {
        const response = await fetch(request)
        if (response.ok) {
          await cache.put(request, response.clone())
        }
        return response
      } catch {
        if (isBookRequest) {
          const fallback = await cache.match('/book')
          if (fallback) return fallback
        }
        throw new Error('Network unavailable and no cached response')
      }
    })(),
  )
})
