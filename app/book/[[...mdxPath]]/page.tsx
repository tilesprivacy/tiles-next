import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'
import { BookPageNavigation } from '@/components/book-page-navigation'
import { BookMobileNav } from '@/components/book-mobile-nav'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: {
  params: Promise<{ mdxPath?: string[] }>
}) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  
  // Override title for the index page (when mdxPath is empty or undefined)
  if (!params.mdxPath || params.mdxPath.length === 0) {
    return {
      ...metadata,
      title: 'Tiles Book: Privacy technology for everyone!',
    }
  }
  
  // Format title for non-index pages: "Tiles Book: {page title}"
  const pageTitle = typeof metadata.title === 'string' 
    ? metadata.title 
    : metadata.title?.default || metadata.title?.absolute || 'Tiles Book'
  
  return {
    ...metadata,
    title: pageTitle.startsWith('Tiles Book:') 
      ? pageTitle 
      : `Tiles Book: ${pageTitle}`,
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: {
  params: Promise<{ mdxPath?: string[] }>
}) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(params.mdxPath)

  // Check if this is the index page (no mdxPath or empty array)
  const isIndexPage = !params.mdxPath || params.mdxPath.length === 0

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
      {isIndexPage && <BookMobileNav />}
      <BookPageNavigation />
    </Wrapper>
  )
}
