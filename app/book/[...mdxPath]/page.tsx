import { generateStaticParamsFor, importPage } from 'nextra/pages'
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

  // Remove "Tiles Book: " prefix if it already exists (to prevent double prefixing)
  // This can happen if the metadata already includes the prefix
  if (pageTitle.startsWith('Tiles Book: ')) {
    pageTitle = pageTitle.replace(/^Tiles Book: /, '')
  }

  // Format Open Graph title as "Tiles Book: <page title>"
  const ogTitle = pageTitle ? `Tiles Book: ${pageTitle}` : 'Tiles Book'

  // Return the cleaned title (without prefix) so the layout template can add it
  // The layout template is 'Tiles Book: %s', so it will add the prefix automatically
  // Use absolute title to bypass template if pageTitle is empty (to avoid "Tiles Book: Tiles Book")
  return {
    ...metadata,
    title: pageTitle ? pageTitle : { absolute: 'Tiles Book' },
    openGraph: {
      ...metadata.openGraph,
      title: ogTitle,
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
      images: ['/api/og'],
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

