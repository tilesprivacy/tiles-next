import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import { BookLogo } from '@/components/book-logo'
import { NavbarLinks } from '@/components/navbar-links'

export const metadata = {
  title: {
    template: '%s - Tiles Book',
    default: 'Tiles Book',
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
  const excludedRoutes = ['/', '/about', '/download', '/explore', '/blog', '/book/registry']
  
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
          // Also exclude registry route variations
          if (route.includes('/registry') || route.endsWith('/registry')) {
            return false
          }
        }
        // Check if item has a name property and exclude registry
        if ('name' in item) {
          const name = item.name as string
          if (name === 'registry' || name.toLowerCase() === 'registry') {
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

  let filteredPageMap = filterPageMap(pageMap)

  // Flatten the "book" folder if it exists - extract its children to the top level
  filteredPageMap = filteredPageMap.flatMap((item) => {
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

  const navbar = (
    <Navbar 
      logo={<BookLogo />}
      projectLink="https://github.com/tilesprivacy"
      chatLink="https://go.tiles.run/discord"
    >
      <NavbarLinks />
    </Navbar>
  )

  const footer = (
    <Footer>
      © 2026 Tiles Privacy
    </Footer>
  )

  return (
    <>
      <Layout navbar={navbar} footer={footer} pageMap={filteredPageMap}>
        {children}
      </Layout>
    </>
  )
}
