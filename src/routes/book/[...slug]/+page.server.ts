import { error, redirect } from "@sveltejs/kit"
import { allBookPages, getBookPage, getBookPageMarkdown } from "#lib/book"
import { buildToc } from "#lib/book-toc"
import type { EntryGenerator, PageServerLoad } from "./$types"

export const entries: EntryGenerator = () => [
  ...allBookPages.map((page) => ({ slug: page.slug })),
  { slug: "index" },
]

export const load: PageServerLoad = ({ params }) => {
  if (params.slug === "index") redirect(308, "/book")
  const meta = getBookPage(params.slug)
  if (!meta) error(404, "Not found")
  const markdown = getBookPageMarkdown(meta.slug)
  return { meta, markdown, toc: buildToc(markdown) }
}
