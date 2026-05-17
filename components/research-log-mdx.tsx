import { importPage } from "nextra/pages"
import { BookCodeHighlightFix } from "@/components/book-code-highlight-fix"
import { useMDXComponents as getMDXComponents } from "@/mdx-components"

export async function ResearchLogMdx({ slug }: { slug: string }) {
  const { default: MDXContent } = await importPage(["_archived", slug])
  const components = getMDXComponents({
    h1: () => null,
  })

  return (
    <>
      <BookCodeHighlightFix />
      <MDXContent components={components} />
    </>
  )
}
