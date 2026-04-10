const CACHE_VERSION = 'site-cache-v2'
const DOCUMENT_CACHE = `${CACHE_VERSION}-documents`
const ASSET_CACHE = `${CACHE_VERSION}-assets`
const DATA_CACHE = `${CACHE_VERSION}-data`

// Logos and favicons must not be served cache-first; updates should appear without another SW bump.
const BRANDING_PATHS = new Set([
  '/lighticon.png',
  '/grey.png',
  '/light.png',
  '/logo.png',
  '/og-logo.png',
  '/apple-logo.svg',
  '/apple-logo-white.svg',
  '/tiles_banner_outline_blk.svg',
  '/tiles_banner_outline_wht.svg',
  '/ua-logo.svg',
  '/apple-icon.png',
  '/favicon.ico',
  '/icon0.svg',
  '/icon1.png',
])

const STATIC_ASSET_PATTERN = /\.(?:css|js|mjs|png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|txt|xml|json)$/i

const isBrandingPathname = (pathname) => BRANDING_PATHS.has(pathname)

const isNextImageBrandingRequest = (requestUrl) => {
  if (requestUrl.pathname !== '/_next/image') {
    return false
  }
  const raw = requestUrl.searchParams.get('url')
  if (!raw) {
    return false
  }
  try {
    const decoded = decodeURIComponent(raw)
    const pathOnly = decoded.startsWith('http') ? new URL(decoded).pathname : decoded
    const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
    return isBrandingPathname(normalized)
  } catch {
    return false
  }
}

const isSameOrigin = (url) => url.origin === self.location.origin

const isDocumentRequest = (request) =>
  request.mode === 'navigate' ||
  request.destination === 'document' ||
  request.headers.get('accept')?.includes('text/html')

const isStaticAssetRequest = (requestUrl, request) =>
  requestUrl.pathname.startsWith('/_next/static/') ||
  request.destination === 'style' ||
  request.destination === 'script' ||
  request.destination === 'font' ||
  request.destination === 'image' ||
  STATIC_ASSET_PATTERN.test(requestUrl.pathname)

const isDataRequest = (requestUrl, request) =>
  requestUrl.pathname.startsWith('/_next/') ||
  request.headers.get('rsc') === '1' ||
  request.headers.get('next-router-prefetch') === '1' ||
  request.headers.get('accept')?.includes('text/x-component')

const shouldHandleRequest = (requestUrl) => {
  if (!isSameOrigin(requestUrl)) {
    return false
  }

  if (requestUrl.pathname.startsWith('/api/')) {
    return false
  }

  return true
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((name) => (name.startsWith('site-cache-') || name.startsWith('book-cache-')) && !name.startsWith(CACHE_VERSION))
          .map((name) => caches.delete(name)),
      )

      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(request.url)
  if (!shouldHandleRequest(requestUrl)) {
    return
  }

  if (isDocumentRequest(request)) {
    event.respondWith(
      (async () => {
        const documentCache = await caches.open(DOCUMENT_CACHE)

        try {
          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            await documentCache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch {
          const cachedResponse = await documentCache.match(request)
          if (cachedResponse) {
            return cachedResponse
          }

          const homepageFallback = await documentCache.match(`${self.location.origin}/`)
          if (homepageFallback) {
            return homepageFallback
          }

          return new Response('Offline. Reconnect and refresh to load this page.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        }
      })(),
    )
    return
  }

  if (isStaticAssetRequest(requestUrl, request)) {
    if (isBrandingPathname(requestUrl.pathname) || isNextImageBrandingRequest(requestUrl)) {
      event.respondWith(fetch(request))
      return
    }

    event.respondWith(
      (async () => {
        const assetCache = await caches.open(ASSET_CACHE)
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
    return
  }

  if (isDataRequest(requestUrl, request)) {
    event.respondWith(
      (async () => {
        const dataCache = await caches.open(DATA_CACHE)

        try {
          const networkResponse = await fetch(request)
          if (networkResponse.ok) {
            await dataCache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch {
          const cachedResponse = await dataCache.match(request)
          if (cachedResponse) {
            return cachedResponse
          }

          throw new Error('Offline and no cached data response available.')
        }
      })(),
    )
  }
})
