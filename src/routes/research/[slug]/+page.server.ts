import { error } from "@sveltejs/kit"
import { buildToc } from "#lib/book-toc"
import { getResearchLogEntryById, getResearchLogEntryIds } from "#lib/research-log"
import type { TocItem } from "#lib/toc"
import type { EntryGenerator, PageServerLoad } from "./$types"

const sources = import.meta.glob("/content/research/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

export const entries: EntryGenerator = () => getResearchLogEntryIds().map((slug) => ({ slug }))

export const load: PageServerLoad = ({ params }) => {
  const entry = getResearchLogEntryById(params.slug)
  if (!entry) error(404, "Not found")

  const markdown = entry.mdxSlug ? sources[`/content/research/${entry.mdxSlug}.md`] : undefined
  const toc: TocItem[] = markdown
    ? buildToc(markdown)
        .filter((item) => item.depth >= 2 && item.depth <= 4)
        .map((item) => ({ id: item.id, text: item.text, level: item.depth as TocItem["level"] }))
    : []
  return { entry, toc }
}
