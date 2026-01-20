import { importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { BookPageNavigation } from '@/components/book-page-navigation'
import { BookMobileNav } from '@/components/book-mobile-nav'

export async function generateMetadata() {
  const { metadata } = await importPage([])

  const ogTitle = 'Tiles Book: Privacy technology for everyone!'
  const description =
    'Technical documentation covering Tiles, the consumer offering, and Tilekit, the developer-facing, Rust-based Modelfile SDK.'
  // Use absolute title to bypass template since ogTitle already includes "Tiles Book: "
  return {
    ...metadata,
    description,
    title: { absolute: ogTitle },
    openGraph: {
      ...metadata.openGraph,
      title: ogTitle,
      description,
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: 'Tiles Book: Privacy technology for everyone!',
        },
      ],
    },
    twitter: {
      ...metadata.twitter,
      title: ogTitle,
      description,
      images: ['/api/og'],
    },
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function BookIndexPage() {
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage([])

  const params = { mdxPath: [] as string[] }

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent params={params} />
      <BookMobileNav />
      <BookPageNavigation />
    </Wrapper>
  )
}

