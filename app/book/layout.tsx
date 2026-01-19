import type { ReactNode } from 'react'
import { Layout } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { SiteHeader } from '@/components/site-header'
import { BookFooter } from '@/components/book-footer'
import { BookBreadcrumbLink } from '@/components/book-breadcrumb-link'
import { BookMobileBreadcrumb } from '@/components/book-mobile-breadcrumb'
import { BookDatestampMover } from '@/components/book-datestamp-mover'
import { BookCodeHighlightFix } from '@/components/book-code-highlight-fix'

export const metadata = {
  title: {
    template: 'Tiles Book: %s',
    default: 'Tiles Book: Privacy technology for everyone!',
  },
  description:
    'Technical documentation covering Tiles, the consumer offering, and Tilekit, the developer-facing, Rust-based Modelfile SDK.',
}

export default async function BookLayout({
  children,
}: {
  children: ReactNode
}) {
  const pageMap = await getPageMap()

  // Filter out unwanted routes from the sidebar
  const excludedRoutes = ['/', '/mission', '/download', '/explore', '/blog', '/changelog', '/privacy', '/sub-processors', '/subprocessors', '/terms']
  
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

  // Currently no route transformation is needed; work directly on the filtered map
  const transformedPageMap = filteredPageMap

  // Flatten the "book" folder if it exists - extract its children to the top level
  const flattenedPageMap = transformedPageMap.flatMap((item) => {
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

  // Define the correct order from _meta.json
  const desiredOrder = ['index', 'usage', 'models', 'memory', 'modelfile', 'mir', 'resources', 'contact']

  // Sort the pageMap according to the desired order
  const finalPageMap = flattenedPageMap.sort((a, b) => {
    const aName = 'name' in a ? (a.name as string) : ''
    const bName = 'name' in b ? (b.name as string) : ''

    const aIndex = desiredOrder.indexOf(aName)
    const bIndex = desiredOrder.indexOf(bName)

    // If both items are in the desired order, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }

    // If only one item is in the desired order, prioritize it
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1

    // If neither item is in the desired order, maintain their relative order
    return 0
  })

  return (
    <div className="relative flex min-h-screen flex-col bg-background" data-book-section>
      <SiteHeader themeAware />
      <BookBreadcrumbLink />
      <BookDatestampMover />
      <BookCodeHighlightFix />
      <div className="pt-16 lg:pt-24">
        <BookMobileBreadcrumb />
        <Layout
          pageMap={finalPageMap}
          docsRepositoryBase="https://github.com/tilesprivacy/tiles-next/tree/main"
          navigation={false}
        >
          {children}
        </Layout>
      </div>
      <BookFooter />
    </div>
  )
}
