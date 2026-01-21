export interface ChangeItem {
  text: string
  subItems?: string[]
}

export interface Release {
  version: string
  date: string
  title: string
  changes: ChangeItem[]
  isPrerelease: boolean
  githubUrl: string
  compareUrl?: string
}

// Custom changes to supplement or override GitHub release data
const customChanges: Record<string, ChangeItem[]> = {}

// Additional changes to append to existing changes (for supplements, not overrides)
const additionalChanges: Record<string, ChangeItem[]> = {}

// Versions where the last bullet point should be replaced
const replaceLastChange: Record<string, string> = {
  "0.3.0": "Basic refactoring for implementing multiple inference runtimes",
}

export async function fetchReleases(): Promise<Release[]> {
  const res = await fetch(
    "https://api.github.com/repos/tilesprivacy/tiles/releases",
    {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch releases")
  }

  const data = await res.json()

  return data
    .filter((release: any) => !release.prerelease)
    .map((release: any) => {
      const body = release.body || ""
      const changes = extractChanges(body)
      const version = release.tag_name

      // Use custom changes if available (overrides), otherwise use extracted changes
      let finalChanges = customChanges[version] || changes

      // Replace last bullet point if specified
      if (replaceLastChange[version] && finalChanges.length > 0) {
        finalChanges = [
          ...finalChanges.slice(0, -1),
          { text: replaceLastChange[version] },
        ]
      }

      // Append additional changes if specified (for supplements)
      if (additionalChanges[version]) {
        finalChanges = [...finalChanges, ...additionalChanges[version]]
      }

      // Remove trailing periods from all bullet points and sub-items
      finalChanges = finalChanges.map((change) => ({
        ...change,
        text: change.text.replace(/\.$/, ""),
        subItems: change.subItems?.map((sub) => sub.replace(/\.$/, "")),
      }))

      return {
        version,
        date: new Date(release.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        title: release.name || release.tag_name,
        changes: finalChanges,
        isPrerelease: release.prerelease,
        githubUrl: release.html_url,
        compareUrl: extractCompareUrl(body),
      }
    })
}

function extractChanges(body: string): ChangeItem[] {
  const changes: ChangeItem[] = []
  const lines = body.split("\n")
  let currentChange: ChangeItem | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    const indentLevel = line.length - line.trimStart().length

    // Check if it's a main bullet point (starts with *, -, or •)
    if (
      (trimmed.startsWith("- ") ||
        trimmed.startsWith("* ") ||
        trimmed.startsWith("• ")) &&
      indentLevel < 4
    ) {
      // Save previous change if exists
      if (currentChange) {
        changes.push(currentChange)
      }

      const change = trimmed
        .replace(/^[-*•]\s*/, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/by @\w+/g, "")
        .replace(/in https?:\/\/[^\s]+/g, "")
        .trim()

      if (change && !change.startsWith("@") && change.length > 5) {
        currentChange = { text: change }
      } else {
        currentChange = null
      }
    }
    // Check if it's a sub-bullet (indented and starts with -)
    else if (
      indentLevel >= 4 &&
      (trimmed.startsWith("- ") || trimmed.startsWith("* "))
    ) {
      if (currentChange) {
        const subItem = trimmed
          .replace(/^[-*•]\s*/, "")
          .trim()
        if (subItem && subItem.length > 0) {
          if (!currentChange.subItems) {
            currentChange.subItems = []
          }
          currentChange.subItems.push(subItem)
        }
      }
    }
  }

  // Add the last change if exists
  if (currentChange) {
    changes.push(currentChange)
  }

  return changes.slice(0, 6)
}

function extractCompareUrl(body: string): string | undefined {
  const match = body.match(
    /\[([^\]]+)\]\((https:\/\/github\.com\/[^/]+\/[^/]+\/compare\/[^)]+)\)/
  )
  return match?.[2]
}
