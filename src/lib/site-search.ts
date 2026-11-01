// Full-text site search over the Pagefind index that `npm run build` (or
// `npm run search:index` for dev) writes to /_pagefind/.

interface PagefindSubResult {
  url: string
  excerpt: string
}

interface PagefindResultData {
  url: string
  excerpt: string
  meta?: { title?: string }
  sub_results?: PagefindSubResult[]
}

interface Pagefind {
  options: (options: { baseUrl: string }) => Promise<void>
  debouncedSearch: (query: string) => Promise<{ results: { data: () => Promise<PagefindResultData> }[] } | null>
}

export interface SearchHit {
  id: string
  url: string
  title: string
  /** Pagefind's excerpt, reduced to text plus <mark> highlights. */
  excerpt: string
}

const PAGEFIND_URL = "/_pagefind/pagefind.js"
const MAX_HITS = 6

let pagefindPromise: Promise<Pagefind | null> | null = null

function loadPagefind(): Promise<Pagefind | null> {
  pagefindPromise ??= (async () => {
    try {
      const pagefind = (await import(/* @vite-ignore */ PAGEFIND_URL)) as Pagefind
      await pagefind.options({ baseUrl: "/" })
      return pagefind
    } catch {
      return null
    }
  })()
  return pagefindPromise
}

// Pagefind indexes the prerendered files, so `/book/manual.html#x` is really `/book/manual#x`.
function normalizeUrl(rawUrl: string): string {
  const url = rawUrl.replace(/\.html(#|$)/, "$1")
  return url.startsWith("/") ? url : `/${url}`
}

// The anchored section that matches hardest, so a click lands on it instead of the top of the page.
function pickAnchoredSubResult(item: PagefindResultData): PagefindSubResult | null {
  const countMarks = (excerpt: string) => excerpt.split("<mark>").length - 1
  let best: PagefindSubResult | null = null
  for (const sub of item.sub_results ?? []) {
    if (!sub.url.includes("#")) continue
    if (!best || countMarks(sub.excerpt) > countMarks(best.excerpt)) best = sub
  }
  return best
}

/** Keeps bare <mark>/</mark> tags and entities; any other markup is escaped into text. */
export function sanitizeExcerpt(excerpt: string): string {
  return excerpt
    .split(/(<\/?mark>)/)
    .map((part) =>
      part === "<mark>" || part === "</mark>"
        ? part
        : part
            .replace(/&(?![a-zA-Z][a-zA-Z0-9]*;|#[0-9]+;|#x[0-9a-fA-F]+;)/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;"),
    )
    .join("")
}

/** Null when a newer query superseded this one; throws when there is no index (dev without `npm run search:index`). */
export async function searchSite(query: string): Promise<SearchHit[] | null> {
  const pagefind = await loadPagefind()
  if (!pagefind) throw new Error("Search index unavailable")
  const response = await pagefind.debouncedSearch(query)
  if (!response) return null
  const data = await Promise.all(response.results.slice(0, MAX_HITS).map((result) => result.data()))
  return data.map((item, index) => {
    const sub = pickAnchoredSubResult(item)
    return {
      id: `${index}-${item.url}`,
      url: normalizeUrl(sub?.url ?? item.url),
      title: item.meta?.title || item.url,
      excerpt: sanitizeExcerpt(sub?.excerpt || item.excerpt),
    }
  })
}
