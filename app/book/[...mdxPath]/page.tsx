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

  // Nextra excludes H1s and treats depth 2 as a root TOC entry. Tilekit
  // has two H1 sections below its page title, so include those roots and
  // indent the generated H2/H3 entries beneath them. Keep other books as-is.
  const isTilekit = params.mdxPath.length === 1 && params.mdxPath[0] === 'tilekit'
  const sectionStarts = {
    server: { id: 'rest-api', value: 'REST API', depth: 2 },
    'quick-start': { id: 'modelfile-reference', value: 'Modelfile Reference', depth: 2 },
  } satisfies Record<string, (typeof toc)[number]>
  const pageToc = isTilekit
    ? toc.flatMap((entry) => {
        const section = sectionStarts[entry.id as keyof typeof sectionStarts]
        const nestedEntry: (typeof toc)[number] = {
          ...entry,
          depth: entry.depth === 2 ? 3 : entry.depth === 3 ? 4 : entry.depth === 4 ? 5 : 6,
        }
        return section ? [section, nestedEntry] : [nestedEntry]
      })
    : toc

  return (
    <Wrapper toc={pageToc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
      <BookPageNavigation />
    </Wrapper>
  )
}
