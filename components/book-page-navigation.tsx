'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type NavigationPage = {
  route: string
  title: string
}

// Known book pages in order - this matches the _meta.json structure
const BOOK_PAGES: NavigationPage[] = [
  { route: '/book', title: 'Index' },
  { route: '/book/proposal', title: 'Proposal' },
  { route: '/book/implementation', title: 'Implementation' },
  { route: '/book/reference', title: 'Reference' },
]

export function BookPageNavigation() {
  const pathname = usePathname()
  const [prevPage, setPrevPage] = useState<NavigationPage | null>(null)
  const [nextPage, setNextPage] = useState<NavigationPage | null>(null)

  useEffect(() => {
    // Normalize the current pathname
    const normalizedPath = pathname.replace(/\/$/, '') || '/book'
    
    // Find current page index
    const currentIndex = BOOK_PAGES.findIndex(page => {
      const pageRoute = page.route.replace(/\/$/, '')
      return normalizedPath === pageRoute
    })

    if (currentIndex !== -1) {
      setPrevPage(currentIndex > 0 ? BOOK_PAGES[currentIndex - 1] : null)
      setNextPage(currentIndex < BOOK_PAGES.length - 1 ? BOOK_PAGES[currentIndex + 1] : null)
    } else {
      // If exact match not found, try to find by route prefix
      // This handles cases where the route might have additional segments
      for (let i = 0; i < BOOK_PAGES.length; i++) {
        const pageRoute = BOOK_PAGES[i].route.replace(/\/$/, '')
        if (normalizedPath.startsWith(pageRoute + '/') || normalizedPath === pageRoute) {
          setPrevPage(i > 0 ? BOOK_PAGES[i - 1] : null)
          setNextPage(i < BOOK_PAGES.length - 1 ? BOOK_PAGES[i + 1] : null)
          break
        }
      }
    }
  }, [pathname])

  if (!prevPage && !nextPage) {
    return null
  }

  return (
    <nav data-book-navigation className="mt-12 flex gap-4 border-t border-foreground/10 pt-8 lg:mt-16 lg:border-t-0 lg:pt-12">
      {prevPage ? (
        <Link
          href={prevPage.route}
          className="group flex flex-1 items-start gap-3 rounded-lg border border-foreground/10 bg-background p-4 transition-all hover:border-foreground/20 hover:bg-foreground/5 lg:border-0 lg:p-6"
        >
          <ChevronLeft className="h-5 w-5 shrink-0 text-foreground/60 transition-colors group-hover:text-foreground lg:h-6 lg:w-6" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground/60 lg:text-sm">Previous</span>
            <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 lg:text-base">
              {prevPage.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      
      {nextPage ? (
        <Link
          href={nextPage.route}
          className="group flex flex-1 items-start justify-end gap-3 rounded-lg border border-foreground/10 bg-background p-4 text-right transition-all hover:border-foreground/20 hover:bg-foreground/5 lg:border-0 lg:p-6"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground/60 lg:text-sm">Next</span>
            <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 lg:text-base">
              {nextPage.title}
            </span>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-foreground/60 transition-colors group-hover:text-foreground lg:h-6 lg:w-6" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  )
}

