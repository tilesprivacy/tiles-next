'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

type BookOfflineCacheRegistrarProps = {
  routes: string[]
}

export function BookOfflineCacheRegistrar({ routes }: BookOfflineCacheRegistrarProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    if (!pathname.startsWith('/book')) {
      return
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/book-sw.js', {
          scope: '/book',
        })

        const serviceWorker = registration.active ?? registration.waiting ?? registration.installing

        const normalizedRoutes = Array.from(
          new Set(['/book', pathname, ...routes].filter((route) => route.startsWith('/book'))),
        )

        if (serviceWorker) {
          serviceWorker.postMessage({
            type: 'PRECACHE_BOOK_ROUTES',
            routes: normalizedRoutes,
          })
        }
      } catch {
        // Intentionally ignore registration failures.
      }
    }

    registerServiceWorker()
  }, [pathname, routes])

  return null
}
