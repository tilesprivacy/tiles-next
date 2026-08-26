import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { getSocialImage } from '@/lib/social-image'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'
import { BookPageNavigation } from '@/components/book-page-navigation'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: {
  params: Promise<{ mdxPath: string[] }>
}) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)

  // Extract the page title - handle both string and object formats
  let pageTitle =
    typeof metadata.title === 'string'
      ? metadata.title
      : metadata.title?.absolute || metadata.title?.default || ''

  // Normalize legacy or pre-formatted titles so the layout template can apply
  // a consistent "<heading> | Tiles Book" browser tab format.
  if (pageTitle.startsWith('Tiles Book: ')) {
    pageTitle = pageTitle.replace(/^Tiles Book: /, '')
  }
  if (pageTitle.endsWith(' | Tiles Book')) {
    pageTitle = pageTitle.replace(/\s\|\sTiles Book$/, '')
  }

  // Match blog post title structure: "<heading> | Tiles Book"
  const ogTitle = pageTitle ? `${pageTitle} | Tiles Book` : 'Tiles Book'
  const defaultSocialImage = getSocialImage(pageTitle || 'Tiles Book')
  const socialImage =
    params.mdxPath.length === 1 && params.mdxPath[0] === 'finances'
      ? { ...defaultSocialImage, url: '/api/og/finances' }
      : defaultSocialImage

  // Return the cleaned title so the layout template appends " | Tiles Book".
  // Use absolute title when empty to avoid an empty heading title.
  return {
    ...metadata,
    title: pageTitle ? pageTitle : { absolute: 'Tiles Book' },
    openGraph: {
      ...metadata.openGraph,
      title: ogTitle,
      images: [{ ...socialImage, alt: ogTitle }],
    },
    twitter: {
      ...metadata.twitter,
      title: ogTitle,
      images: [socialImage.url],
    },
  }
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: {
  params: Promise<{ mdxPath: string[] }>
}) {
  const params = await props.params
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath
  )

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
      <BookPageNavigation />
    </Wrapper>
  )
}
