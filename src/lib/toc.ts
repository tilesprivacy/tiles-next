/** A heading listed in an article's table of contents. */
export interface TocItem {
  id: string
  text: string
  level: 2 | 3 | 4
}

/** Heading ids, the same slugs the table of contents has always linked to. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}
