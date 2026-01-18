'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Map of route slugs to page titles
const pageTitles: Record<string, string> = {
  '': 'Tiles Book',
  'usage': 'Usage Guide',
  'models': 'Models',
  'memory': 'Memory',
  'modelfile': 'Modelfile',
  'mir': 'MIR Extension',
  'resources': 'Resources',
}

export function BookMobileBreadcrumb() {
  const pathname = usePathname()
  
  // Extract the current page slug from the pathname
  const slug = pathname.replace('/book/', '').replace('/book', '')
  const currentTitle = pageTitles[slug] || slug
  
  // Don't show breadcrumb on the index page
  const isIndexPage = slug === '' || slug === '/'
  
  if (isIndexPage) {
    return null
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="book-mobile-breadcrumb lg:hidden px-4 pt-4 pb-2"
    >
      <ol className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
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
    </nav>
  )
}
