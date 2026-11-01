// A small reader for the YAML frontmatter our content files use: scalar
// `key: value` pairs (quoted or bare, booleans, numbers) and `- item` lists.
// The site and scripts/publish-blog.ts both use it, so stay inside that subset
// when adding fields. No imports: the publish script loads it under plain Node.

export type FrontmatterValue = string | number | boolean | string[]
export type Frontmatter = Record<string, FrontmatterValue>

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function parseScalar(raw: string): string | number | boolean {
  const value = raw.trim()
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    return value.slice(1, -1).replace(/\\(["\\])/g, "$1")
  }
  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
    return value.slice(1, -1).replace(/''/g, "'")
  }
  if (value === "true") return true
  if (value === "false") return false
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  return value
}

export function parseFrontmatter(source: string): { data: Frontmatter; body: string } {
  const match = source.match(FRONTMATTER_PATTERN)
  if (!match) return { data: {}, body: source }

  const data: Frontmatter = {}
  let listKey: string | null = null

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue

    const item = line.match(/^\s+-\s+(.*)$/) ?? line.match(/^-\s+(.*)$/)
    if (item && listKey) {
      ;(data[listKey] as string[]).push(String(parseScalar(item[1])))
      continue
    }

    const pair = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!pair) continue
    const [, key, rest] = pair
    if (rest.trim() === "") {
      data[key] = []
      listKey = key
    } else {
      data[key] = parseScalar(rest)
      listKey = null
    }
  }

  return { data, body: match[2] }
}

export function str(value: FrontmatterValue | undefined): string | undefined {
  if (value === undefined || value === "") return undefined
  return Array.isArray(value) ? value.join(", ") : String(value)
}

export function num(value: FrontmatterValue | undefined): number | undefined {
  if (value === undefined || value === "") return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export function list(value: FrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) return value
  return value === undefined || value === "" ? [] : [String(value)]
}
