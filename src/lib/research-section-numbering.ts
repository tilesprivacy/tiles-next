export type ResearchHeadingLevel = 2 | 3 | 4

function formatResearchExplorationSectionNumber(section: number): string {
  return `${section}.`
}

export interface ResearchSectionNumberState {
  section: number
  subsection: number
  subsubsection: number
}

export function createResearchSectionNumberState(): ResearchSectionNumberState {
  return { section: 0, subsection: 0, subsubsection: 0 }
}

export function nextResearchSectionNumber(
  state: ResearchSectionNumberState,
  level: ResearchHeadingLevel,
): string {
  if (level === 2) {
    state.section += 1
    state.subsection = 0
    state.subsubsection = 0
    return `${state.section}.`
  }

  if (level === 3) {
    state.subsection += 1
    state.subsubsection = 0
    return `${state.section}.${state.subsection}`
  }

  state.subsubsection += 1
  return `${state.section}.${state.subsection}.${state.subsubsection}`
}

export function formatResearchSectionLabel(sectionNumber: string, title: string): string {
  return `${sectionNumber} ${title}`
}

/** Keep subsection counters aligned when a heading already has a preset number. */
export function syncResearchSectionNumberState(
  state: ResearchSectionNumberState,
  sectionNumber: string,
  level: ResearchHeadingLevel,
): void {
  const parts = sectionNumber
    .replace(/\.$/, "")
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .filter((part) => !Number.isNaN(part))

  if (parts.length === 0) return

  state.section = parts[0]
  state.subsection = level >= 3 ? (parts[1] ?? 0) : 0
  state.subsubsection = level === 4 ? (parts[2] ?? 0) : 0
}

export function resolveResearchSectionNumber(
  state: ResearchSectionNumberState,
  level: ResearchHeadingLevel,
  options: {
    explorationNumber?: string | null
    presetSectionNumber?: string | null
  },
): string {
  const { explorationNumber, presetSectionNumber } = options

  if (level === 2 && explorationNumber) {
    const section = Number.parseInt(explorationNumber, 10)
    if (!Number.isNaN(section)) {
      state.section = section
      state.subsection = 0
      state.subsubsection = 0
      return formatResearchExplorationSectionNumber(section)
    }
  }

  if (presetSectionNumber) {
    syncResearchSectionNumberState(state, presetSectionNumber, level)
    return presetSectionNumber
  }

  return nextResearchSectionNumber(state, level)
}
