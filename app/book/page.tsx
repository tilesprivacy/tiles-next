import { importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { BookPageNavigation } from '@/components/book-page-navigation'
import { BookMobileNav } from '@/components/book-mobile-nav'

export async function generateMetadata() {
  const { metadata } = await importPage([])

  const canonicalTabTitle =
    'Tiles Book: Technical documentation for the models, infrastructure, and cryptography powering Tiles.'
  const ogTitle = canonicalTabTitle
  const description =
    'Technical documentation covering the models, infrastructure, and cryptography behind Tiles, the consumer offering, and Tilekit, the developer-facing, Rust-based Modelfile SDK.'
  // Use absolute title for the index page so it does not depend on a child heading.
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
          alt: ogTitle,
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

