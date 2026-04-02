'use client'

import { useEffect } from 'react'

const SITE_CACHE_PREFIX = 'site-cache-'
const LEGACY_BOOK_CACHE_PREFIX = 'book-cache-'

export function SiteOfflineCacheRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const isDevelopment = process.env.NODE_ENV !== 'production'

    const cleanupLegacyServiceWorkers = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          registrations
            .filter((registration) => {
              const scriptUrl = registration.active?.scriptURL ?? registration.waiting?.scriptURL ?? registration.installing?.scriptURL ?? ''
              return scriptUrl.endsWith('/book-sw.js')
            })
            .map((registration) => registration.unregister()),
        )

        const cacheKeys = await caches.keys()
        await Promise.all(
          cacheKeys
            .filter((key) => key.startsWith(LEGACY_BOOK_CACHE_PREFIX))
            .map((key) => caches.delete(key)),
        )
      } catch {
        // Ignore cleanup failures.
      }
    }

    const cleanupDevelopmentServiceWorkers = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          registrations
            .filter((registration) => {
              const scriptUrl = registration.active?.scriptURL ?? registration.waiting?.scriptURL ?? registration.installing?.scriptURL ?? ''
              return scriptUrl.endsWith('/site-sw.js') || scriptUrl.endsWith('/book-sw.js')
            })
            .map((registration) => registration.unregister()),
        )

        const cacheKeys = await caches.keys()
        await Promise.all(
          cacheKeys
            .filter((key) => key.startsWith(SITE_CACHE_PREFIX) || key.startsWith(LEGACY_BOOK_CACHE_PREFIX))
            .map((key) => caches.delete(key)),
        )
      } catch {
        // Ignore cleanup failures in development.
      }
    }

    if (isDevelopment) {
      cleanupDevelopmentServiceWorkers()
      return
    }

    const registerServiceWorker = async () => {
      await cleanupLegacyServiceWorkers()

      try {
        await navigator.serviceWorker.register('/site-sw.js', {
          scope: '/',
        })
      } catch {
        // Intentionally ignore registration failures.
      }
    }

    registerServiceWorker()
  }, [])

  return null
}
