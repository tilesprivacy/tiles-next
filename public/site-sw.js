const CACHE_VERSION = 'tiles-site-v1'
const SITE_CACHE_NAME = `${CACHE_VERSION}-pages`

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

const extractAssetPaths = (html) => {
  if (!html || typeof html !== 'string') return []

  const matches = html.matchAll(/(?:href|src)=["']([^"']+)["']/g)
  return Array.from(matches)
    .map((match) => normalizeToPath(match[1]))
    .filter(Boolean)
}

const cacheResponse = async (cache, path) => {
  const response = await fetch(path, { credentials: 'same-origin' })
  if (!response.ok) return

  await cache.put(path, response.clone())

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html')) return

  const html = await response.text()
  const assetPaths = extractAssetPaths(html)

  await Promise.allSettled(
    assetPaths.map(async (assetPath) => {
      const assetResponse = await fetch(assetPath, { credentials: 'same-origin' })
      if (assetResponse.ok) {
        await cache.put(assetPath, assetResponse)
      }
    }),
  )
}

const cacheUrls = async (urls) => {
  const cache = await caches.open(SITE_CACHE_NAME)
  const candidates = Array.from(new Set(urls.map(normalizeToPath).filter(Boolean)))

  await Promise.allSettled(candidates.map((path) => cacheResponse(cache, path)))
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
          .filter((key) => key.startsWith('tiles-site-') && key !== SITE_CACHE_NAME)
          .map((key) => caches.delete(key)),
      )

      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'SITE_PRECACHE' || !Array.isArray(event.data?.urls)) {
    return
  }

  event.waitUntil(cacheUrls(event.data.urls))
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      const cache = await caches.open(SITE_CACHE_NAME)
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
        if (request.mode === 'navigate') {
          const directFallback = await cache.match(url.pathname)
          if (directFallback) return directFallback

          const fallback = await cache.match('/')
          if (fallback) return fallback
        }
        throw new Error('Network unavailable and no cached response')
      }
    })(),
  )
})
