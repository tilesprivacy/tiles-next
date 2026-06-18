'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// Map of route slugs to page titles
const pageTitles: Record<string, string> = {
  '': 'Tiles Book',
  'overview': 'Overview',
  'manual': 'Manual',
  'models': 'Models',
  'tilekit': 'Tilekit',
  'security': 'Security',
  'research': 'Research',
  'community': 'Community',
  'resources': 'Resources',
  'acknowledgements': 'Acknowledgements',
}

type TocItem = {
  id: string
  label: string
  depth: number
}

function getTocDepth(className: string): number {
  if (className.includes('ms-9')) return 3
  if (className.includes('ms-6')) return 2
  if (className.includes('ms-3')) return 1
  return 0
}

function getTocIndentClass(depth: number): string {
  if (depth <= 0) return ''
  if (depth === 1) return 'pl-3'
  if (depth === 2) return 'pl-6'
  return 'pl-9'
}

const bookMobileInlinePaddingClass =
  'px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-[max(1.25rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.25rem,env(safe-area-inset-right,0px))]'

const bookMobileIconButtonClass =
  'inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border-0 bg-transparent p-0 text-foreground transition-opacity duration-200 hover:opacity-75 focus-visible:ring-0 active:opacity-60'

function readNextraTocItems(): TocItem[] {
  const nav = document.querySelector('[data-book-section] nav.nextra-toc')
  if (!nav) return []

  return Array.from(nav.querySelectorAll('ul > li > a[href^="#"]')).map((anchor) => {
    const link = anchor as HTMLAnchorElement
    const href = link.getAttribute('href') ?? ''
    const id = decodeURIComponent(href.slice(1))

    return {
      id,
      label: link.innerText.trim() || link.textContent?.trim() || '',
      depth: getTocDepth(link.className),
    }
  })
}

function getHeaderOffset() {
  const breadcrumb = document.querySelector(
    '.book-mobile-breadcrumb',
  ) as HTMLElement | null
  if (breadcrumb && window.matchMedia('(max-width: 1023px)').matches) {
    return Math.ceil(breadcrumb.getBoundingClientRect().bottom + 12)
  }

  const header =
    (document.querySelector('header.site-header-chrome') as HTMLElement | null) ??
    (document.querySelector('header.fixed.inset-x-0') as HTMLElement | null)
  if (!header) return 96
  return Math.ceil(header.getBoundingClientRect().bottom + 12)
}

export function BookMobileBreadcrumb() {
  const pathname = usePathname()
  const slug = pathname.replace('/book/', '').replace('/book', '')
  const currentTitle = pageTitles[slug] || slug
  const navRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [breadcrumbTop, setBreadcrumbTop] = useState(0)
  const [navHeight, setNavHeight] = useState(0)
  const [panelTop, setPanelTop] = useState(0)
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  const isIndexPage = slug === '' || slug === '/'

  // Measure the breadcrumb at its *current* in-flow/sticky position so that
  // opening (which switches it to position: fixed) does not move it.
  const measureDropdownLayout = useCallback(() => {
    const nav = navRef.current
    if (!nav) return null

    const rect = nav.getBoundingClientRect()
    const top = Math.round(rect.top)
    const height = Math.round(rect.height)

    return {
      top,
      height,
      panelTop: top + height,
    }
  }, [])

  const applyDropdownLayout = useCallback(() => {
    const layout = measureDropdownLayout()
    if (!layout) return
    setBreadcrumbTop(layout.top)
    setNavHeight(layout.height)
    setPanelTop(layout.panelTop)
  }, [measureDropdownLayout])

  const toggleDropdown = useCallback(() => {
    if (!open) {
      applyDropdownLayout()
      setOpen(true)
      return
    }

    setOpen(false)
  }, [applyDropdownLayout, open])

  const scrollToId = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target) return

    const top = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset()
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })

    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, '', `#${id}`)
    }
  }, [])

  useEffect(() => {
    if (isIndexPage) return

    const header = document.querySelector(
      'header[data-tiles-site-header]',
    ) as HTMLElement | null
    const root = document.querySelector(
      '[data-book-section]',
    ) as HTMLElement | null
    if (!header || !root) return

    const syncHeaderHeight = () => {
      root.style.setProperty(
        '--book-mobile-header-height',
        `${Math.round(header.getBoundingClientRect().bottom)}px`,
      )
    }

    syncHeaderHeight()
    // Re-measure after layout/fonts settle so the breadcrumb stays flush.
    const frame = window.requestAnimationFrame(syncHeaderHeight)
    const settleTimer = window.setTimeout(syncHeaderHeight, 400)

    const observer = new ResizeObserver(syncHeaderHeight)
    observer.observe(header)
    window.addEventListener('resize', syncHeaderHeight)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
      observer.disconnect()
      window.removeEventListener('resize', syncHeaderHeight)
    }
  }, [isIndexPage, pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    window.addEventListener('resize', applyDropdownLayout)

    return () => {
      window.removeEventListener('resize', applyDropdownLayout)
    }
  }, [open, applyDropdownLayout])

  useLayoutEffect(() => {
    if (!open || typeof window === 'undefined') return

    const body = document.body
    const html = document.documentElement
    const scrollY = window.scrollY || window.pageYOffset
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
      htmlScrollBehavior: html.style.scrollBehavior,
    }

    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    return () => {
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      body.style.position = prev.bodyPosition
      body.style.top = prev.bodyTop
      body.style.left = prev.bodyLeft
      body.style.right = prev.bodyRight
      body.style.width = prev.bodyWidth
      html.style.scrollBehavior = 'auto'
      window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' })
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prev.htmlScrollBehavior
      })
    }
  }, [open])

  useEffect(() => {
    if (isIndexPage) return

    const syncToc = () => {
      const items = readNextraTocItems()
      if (items.length > 0) {
        setTocItems(items)
      }
      return items.length
    }

    if (syncToc() > 0) return

    const timers = [0, 120, 400, 900].map((delay) =>
      window.setTimeout(() => {
        syncToc()
      }, delay),
    )

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [isIndexPage, pathname])

  useEffect(() => {
    if (isIndexPage || tocItems.length === 0 || open) return

    const syncActive = () => {
      const offset = getHeaderOffset()
      const scrollAnchor = window.scrollY + offset + 1

      let nextActiveId = tocItems[0]?.id ?? ''
      for (const item of tocItems) {
        const heading = document.getElementById(item.id)
        if (!heading) continue
        const top = window.scrollY + heading.getBoundingClientRect().top
        if (top <= scrollAnchor) {
          nextActiveId = item.id
        } else {
          break
        }
      }

      setActiveId((current) => (current === nextActiveId ? current : nextActiveId))
    }

    syncActive()
    window.addEventListener('scroll', syncActive, { passive: true })
    window.addEventListener('resize', syncActive)

    return () => {
      window.removeEventListener('scroll', syncActive)
      window.removeEventListener('resize', syncActive)
    }
  }, [isIndexPage, open, pathname, tocItems])

  if (isIndexPage) {
    return null
  }

  return (
    <>
      {open && navHeight > 0 ? (
        <div className="lg:hidden" style={{ height: `${navHeight}px` }} aria-hidden />
      ) : null}
      <nav
        ref={navRef}
        aria-label="Breadcrumb"
        data-open={open ? 'true' : 'false'}
        className={`book-mobile-breadcrumb bg-background lg:hidden py-2 ${bookMobileInlinePaddingClass}`}
        style={open ? { top: `${breadcrumbTop}px` } : undefined}
      >
        <div className="flex min-h-11 items-center justify-between gap-3">
          <ol className="min-w-0 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link
                href="/book"
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Book
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-400 dark:text-gray-500">/</li>
            <li className="text-gray-700 dark:text-gray-300 truncate">
              {currentTitle}
            </li>
          </ol>

          {tocItems.length > 0 ? (
            <button
              type="button"
              aria-label={open ? 'Close on this page' : 'Open on this page'}
              aria-expanded={open}
              onClick={toggleDropdown}
              className={bookMobileIconButtonClass}
            >
              <ChevronDown
                className={`h-6 w-6 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                strokeWidth={2}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
      </nav>

      {tocItems.length > 0 ? (
        <div
          aria-hidden={!open}
          className={`fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden bg-background transition-[height] duration-300 ease-out lg:hidden ${
            open ? '' : 'pointer-events-none'
          }`}
          style={{
            top: `${panelTop}px`,
            height:
              open && panelTop > 0
                ? `calc(100dvh - ${panelTop}px)`
                : '0px',
          }}
        >
          <div
            className={`min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-4 ${bookMobileInlinePaddingClass}`}
          >
            <p className="mb-3 text-xs font-semibold text-muted-foreground">
              On this page
            </p>
            <ul className="space-y-1">
              {tocItems.map((item) => {
                const isActive = activeId === item.id
                return (
                  <li key={item.id} className={getTocIndentClass(item.depth)}>
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => {
                        event.preventDefault()
                        setActiveId(item.id)
                        setOpen(false)
                        window.setTimeout(() => {
                          scrollToId(item.id)
                        }, 0)
                      }}
                      className={`block break-words rounded px-1 py-1.5 text-sm leading-snug transition-colors ${
                        isActive
                          ? 'font-semibold text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  )
}
