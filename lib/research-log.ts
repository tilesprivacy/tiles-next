/**
 * Append-only research log.
 *
 * Append new entries to the END of `RESEARCH_LOG_ENTRIES` only.
 * Within a status group, entries sort by `startedAt` (newest first).
 * Cite explorations by month (for example "May 2026") rather than a numeric index.
 */

export type ResearchExplorationBadge =
  | "napkin-sketch"
  | "experimental-prototype"
  | "wip"

export type ResearchLogEntryKind = "inline" | "mdx"

export type ResearchExplorationStatus = "active" | "archived"

export interface ResearchLogEntry {
  id: string
  title: string
  description: string
  status: ResearchExplorationStatus
  authorIds: string[]
  /** Month bucket for grouping (YYYY-MM). */
  logMonth: string
  /** ISO date (YYYY-MM-DD) for ordering within a month. */
  startedAt: string
  badge?: ResearchExplorationBadge
  period?: string
  kind: ResearchLogEntryKind
  /** Optional long-form copy for `kind: "inline"` article bodies (hero/listing use `description`). */
  body?: string
  /** Archived MDX slug under `content/_archived/`. */
  mdxSlug?: string
  coverImage?: string
  coverImageDark?: string
  coverAlt?: string
}

export interface ResearchLogMonthGroup {
  logMonth: string
  label: string
  monthId: string
  entries: ResearchLogEntry[]
}

export const RESEARCH_LOG_ENTRIES: readonly ResearchLogEntry[] = [
  {
    id: "memory-model-trained-with-online-rl",
    title: "Memory Model Trained with Online RL",
    description: "On-device memory model trained with online reinforcement learning.",
    status: "archived",
    authorIds: ["anandu-pavanan", "ankesh-bharti"],
    logMonth: "2026-03",
    startedAt: "2026-03-01",
    badge: "experimental-prototype",
    period: "January 2026 - March 2026",
    kind: "mdx",
    mdxSlug: "memory-online-rl",
    coverImage: "/og-image.jpg",
    coverAlt: "Memory Model Trained with Online RL",
  },
  {
    id: "inference-time-memory-module",
    title: "Inference Time Memory Module",
    description:
      "Simple inference-time memory module that treats memory management as a series of LLM calls and agent loops over a markdown-based file tree.",
    status: "active",
    authorIds: ["ankesh-bharti"],
    logMonth: "2026-05",
    startedAt: "2026-05-01",
    badge: "wip",
    period: "May 2026 - Present",
    kind: "mdx",
    mdxSlug: "memory-inference-time",
    coverImage: "/oamemory.png",
    coverAlt: "Inference-time memory module diagram",
  },
  {
    id: "local-models-meet-at-protocol",
    title: "Local models meet AT Protocol",
    description:
      "Experiments with ATProto Lexicon schema translation and generative UI for local AI assistants.",
    body:
      "We want to build AI around convenience first. Privacy alone is rarely something people actively buy, so the challenge is expanding the frontier of convenience without compromising user ownership. One area that feels promising is using schemas like ATProto Lexicons to power generative interfaces, where many interactions could potentially be reduced to a single typed request against a shared interface rather than coordinating across multiple bespoke APIs. Combined with local models reducing network latency, this creates the possibility of extremely fast generative interfaces that connect and operate across different applications. Rather than selling privacy itself, the goal is to make the most convenient experience also happen to preserve user agency by default.",
    status: "active",
    authorIds: ["anandu-pavanan", "ankesh-bharti"],
    logMonth: "2026-05",
    startedAt: "2026-05-16",
    badge: "wip",
    period: "May 2026 - Present",
    kind: "inline",
    coverImage: "/og-image.jpg",
    coverAlt: "Local models meet AT Protocol",
  },
  {
    id: "local-first-ai-agent-sandboxes",
    title: "Local-first agent sandboxes",
    description:
      "Agent collaboration with microVM-based sandboxes and DID/UCANs for secure, collaborative workflows.",
    status: "active",
    authorIds: ["anandu-pavanan", "ankesh-bharti"],
    logMonth: "2026-05",
    startedAt: "2026-05-21",
    badge: "wip",
    period: "May 2026 - Present",
    kind: "inline",
    coverImage: "/og-image.jpg",
    coverAlt: "Local-first agent sandboxes",
  },
  {
    id: "using-iroh-tunnels-to-access-local-agents-remotely",
    title: "Using Iroh Tunnels to access local agents remotely",
    description:
      "Safely exposing local services like inference and AI generated artifacts to the internet via Iroh tunnels and a lightweight edge proxy that bridges standard HTTP traffic with the QUIC network.",
    status: "active",
    authorIds: ["anandu-pavanan", "ankesh-bharti"],
    logMonth: "2026-05",
    startedAt: "2026-05-22",
    badge: "wip",
    period: "May 2026 - Present",
    kind: "inline",
    coverImage: "/og-image.jpg",
    coverAlt: "Using Iroh Tunnels to access local agents remotely",
  },
] as const

const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const researchDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function formatResearchLogMonthLabel(logMonth: string): string {
  const [year, month] = logMonth.split("-").map((part) => Number.parseInt(part, 10))
  if (!year || !month) return logMonth
  return monthLabelFormatter.format(new Date(Date.UTC(year, month - 1, 1)))
}

export function formatResearchStartedAtLabel(startedAt: string): string {
  const [year, month, day] = startedAt.split("-").map((part) => Number.parseInt(part, 10))
  if (!year || !month || !day) return startedAt
  return researchDateFormatter.format(new Date(Date.UTC(year, month - 1, day)))
}

const researchListingMonthYearFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

/** Short month + year for research listings (for example "Apr 2026"). */
export function formatResearchListingMonthYear(logMonth: string): string {
  const [year, month] = logMonth.split("-").map((part) => Number.parseInt(part, 10))
  if (!year || !month) return logMonth
  return researchListingMonthYearFormatter.format(new Date(Date.UTC(year, month - 1, 1)))
}

export function getResearchLogMonthId(logMonth: string): string {
  return `research-${logMonth}`
}

function sortEntriesNewestFirst(entries: readonly ResearchLogEntry[]): ResearchLogEntry[] {
  return [...entries].sort((a, b) => b.startedAt.localeCompare(a.startedAt))
}

export function getResearchEntriesByStatus(status: ResearchExplorationStatus): ResearchLogEntry[] {
  return sortEntriesNewestFirst(RESEARCH_LOG_ENTRIES.filter((entry) => entry.status === status))
}

export function getActiveResearchEntries(): ResearchLogEntry[] {
  return getResearchEntriesByStatus("active")
}

export function getArchivedResearchEntries(): ResearchLogEntry[] {
  return getResearchEntriesByStatus("archived")
}

export function getResearchLogEntryById(id: string): ResearchLogEntry | undefined {
  return RESEARCH_LOG_ENTRIES.find((entry) => entry.id === id)
}

export function getResearchLogEntryIds(): string[] {
  return RESEARCH_LOG_ENTRIES.map((entry) => entry.id)
}

export function getResearchLogMonthsForDisplay(): ResearchLogMonthGroup[] {
  const byMonth = new Map<string, ResearchLogEntry[]>()

  for (const entry of RESEARCH_LOG_ENTRIES) {
    const monthEntries = byMonth.get(entry.logMonth) ?? []
    monthEntries.push(entry)
    byMonth.set(entry.logMonth, monthEntries)
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([logMonth, entries]) => ({
      logMonth,
      label: formatResearchLogMonthLabel(logMonth),
      monthId: getResearchLogMonthId(logMonth),
      entries: sortEntriesNewestFirst(entries),
    }))
}

export function getResearchLogEntriesForDisplay(): ResearchLogEntry[] {
  return getResearchLogMonthsForDisplay().flatMap((month) => month.entries)
}
