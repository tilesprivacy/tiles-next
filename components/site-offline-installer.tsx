'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SITE_ROUTES = [
  '/',
  '/mission',
  '/download',
  '/changelog',
  '/privacy',
  '/terms',
  '/sub-processors',
  '/subprocessors',
  '/blog',
  '/blog/introducing-tiles-public-alpha',
  '/blog/move-along-python',
  '/book',
  '/book/manual',
  '/book/models',
  '/book/memory',
  '/book/modelfile',
  '/book/mir',
  '/book/community',
  '/book/resources',
  '/llms.txt',
]

export function SiteOfflineInstaller() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/site-sw.js', {
          scope: '/',
        })

        if (pathname !== '/') {
          return
        }

        const discoveredResources = performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((entry): entry is string => typeof entry === 'string')

        const payload = {
          type: 'SITE_PRECACHE',
          urls: [...SITE_ROUTES, ...discoveredResources],
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
        console.warn('Tiles offline setup failed:', error)
      }
    }

    void register()
  }, [pathname])

  return null
}
