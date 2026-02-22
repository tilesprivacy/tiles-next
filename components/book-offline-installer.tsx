'use client'

import { useEffect } from 'react'

const BOOK_ROUTES = [
  '/book',
  '/book/manual',
  '/book/models',
  '/book/memory',
  '/book/modelfile',
  '/book/mir',
  '/book/community',
  '/book/resources',
]

const STATIC_ASSET_HINTS = [
  '/icon.svg',
  '/icon-light-32x32.png',
  '/icon-dark-32x32.png',
  '/apple-icon.png',
]

export function BookOfflineInstaller() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/book-sw.js', {
          scope: '/book',
        })

        const discoveredResources = performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((entry): entry is string => typeof entry === 'string')

        const payload = {
          type: 'BOOK_PRECACHE',
          urls: [...BOOK_ROUTES, ...STATIC_ASSET_HINTS, ...discoveredResources],
        }

        const activeWorker = registration.active ?? registration.waiting
        if (activeWorker) {
          activeWorker.postMessage(payload)
        } else {
          navigator.serviceWorker.addEventListener(
            'controllerchange',
            () => {
              navigator.serviceWorker.controller?.postMessage(payload)
            },
            { once: true },
          )
        }
      } catch (error) {
        console.warn('Tiles Book offline setup failed:', error)
      }
    }

    void register()
  }, [])

  return null
}
