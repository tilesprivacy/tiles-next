'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  createResearchSectionNumberState,
  resolveResearchSectionNumber,
  type ResearchHeadingLevel,
} from '@/lib/research-section-numbering'

interface TocItem {
  id: string
  text: string
  level: 2 | 3 | 4
  sectionNumber?: string
}

interface BlogTableOfContentsProps {
  contentSelector?: string
  mode?: 'desktop' | 'mobile'
  introId?: string
  mobileTitle?: string
  navAriaLabel?: string
  enableResearchSectionNumbers?: boolean
}

const DEFAULT_INTRO_ID = 'blog-content-start'

function getMinHeadingLevel(items: TocItem[]): 2 | 3 | 4 {
  if (items.length === 0) return 2
  return Math.min(...items.map((item) => item.level)) as 2 | 3 | 4
}

function getTocItemIndentClass(level: 2 | 3 | 4, minHeadingLevel: 2 | 3 | 4): string {
  const depth = level - minHeadingLevel
  if (depth <= 0) return ''
  if (depth === 1) return 'pl-4'
  return 'pl-8'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function BlogTableOfContents({
  contentSelector = '.blog-article-content',
  mode = 'desktop',
  introId = DEFAULT_INTRO_ID,
  mobileTitle = 'Table of Contents',
  navAriaLabel = 'Table of contents',
  enableResearchSectionNumbers = false,
}: BlogTableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [stickyTop, setStickyTop] = useState<number>(112)
  const [isExpanded, setIsExpanded] = useState(true)

  const getScrollOffset = useCallback(() => {
    const header = document.querySelector('header.fixed.inset-x-0') as HTMLElement | null
    const headerHeight = header?.getBoundingClientRect().height ?? 88
    return Math.ceil(headerHeight + 16)
  }, [])

  const scrollToId = useCallback(
    (id: string, behavior: ScrollBehavior = 'smooth') => {
      const target = document.getElementById(id)
      if (!target) return

      const offset = getScrollOffset()
      const top = window.scrollY + target.getBoundingClientRect().top - offset

      window.scrollTo({
        top: Math.max(0, top),
        behavior,
      })

      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(null, '', `#${id}`)
      }
    },
    [getScrollOffset],
  )

  useEffect(() => {
    const root = document.querySelector(contentSelector)
    if (!root) return

    // Ensure there is a stable anchor at the beginning of article content.
    root.id = introId

    const headings = Array.from(
      root.querySelectorAll('h2, h3, h4'),
    ) as HTMLHeadingElement[]

    if (headings.length === 0) {
      setItems([])
      return
    }

    const usedIds = new Map<string, number>()
    const numberState = enableResearchSectionNumbers ? createResearchSectionNumberState() : null

    const tocItems: TocItem[] = headings.map((heading) => {
      const text = heading.textContent?.trim() || ''
      const level: ResearchHeadingLevel =
        heading.tagName === 'H4' ? 4 : heading.tagName === 'H3' ? 3 : 2
      const baseId = heading.id || slugify(text) || 'section'
      const duplicateCount = usedIds.get(baseId) ?? 0
      const id = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`

      usedIds.set(baseId, duplicateCount + 1)

      if (!heading.id) {
        heading.id = id
      }

      let sectionNumber: string | undefined
      if (numberState) {
        sectionNumber = resolveResearchSectionNumber(numberState, level, {
          explorationNumber: heading.getAttribute('data-exploration-number'),
          presetSectionNumber: heading.getAttribute('data-section-number'),
        })
        heading.setAttribute('data-section-number', sectionNumber)
      } else {
        heading.removeAttribute('data-section-number')
      }

      return { id: heading.id, text, level, sectionNumber }
    })

    const getActiveIdFromScroll = () => {
      const offset = getScrollOffset()
      const scrollAnchor = window.scrollY + offset + 1

      let nextActiveId = ''
      for (const heading of headings) {
        const headingTop = window.scrollY + heading.getBoundingClientRect().top
        if (headingTop <= scrollAnchor) {
          nextActiveId = heading.id
          continue
        }
        break
      }

      return nextActiveId
    }

    setItems(tocItems)
    setActiveId((current) => current || getActiveIdFromScroll())

    const syncActiveState = () => {
      const nextActiveId = getActiveIdFromScroll()
      setActiveId((current) => (current === nextActiveId ? current : nextActiveId))
    }

    syncActiveState()
    window.addEventListener('scroll', syncActiveState, { passive: true })
    window.addEventListener('resize', syncActiveState)

    return () => {
      window.removeEventListener('scroll', syncActiveState)
      window.removeEventListener('resize', syncActiveState)
    }
  }, [contentSelector, enableResearchSectionNumbers, getScrollOffset, introId])

  useEffect(() => {
    const hashId = window.location.hash.replace('#', '')
    if (!hashId) return

    const timer = window.setTimeout(() => {
      scrollToId(hashId, 'auto')
    }, 0)

    return () => window.clearTimeout(timer)
  }, [items, scrollToId])

  useEffect(() => {
    const header = document.querySelector('header.fixed.inset-x-0') as HTMLElement | null
    if (!header) return

    const updateStickyTop = () => {
      const headerHeight = header.getBoundingClientRect().height || 88
      setStickyTop(Math.ceil(headerHeight + 16))
    }

    updateStickyTop()
    window.addEventListener('resize', updateStickyTop)

    const observer = new ResizeObserver(updateStickyTop)
    observer.observe(header)

    return () => {
      window.removeEventListener('resize', updateStickyTop)
      observer.disconnect()
    }
  }, [])

  if (items.length === 0) {
    return null
  }

  const minHeadingLevel = getMinHeadingLevel(items)
  const navItems = (
    <ul className="space-y-2.5">
      {items.map((item) => {
          const isActive = activeId === item.id

          return (
            <li
              key={item.id}
              className={getTocItemIndentClass(item.level, minHeadingLevel)}
            >
              <a
                href={`#${item.id}`}
                className={`block text-sm leading-snug transition-colors ${
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveId(item.id)
                  scrollToId(item.id)
                }}
              >
                {item.sectionNumber ? (
                  <>
                    <span className="tabular-nums text-black/45 dark:text-white/45">
                      {item.sectionNumber}
                    </span>{' '}
                    {item.text}
                  </>
                ) : (
                  item.text
                )}
              </a>
            </li>
          )
        })}
    </ul>
  )

  if (mode === 'mobile') {
    return (
      <nav
        aria-label={navAriaLabel}
        className="rounded-sm border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.04]"
      >
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={isExpanded}
          aria-controls={`${introId}-mobile-toc-list`}
        >
          <span className="text-[1.15rem] font-medium text-black/60 dark:text-white/60">{mobileTitle}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            className={`h-4 w-4 text-black/45 transition-transform dark:text-white/45 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M5 12.5L10 7.5L15 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {isExpanded ? (
          <div id={`${introId}-mobile-toc-list`} className="mt-3.5">
            {navItems}
          </div>
        ) : null}
      </nav>
    )
  }

  return (
    <nav
      aria-label={navAriaLabel}
      className="sticky overflow-y-auto pr-4"
      style={{
        top: `${stickyTop}px`,
        maxHeight: `calc(100dvh - ${stickyTop + 16}px)`,
      }}
    >
      <a
        href="#top"
        className="mb-3 block border-b border-black/10 pb-3 text-sm font-medium uppercase tracking-wide text-black/55 transition-colors hover:text-black dark:border-white/10 dark:text-white/55 dark:hover:text-white"
        onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search)
          }
        }}
      >
        TOP ↑
      </a>
      {navItems}
    </nav>
  )
}
