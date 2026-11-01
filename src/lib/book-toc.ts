import GithubSlugger from "github-slugger"

// "On this page" entries, read from the page markdown at build time. Ids come
// from the same slugger rehype-slug uses, so they match the rendered headings.

export interface TocEntry {
  id: string
  /** Heading text as inline HTML: code spans kept, other markdown dropped. */
  html: string
  text: string
  depth: number
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function inlineToText(markdown: string) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/`([^`]*)`/g, "$1")
}

function inlineToHtml(markdown: string) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith("`") ? `<code>${escapeHtml(part.slice(1, -1))}</code>` : escapeHtml(part)))
    .join("")
}

/**
 * Markdown headings H2-H6 become entries. A page that adds section H1s as raw
 * HTML (`<h1 id="...">`) gets those as top-level entries, with every markdown
 * heading nested one level below them (Tilekit's REST API / Modelfile split).
 */
export function buildToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger()
  const entries: TocEntry[] = []
  let inFence = false
  let hasSections = false

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const section = /^<h1 id="([^"]+)">([^<]*)/.exec(line)
    if (section) {
      hasSections = true
      entries.push({ id: section[1], html: escapeHtml(section[2]), text: section[2], depth: 1 })
      continue
    }

    const heading = /^(#{2,6})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!heading) continue
    const text = inlineToText(heading[2])
    entries.push({
      id: slugger.slug(text),
      html: inlineToHtml(heading[2]),
      text,
      depth: heading[1].length,
    })
  }

  return entries.map((entry) => ({ ...entry, depth: hasSections ? entry.depth + 1 : entry.depth }))
}
