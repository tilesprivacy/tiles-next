import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

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

  const navbar = (
    <Navbar logo={<span>Tiles Book</span>} />
  )

  const footer = (
    <Footer>
      © {new Date().getFullYear()} Tiles ·{' '}
      <a href="https://book.tiles.run">Book</a>
    </Footer>
  )

  return (
    <Layout navbar={navbar} footer={footer} pageMap={pageMap}>
      {children}
    </Layout>
  )
}
