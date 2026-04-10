'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { setActiveSlug } from '@/lib/nextra-active-anchor'

/**
 * Keeps Nextra's "On this page" TOC in sync with scroll position (same idea as BlogTableOfContents).
 * Nextra's default IntersectionObserver uses --nextra-navbar-height (64px) while the site header is taller,
 * so active highlighting is driven here with the real header offset.
 */
export function BookTocScrollSync() {
  const pathname = usePathname()

  useEffect(() => {
    const section = document.querySelector('[data-book-section]')
    if (!section) return

    const getScrollOffset = () => {
      const header =
        (document.querySelector('header.site-header-chrome') as HTMLElement | null) ??
        (document.querySelector('header.fixed.inset-x-0') as HTMLElement | null)
      const headerHeight = header?.getBoundingClientRect().height ?? 88
      return Math.ceil(headerHeight + 16)
    }

    const getHeadings = () =>
      Array.from(
        section.querySelectorAll(
          'article main :is(h2,h3,h4,h5,h6)[id]',
        ),
      ) as HTMLElement[]

    const tocNav = () =>
      section.querySelector<HTMLElement>(
        'nav[aria-label="table of contents"], nav.nextra-toc',
      )

    const syncAriaCurrent = (activeId: string) => {
      const nav = tocNav()
      if (!nav) return
      nav.querySelectorAll('a[href^="#"]').forEach((a) => {
        const href = a.getAttribute('href') ?? ''
        const id = decodeURIComponent(href.slice(1))
        if (id && id === activeId) {
          a.setAttribute('aria-current', 'location')
        } else {
          a.removeAttribute('aria-current')
        }
      })
    }

    const sync = () => {
      const headings = getHeadings()
      if (headings.length === 0) {
        setActiveSlug('')
        syncAriaCurrent('')
        return
      }

      const offset = getScrollOffset()
      const scrollAnchor = window.scrollY + offset + 1

      let activeId = headings[0].id
      for (const el of headings) {
        const top = window.scrollY + el.getBoundingClientRect().top
        if (top <= scrollAnchor) {
          activeId = el.id
        } else {
          break
        }
      }

      setActiveSlug(activeId)
      syncAriaCurrent(activeId)
    }

    const onScroll = () => sync()

    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', sync)

    const onHashChange = () => {
      window.requestAnimationFrame(() => {
        sync()
      })
    }
    window.addEventListener('hashchange', onHashChange)

    const t0 = window.setTimeout(sync, 0)
    const t1 = window.setTimeout(sync, 120)

    return () => {
      window.clearTimeout(t0)
      window.clearTimeout(t1)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', sync)
      window.removeEventListener('hashchange', onHashChange)
      setActiveSlug('')
    }
  }, [pathname])

  return null
}
