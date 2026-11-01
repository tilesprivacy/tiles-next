import { getBookPageMarkdown } from '#lib/book'

export interface ResourceLink {
  title: string
  url: string
  /** Heading path within the resources page, e.g. "Motivations" or "Links / LLMs". */
  section: string
  /** Links marked with ✨ in the source list. */
  highlighted: boolean
}

const LINK_LINE = /^-\s*(✨\s*)?\[(.+)\]\((\S+)\)\s*$/

/**
 * Parses the curated link list out of the book's resources page so the llms
 * indexes can list every link's title and URL, not just the visible text.
 */
export function getResourceLinks(): ResourceLink[] {
  const raw = getBookPageMarkdown('resources')
  const links: ResourceLink[] = []
  let sectionPath: string[] = []

  for (const line of raw.split('\n')) {
    const trimmed = line.trim()

    const headingMatch = trimmed.match(/^(#{2,6})\s+(.+)$/)
    if (headingMatch) {
      const depth = headingMatch[1].length - 2
      sectionPath = [...sectionPath.slice(0, depth), headingMatch[2].trim()]
      continue
    }

    const linkMatch = trimmed.match(LINK_LINE)
    if (linkMatch) {
      links.push({
        title: linkMatch[2].trim(),
        url: linkMatch[3],
        section: sectionPath.join(' / '),
        highlighted: Boolean(linkMatch[1]),
      })
    }
  }

  return links
}
