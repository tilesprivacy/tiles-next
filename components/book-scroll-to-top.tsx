'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function BookScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Only affect book pages
    if (!pathname.startsWith('/book')) return

    // Don't override explicit in-page section navigation (e.g. #heading links)
    if (window.location.hash) return

    // Let layout/DOM settle, then scroll to the very top so breadcrumbs are visible
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }, [pathname])

  return null
}

