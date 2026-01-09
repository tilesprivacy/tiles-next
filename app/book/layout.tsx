import type { ReactNode } from 'react'
import { Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { BookHeader } from '@/components/book-header'
import { BookFooter } from '@/components/book-footer'
import { BookBreadcrumbLink } from '@/components/book-breadcrumb-link'

export const metadata = {
  title: {
    template: '%s - Book',
    default: 'Tiles Book: Privacy technology for everyone!',
  },
  description: 'Tiles documentation',
}

export default async function BookLayout({
  children,
}: {
  children: ReactNode
}) {
  const pageMap = await getPageMap()

  // Filter out unwanted routes from the sidebar
  const excludedRoutes = ['/', '/manifesto', '/download', '/explore', '/blog', '/privacy', '/sub-processors', '/subprocessors', '/terms']
  
  const filterPageMap = (items: typeof pageMap): typeof pageMap => {
    return items
      .filter((item) => {
        // Check if item has a route property
        if ('route' in item) {
          const route = item.route as string
          // Exclude unwanted routes
          if (excludedRoutes.includes(route)) {
            return false
          }
          // Exclude routes that start with excluded paths
          if (excludedRoutes.some(excluded => route.startsWith(excluded + '/'))) {
            return false
          }
        }
        // Check if item has a name property and exclude unwanted names
        if ('name' in item) {
          const name = item.name as string
          if (excludedRoutes.some(excluded => excluded === `/${name}` || excluded.slice(1) === name)) {
            return false
          }
        }
        return true
      })
      .map((item) => {
        // If it's a folder, recursively filter its children
        if ('children' in item && Array.isArray(item.children)) {
          return {
            ...item,
            children: filterPageMap(item.children as typeof pageMap),
          }
        }
        return item
      })
  }

  // Filter the pageMap to only include book-related content
  const filteredPageMap = filterPageMap(pageMap)

  // Flatten the "book" folder if it exists - extract its children to the top level
  const finalPageMap = filteredPageMap.flatMap((item) => {
    // If this is a folder named "book" or has route "/book", extract its children
    if ('children' in item && Array.isArray(item.children)) {
      const name = 'name' in item ? item.name : ''
      const route = 'route' in item ? item.route : ''
      
      if (name === 'book' || route === '/book') {
        // Return the children directly instead of the folder
        return item.children as typeof pageMap
      }
    }
    return [item]
  })

  return (
    <div className="relative flex min-h-screen flex-col bg-background" data-book-section>
      <BookHeader />
      <BookBreadcrumbLink />
      <div className="pt-16 lg:pt-24">
        <Layout pageMap={finalPageMap}>
          {children}
        </Layout>
      </div>
      <BookFooter />
    </div>
  )
}
