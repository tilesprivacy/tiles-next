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
  { route: '/book', title: 'Tiles Book' },
  { route: '/book/manual', title: 'Manual' },
  { route: '/book/models', title: 'Models' },
  { route: '/book/memory', title: 'Memory' },
  { route: '/book/modelfile', title: 'Modelfile' },
  { route: '/book/mir', title: 'MIR Extension' },
  { route: '/book/community', title: 'Community' },
  { route: '/book/resources', title: 'Resources' },
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
    <nav data-book-navigation className="flex mt-12 justify-between gap-4 border-t border-foreground/10 pt-8 mx-4 lg:mx-0 lg:mt-16 lg:pt-12">
      {prevPage ? (
        <Link
          href={prevPage.route}
          className="group flex items-center gap-2 transition-all lg:gap-3"
        >
          <ChevronLeft className="h-5 w-5 shrink-0 text-foreground/60 transition-colors group-hover:text-foreground lg:h-6 lg:w-6" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground/60 lg:text-sm">Previous</span>
            <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-foreground/80 lg:text-base">
              {prevPage.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      
      {nextPage ? (
        <Link
          href={nextPage.route}
          className="group flex items-center justify-end gap-2 text-right transition-all lg:gap-3"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground/60 lg:text-sm">Next</span>
            <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-foreground/80 lg:text-base">
              {nextPage.title}
            </span>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-foreground/60 transition-colors group-hover:text-foreground lg:h-6 lg:w-6" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}

