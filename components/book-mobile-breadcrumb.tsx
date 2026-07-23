'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BOOK_PAGES,
  getAdjacentBookPages,
} from '@/components/book-page-navigation'

const MOBILE_BOOK_PAGES = BOOK_PAGES.filter((page) => page.route !== '/book')

function isBookPageActive(pathname: string, route: string): boolean {
  const normalizedPath = pathname.replace(/\/$/, '') || '/book'
  const normalizedRoute = route.replace(/\/$/, '')

  if (normalizedPath === normalizedRoute) return true

  return normalizedPath.startsWith(`${normalizedRoute}/`)
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

  const header = document.querySelector<HTMLElement>(
    'header.minimal-topbar, header[data-tiles-site-header], header.site-header-chrome',
  )
  if (!header) return 96
  return Math.ceil(header.getBoundingClientRect().bottom + 12)
}

export function BookMobileBreadcrumb() {
  const pathname = usePathname()
  const slug = pathname.replace('/book/', '').replace('/book', '')
  const navRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeLinkRef = useRef<HTMLAnchorElement>(null)
  const [open, setOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(0)
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  const isIndexPage = slug === '' || slug === '/'

  const { prev: prevPage, next: nextPage } = getAdjacentBookPages(pathname)

  const measurePanelTop = useCallback(() => {
    const nav = navRef.current
    if (!nav) return 0

    const rect = nav.getBoundingClientRect()
    return Math.round(rect.bottom)
  }, [])

  const toggleDropdown = useCallback(() => {
    if (!open) {
      setPanelTop(measurePanelTop())
      setOpen(true)
      return
    }

    setOpen(false)
  }, [measurePanelTop, open])

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
    const scrollContainer = scrollRef.current
    const activeLink = activeLinkRef.current
    if (!scrollContainer || !activeLink) return

    const frame = window.requestAnimationFrame(() => {
      const containerRect = scrollContainer.getBoundingClientRect()
      const linkRect = activeLink.getBoundingClientRect()
      const offset =
        linkRect.left -
        containerRect.left -
        (containerRect.width - linkRect.width) / 2

      scrollContainer.scrollTo({
        left: scrollContainer.scrollLeft + offset,
        behavior: 'auto',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const syncPanelTop = () => {
      setPanelTop(measurePanelTop())
    }

    syncPanelTop()
    window.addEventListener('resize', syncPanelTop)

    return () => {
      window.removeEventListener('resize', syncPanelTop)
    }
  }, [open, measurePanelTop])

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

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Book pages"
        data-open={open ? 'true' : 'false'}
        className={`book-mobile-breadcrumb bg-background lg:hidden border-b border-border ${bookMobileInlinePaddingClass}`}
      >
        <div className="flex min-h-11 items-stretch gap-1">
          <div
            ref={scrollRef}
            className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max items-center gap-0.5 py-2 pr-2">
              {MOBILE_BOOK_PAGES.map((page) => {
                const isActive = isBookPageActive(pathname, page.route)

                return (
                  <Link
                    key={page.route}
                    ref={isActive ? activeLinkRef : undefined}
                    href={page.route}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-flex shrink-0 touch-manipulation items-center whitespace-nowrap px-3 py-1.5 text-sm leading-none transition-colors duration-200 no-underline hover:no-underline ${
                      isActive
                        ? 'font-semibold text-foreground'
                        : 'font-normal text-muted-foreground hover:text-foreground'
                    }`}
                    style={{ textDecoration: 'none' }}
                  >
                    {page.title}
                  </Link>
                )
              })}
            </div>
          </div>

          {tocItems.length > 0 ? (
            <div className="flex shrink-0 items-center border-l border-border pl-1">
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
            </div>
          ) : null}
        </div>
      </nav>
      <div aria-hidden="true" className="book-mobile-breadcrumb-spacer lg:hidden" />

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
            className={`min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border pb-4 pt-4 ${bookMobileInlinePaddingClass}`}
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

          {prevPage || nextPage ? (
            <div
              className={`shrink-0 flex items-center gap-3 border-t border-border pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] ${bookMobileInlinePaddingClass}`}
            >
              {prevPage ? (
                <Link
                  href={prevPage.route}
                  onClick={() => setOpen(false)}
                  className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">{prevPage.title}</span>
                </Link>
              ) : (
                <span className="flex-1" />
              )}
              {nextPage ? (
                <Link
                  href={nextPage.route}
                  onClick={() => setOpen(false)}
                  className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="truncate">{nextPage.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              ) : (
                <span className="flex-1" />
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
