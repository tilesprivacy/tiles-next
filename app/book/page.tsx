import { importPage } from 'nextra/pages'
import { getSocialImage } from '@/lib/social-image'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { BookPageNavigation } from '@/components/book-page-navigation'
import { BookMobileNav } from '@/components/book-mobile-nav'

export async function generateMetadata() {
  const { metadata } = await importPage([])

  const canonicalTabTitle =
    'Tiles Book: Technical documentation for Tiles and Tilekit'
  const ogTitle = canonicalTabTitle
  const socialImage = getSocialImage('Tiles Book')
  const description =
    'Technical documentation covering the models, infrastructure, and cryptography behind Tiles, the consumer product, and Tilekit, the developer-facing SDK written in Rust.'
  // Use absolute title for the index page so it does not depend on a child heading.
  return {
    ...metadata,
    description,
    title: { absolute: ogTitle },
    openGraph: {
      ...metadata.openGraph,
      title: ogTitle,
      description,
      images: [{ ...socialImage, alt: ogTitle }],
    },
    twitter: {
      ...metadata.twitter,
      title: ogTitle,
      description,
      images: [socialImage.url],
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
