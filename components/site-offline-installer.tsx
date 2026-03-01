'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const OFFLINE_BOOTSTRAP_KEY = 'tiles-site-offline-bootstrap-v2'

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

const normalizeToPath = (value: string): string | null => {
  try {
    const parsed = new URL(value, window.location.origin)
    if (parsed.origin !== window.location.origin) {
      return null
    }

    return `${parsed.pathname}${parsed.search}`
  } catch {
    return null
  }
}

const getSitemapRoutes = async (): Promise<string[]> => {
  try {
    const response = await fetch('/sitemap.xml', { credentials: 'same-origin' })
    if (!response.ok) {
      return []
    }

    const xml = await response.text()
    const locationMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g)

    return Array.from(locationMatches)
      .map((match) => normalizeToPath(match[1]))
      .filter((path): path is string => Boolean(path))
  } catch {
    return []
  }
}

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

        const alreadyBootstrapped = localStorage.getItem(OFFLINE_BOOTSTRAP_KEY) === '1'
        const discoveredResources = performance
          .getEntriesByType('resource')
          .map((entry) => entry.name)
          .filter((entry): entry is string => typeof entry === 'string')

        const sitemapRoutes = alreadyBootstrapped ? [] : await getSitemapRoutes()

        const routeCandidates = [
          ...SITE_ROUTES,
          pathname,
          ...sitemapRoutes,
          ...discoveredResources,
        ]

        const urls = Array.from(
          new Set(
            routeCandidates
              .map((candidate) => normalizeToPath(candidate))
              .filter((candidate): candidate is string => Boolean(candidate)),
          ),
        )

        if (urls.length === 0) {
          return
        }

        const payload = {
          type: 'SITE_PRECACHE',
          urls,
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

        localStorage.setItem(OFFLINE_BOOTSTRAP_KEY, '1')
      } catch (error) {
        console.warn('Tiles offline setup failed:', error)
      }
    }

    void register()
  }, [pathname])

  return null
}
