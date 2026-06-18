'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type NavigationPage = {
  route: string
  title: string
}

// Known book pages in order - this matches the _meta.json structure
export const BOOK_PAGES: NavigationPage[] = [
  { route: '/book', title: 'Tiles Book' },
  { route: '/book/overview', title: 'Overview' },
  { route: '/book/manual', title: 'Manual' },
  { route: '/book/models', title: 'Models' },
  { route: '/book/tilekit', title: 'Tilekit' },
  { route: '/book/security', title: 'Security' },
  // { route: '/book/research', title: 'Research' }, // Hidden from book nav for now.
  { route: '/book/community', title: 'Community' },
  { route: '/book/resources', title: 'Resources' },
  { route: '/book/acknowledgements', title: 'Acknowledgements' },
  // { route: '/book/licenses', title: 'Licenses' },
]

export function getAdjacentBookPages(pathname: string): {
  prev: NavigationPage | null
  next: NavigationPage | null
} {
  const normalizedPath = pathname.replace(/\/$/, '') || '/book'

  let currentIndex = BOOK_PAGES.findIndex(
    (page) => page.route.replace(/\/$/, '') === normalizedPath,
  )

  if (currentIndex === -1) {
    // Match by route prefix to handle routes with additional segments.
    currentIndex = BOOK_PAGES.findIndex((page) => {
      const pageRoute = page.route.replace(/\/$/, '')
      return normalizedPath.startsWith(pageRoute + '/')
    })
  }

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex > 0 ? BOOK_PAGES[currentIndex - 1] : null,
    next: currentIndex < BOOK_PAGES.length - 1 ? BOOK_PAGES[currentIndex + 1] : null,
  }
}

export function BookPageNavigation() {
  const pathname = usePathname()
  const [prevPage, setPrevPage] = useState<NavigationPage | null>(null)
  const [nextPage, setNextPage] = useState<NavigationPage | null>(null)

  useEffect(() => {
    const { prev, next } = getAdjacentBookPages(pathname)
    setPrevPage(prev)
    setNextPage(next)
  }, [pathname])

  if (!prevPage && !nextPage) {
    return null
  }

  return (
    <nav
      data-book-navigation
      className="mt-12 mx-4 lg:mx-0 lg:mt-16"
    >
      {/* Outer gray container */}
      <div className="flex items-center gap-3 lg:gap-4 bg-muted dark:bg-secondary rounded-lg pl-5 pr-2 py-2 lg:pl-7 lg:pr-2.5 lg:py-2.5">
        {/* Previous Button - On Gray Background */}
        {prevPage ? (
          <Link
            href={prevPage.route}
            className="group flex items-center gap-1.5 lg:gap-2 text-muted-foreground hover:text-foreground transition-colors no-underline hover:no-underline"
            style={{ textDecoration: 'none' }}
          >
            <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
            <span className="text-sm lg:text-base font-normal">Previous</span>
          </Link>
        ) : (
          <div className="flex items-center gap-1.5 lg:gap-2 text-muted-foreground/50">
            <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
            <span className="text-sm lg:text-base font-normal">Previous</span>
          </div>
        )}

        {/* Inner panel - contains page title and navigation button */}
        <div className="flex-1 flex items-center justify-end gap-4 lg:gap-6 bg-background rounded-sm pl-4 pr-5 py-3.5 lg:pl-6 lg:pr-7 lg:py-4">
          {/* Show Next Page Title if exists, otherwise show Previous Page Title */}
          {nextPage ? (
            <span className="text-base lg:text-lg font-semibold text-foreground">
              {nextPage.title}
            </span>
          ) : prevPage ? (
            <span className="text-base lg:text-lg font-semibold text-foreground mr-auto">
              {prevPage.title}
            </span>
          ) : null}

          {/* Vertical Separator */}
          {nextPage && <div className="h-6 lg:h-7 w-px bg-border"></div>}

          {/* Next Button */}
          {nextPage ? (
            <Link
              href={nextPage.route}
              className="group flex items-center gap-1.5 lg:gap-2 text-muted-foreground hover:text-foreground transition-colors no-underline hover:no-underline"
              style={{ textDecoration: 'none' }}
            >
              <span className="text-sm lg:text-base font-normal">Next</span>
              <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
            </Link>
          ) : (
            <div className="flex items-center gap-1.5 lg:gap-2 text-muted-foreground/50">
              <span className="text-sm lg:text-base font-normal">Next</span>
              <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5 shrink-0" />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
