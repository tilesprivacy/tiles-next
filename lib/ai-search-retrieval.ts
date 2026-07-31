// Lightweight lexical retrieval over the llms-full corpus so AI search only
// sends the sections relevant to a query to the model, instead of the whole
// site dump (~30k+ tokens per request).

export interface CorpusSection {
  heading: string
  text: string
}

const SECTION_DIVIDER = /^={80}$/m

// Character budget for the context included in the system prompt.
// ~24k chars is roughly 6k tokens, versus 100k+ chars for the full corpus.
const DEFAULT_MAX_CONTEXT_CHARS = 24_000

// Sections used when a query matches nothing (or matches too little), so the
// model always has the core site facts to answer or redirect from.
const FALLBACK_HEADING_PREFIXES = [
  'Homepage',
  'Download',
  'Help',
  'Plugins',
  'Blog Index',
]

// Small, always-included section that lists every page URL, so the model can
// cite the closest relevant page even when its section wasn't selected.
const ALWAYS_INCLUDE_HEADING_PREFIXES = ['Additional URLs']

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'do',
  'does', 'for', 'from', 'has', 'have', 'how', 'i', 'if', 'in', 'is',
  'it', 'its', 'me', 'my', 'of', 'on', 'or', 'that', 'the', 'their',
  'there', 'this', 'to', 'was', 'what', 'when', 'where', 'which', 'who',
  'why', 'will', 'with', 'you', 'your',
  // Terms that appear in nearly every section and carry no signal here.
  'tiles', 'tile',
])

export function splitCorpusIntoSections(corpus: string): CorpusSection[] {
  return corpus
    .split(SECTION_DIVIDER)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const headingMatch = chunk.match(/^##\s+(.+)$/m)
      return {
        heading: headingMatch?.[1]?.trim() ?? '',
        text: chunk,
      }
    })
    // Drop the preamble (generated timestamp, canonical file notes) — it has
    // no heading and nothing useful for answering questions.
    .filter((section) => section.heading.length > 0)
}

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token))
}

function countPrefixMatches(haystackTokens: string[], term: string): number {
  // Prefix matching doubles as cheap stemming: "install" also matches
  // "installer" and "installing".
  let count = 0
  for (const token of haystackTokens) {
    if (token === term || (term.length >= 3 && token.startsWith(term))) {
      count++
    }
  }
  return count
}

function matchesPrefixes(heading: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => heading.startsWith(prefix))
}

export function selectRelevantSections(
  sections: CorpusSection[],
  query: string,
  maxContextChars: number = DEFAULT_MAX_CONTEXT_CHARS,
): CorpusSection[] {
  const queryTerms = Array.from(new Set(tokenize(query)))

  const tokenized = sections.map((section) => ({
    section,
    headingTokens: tokenize(section.heading),
    bodyTokens: tokenize(section.text),
  }))

  const totalSections = tokenized.length
  const averageLength =
    tokenized.reduce((sum, entry) => sum + entry.bodyTokens.length, 0) /
      totalSections || 1

  const scored = tokenized.map((entry) => {
    let score = 0
    for (const term of queryTerms) {
      const bodyCount = countPrefixMatches(entry.bodyTokens, term)
      const headingCount = countPrefixMatches(entry.headingTokens, term)
      if (bodyCount === 0 && headingCount === 0) continue

      const documentFrequency = tokenized.filter(
        (other) => countPrefixMatches(other.bodyTokens, term) > 0,
      ).length
      const idf = Math.log(
        1 + (totalSections - documentFrequency + 0.5) / (documentFrequency + 0.5),
      )

      // BM25-style saturation with length normalization, plus a heading boost.
      const tf = bodyCount + headingCount * 3
      const lengthNorm =
        0.25 + 0.75 * (entry.bodyTokens.length / averageLength)
      score += idf * ((tf * 2.2) / (tf + 1.2 * lengthNorm))
    }
    return { section: entry.section, score }
  })

  const ranked = scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const selected: CorpusSection[] = []
  const selectedHeadings = new Set<string>()
  let usedChars = 0

  const tryAdd = (section: CorpusSection): void => {
    if (selectedHeadings.has(section.heading)) return
    if (selected.length > 0 && usedChars + section.text.length > maxContextChars) {
      return
    }
    selected.push(section)
    selectedHeadings.add(section.heading)
    usedChars += section.text.length
  }

  for (const entry of ranked) {
    tryAdd(entry.section)
  }

  // If the query matched little or nothing, fill with the core site sections
  // so the model can still answer common questions or point somewhere useful.
  if (selected.length < 3) {
    for (const section of sections) {
      if (matchesPrefixes(section.heading, FALLBACK_HEADING_PREFIXES)) {
        tryAdd(section)
      }
    }
  }

  for (const section of sections) {
    if (matchesPrefixes(section.heading, ALWAYS_INCLUDE_HEADING_PREFIXES)) {
      if (!selectedHeadings.has(section.heading)) {
        selected.push(section)
        selectedHeadings.add(section.heading)
      }
    }
  }

  return selected
}
