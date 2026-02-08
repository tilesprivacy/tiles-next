'use client'

import { useCallback, useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

interface BlogTableOfContentsProps {
  contentSelector?: string
}

const INTRO_ID = 'blog-content-start'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function BlogTableOfContents({
  contentSelector = '.blog-article-content',
}: BlogTableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

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
    root.id = INTRO_ID

    const headings = Array.from(
      root.querySelectorAll('h2, h3'),
    ) as HTMLHeadingElement[]

    if (headings.length === 0) {
      setItems([])
      return
    }

    const usedIds = new Map<string, number>()
    const tocItems: TocItem[] = headings.map((heading) => {
      const text = heading.textContent?.trim() || ''
      const level = heading.tagName === 'H3' ? 3 : 2
      const baseId = heading.id || slugify(text) || 'section'
      const duplicateCount = usedIds.get(baseId) ?? 0
      const id = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`

      usedIds.set(baseId, duplicateCount + 1)

      if (!heading.id) {
        heading.id = id
      }

      return { id: heading.id, text, level }
    })

    setItems(tocItems)
    setActiveId((current) => current || tocItems[0]?.id || '')

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          )[0]

        if (visible?.target?.id) {
          setActiveId(visible.target.id)
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0, 1],
      },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [contentSelector])

  useEffect(() => {
    const hashId = window.location.hash.replace('#', '')
    if (!hashId) return

    const timer = window.setTimeout(() => {
      scrollToId(hashId, 'auto')
    }, 0)

    return () => window.clearTimeout(timer)
  }, [items, scrollToId])

  if (items.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-32 max-h-[calc(100dvh-9rem)] overflow-y-auto pr-4"
    >
      <a
        href={`#${INTRO_ID}`}
        className="mb-3 block text-sm font-medium text-black/55 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
        onClick={(e) => {
          e.preventDefault()
          setActiveId(INTRO_ID)
          scrollToId(INTRO_ID)
        }}
      >
        Introduction
      </a>
      <ul className="space-y-2.5">
        {items.map((item) => {
          const isActive = activeId === item.id

          return (
            <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
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
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
