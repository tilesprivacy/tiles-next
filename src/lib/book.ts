// Book pages live in content/book/<slug>.md. This list is the single source of
// truth for their order: the sidebar, the mobile page list, prev/next links and
// the llms routes all read it.

export interface BookPage {
  /** "" for the book index at /book. */
  slug: string
  title: string
  href: string
}

export interface BookPageMeta extends BookPage {
  /** The page's H1. Usually the same as `title`. */
  heading: string
  description: string
  /** Shorter blurb for the chapter cards on /book. */
  cardDescription: string
  /** ISO timestamp shown as "Last updated on". */
  lastUpdated: string
  /** Hidden pages are reachable by URL but stay out of navigation. */
  hidden: boolean
}

const NAV_ORDER = ["", "overview", "manual", "models", "tilekit", "security", "community", "opensource", "finances"]
// Reachable by URL, kept out of the sidebar and page lists for now.
const HIDDEN = ["research", "resources", "licenses"]

const sources = import.meta.glob("/content/book/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function fileSlug(path: string) {
  const name = path.slice(path.lastIndexOf("/") + 1, -".md".length)
  return name === "index" ? "" : name
}

// Front matter here is flat `key: "value"` pairs, so a full YAML parser isn't needed.
function splitFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source)
  if (!match) return { data: {}, body: source }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z]\w*):\s*(.*)$/.exec(line)
    if (!pair) continue
    data[pair[1]] = pair[2].trim().replace(/^(["'])(.*)\1$/, "$2")
  }
  return { data, body: source.slice(match[0].length) }
}

const parsed = new Map(
  Object.entries(sources).map(([path, source]) => [fileSlug(path), splitFrontMatter(source)] as const),
)

function hrefFor(slug: string) {
  return slug ? `/book/${slug}` : "/book"
}

function metaFor(slug: string): BookPageMeta {
  const entry = parsed.get(slug)
  if (!entry) throw new Error(`Missing book page content/book/${slug || "index"}.md`)
  const { data } = entry
  return {
    slug,
    title: data.title,
    heading: data.heading || data.title,
    description: data.description ?? "",
    cardDescription: data.cardDescription ?? "",
    lastUpdated: data.lastUpdated ?? "",
    href: hrefFor(slug),
    hidden: HIDDEN.includes(slug),
  }
}

/** Every book page, navigation order first, then pages hidden from navigation. */
export const allBookPages: BookPageMeta[] = [...NAV_ORDER, ...HIDDEN].map(metaFor)

/** Pages shown in the book navigation, in order. */
export const bookPages: BookPage[] = allBookPages
  .filter((page) => !page.hidden)
  .map(({ slug, title, href }) => ({ slug, title, href }))

export function getBookPage(slug: string): BookPageMeta | undefined {
  const key = slug === "index" ? "" : slug
  return allBookPages.find((page) => page.slug === key)
}

export function getAdjacentBookPages(slug: string): { prev: BookPage | null; next: BookPage | null } {
  // Pages hidden from navigation get the index page's neighbours.
  const index = Math.max(0, bookPages.findIndex((page) => page.slug === slug))
  return {
    prev: bookPages[index - 1] ?? null,
    next: bookPages[index + 1] ?? null,
  }
}

/**
 * Markdown for a page without front matter, component imports or hidden
 * (commented-out) sections, with
 * the page heading restored as an H1 (the layout renders the heading itself).
 */
export function getBookPageMarkdown(slug: string): string {
  const key = slug === "index" ? "" : slug
  const entry = parsed.get(key)
  if (!entry) return ""
  const body = entry.body
    .replace(/^<script[\s\S]*?<\/script>\s*/, "")
    // Sections kept in the source but hidden from the page.
    .replace(/<!--[\s\S]*?-->\s*/g, "")
    .trim()
  return `# ${metaFor(key).heading}\n\n${body}\n`
}
