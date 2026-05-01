export interface ChangeItem {
  text: string
  subItems?: string[]
}

export interface ChangeSection {
  title: string
  changes: ChangeItem[]
}

export interface Release {
  version: string
  date: string
  title: string
  sections: ChangeSection[]
  isPrerelease: boolean
  githubUrl: string
  compareUrl?: string
  tarballs: ReleaseTarball[]
  installer?: ReleaseInstaller
  fullInstaller?: ReleaseInstaller
}

export interface ReleaseTarball {
  name: string
  url: string
  sizeBytes: number
  sha256: string
}

export interface ReleaseInstaller {
  name: string
  url: string
  sizeBytes: number
  sha256: string
}

const customFullInstallers: Record<string, ReleaseInstaller> = {
  "0.4.4": {
    name: "tiles-0.4.4-full-signed.pkg",
    url: "https://download.tiles.run/tiles-0.4.4-full-signed.pkg",
    // Source of truth is the checksum file; size is for display only.
    sizeBytes: 11070278205,
    sha256: "93943329953ddaa08de3c47e65532b5ffddeaf282839d7b95cf263ffeac2c5ab",
  },
  "0.4.5": {
    name: "tiles-0.4.5-full.pkg",
    url: "https://download.tiles.run/tiles-0.4.5-full.pkg",
    sizeBytes: 11070278205,
    sha256: "93943329953ddaa08de3c47e65532b5ffddeaf282839d7b95cf263ffeac2c5ab",
  },
  "0.4.7": {
    name: "tiles-0.4.7-full-signed.pkg",
    url: "https://download.tiles.run/tiles-0.4.7-full-signed.pkg",
    sizeBytes: 11070278205,
    sha256: "e2fa2d5339d356c023fb1c13fba8a6cf099fedad07f684b7b090d59292c91032",
  },
}

// Custom changes to supplement or override GitHub release data
const customSections: Record<string, ChangeSection[]> = {
  "0.3.0": [
    {
      title: "Fixed",
      changes: [
        {
          text: "Tiles binary startup issue when run from outside a project directory",
        },
        {
          text: "Model not unloading after exiting the REPL",
        },
        {
          text: "Updated Python version to 3.13 for development",
        },
        {
          text: "Enabled basic Linux compatibility",
        },
      ],
    },
    {
      title: "Changed",
      changes: [
        {
          text: "Basic refactoring for implementing multiple inference runtimes",
        },
      ],
    },
  ],
  "0.3.1": [
    {
      title: "Added",
      changes: [
        {
          text: "`--relay-count` / `-r` option for `tiles run` (helps if model gets stuck)",
        },
        {
          text: "CLI shows progress status while downloading models",
        },
        {
          text: "Slash commands and placeholder hint in the REPL",
        },
        {
          text: "Ability to set custom memory location via `tiles memory set-path`",
        },
      ],
    },
    {
      title: "Changed",
      changes: [
        {
          text: "Minor internal refactoring",
        },
      ],
    },
  ],
  "0.4.1": [
    {
      title: "Added",
      changes: [
        {
          text: "Identity system for Tiles",
          subItems: [
            "`tiles account` to show account details",
            "`tiles account create <nickname>` to create root identity and optional nickname",
            "`tiles account set-nickname` to set a nickname for root identity",
          ],
        },
        {
          text: "Updated CLI to include default `tiles` command",
        },
      ],
    },
  ],
  "0.4.0": [
    {
      title: "Added",
      changes: [
        {
          text: "Portable Python runtime in the installer (no system Python required)",
        },
        {
          text: "Bundled default Modelfiles and direct reading of system prompt from Modelfile",
        },
        {
          text: "Support for `gpt-oss-20b` in interactive chat",
        },
        {
          text: "Basic support for the Open Responses API (`/v1/responses`) and REST endpoints",
        },
        {
          text: "Token metrics for model responses in the REPL",
        },
        {
          text: "`-m` flag for `tiles run` to execute Tiles in memory mode (experimental)",
        },
        {
          text: "Tilekit 0.2.0: `optimize` subcommand for automatic system-prompt optimization via DSRs",
        },
      ],
    }
  ],
  "0.4.5": [
    {
      title: "Added",
      changes: [
        {
          text: "P2P device linking v1",
          subItems: [
            "Works on both online and offline networks",
            "`tiles link enable` creates a ticket and listens for link requests",
            "`tiles link enable <ticket>` joins with a ticket shared out-of-band",
            "`tiles link list-peers` shows linked device details, including DID and nickname",
            "`tiles link disable <DID>` unlinks a linked device",
          ],
        },
      ],
    },
    {
      title: "Fixed",
      changes: [
        {
          text: "Permission issues when updating Tiles with `tiles update` after moving the binary from `~/.local/` to `/usr/`",
        },
      ],
    },
  ],
  "0.4.6": [
    {
      title: "Added",
      changes: [
        {
          text: "P2P chat sync",
          subItems: [
            "`tiles sync` starts listening for a sync request from linked peers",
            "`tiles sync <DID>` initiates syncing with a linked peer by DID",
          ],
        },
        {
          text: "At rest encryption for local databases",
        },
      ],
    },
    {
      title: "Fixed",
      changes: [
        {
          text: "Loading issue in the qwen 3.5 series",
        },
      ],
    },
  ]
}

// Additional changes to append to existing changes (for supplements, not overrides)
const additionalSections: Record<string, ChangeSection[]> = {}

// Override release titles when GitHub release names are not user-facing labels
const customTitles: Record<string, string> = {
  "0.4.1": "Alpha 5",
}

// Versions where the last bullet point should be replaced
const replaceLastChange: Record<string, string> = {}

function normalizeVersion(version: string): string {
  return version.replace(/^v/, "")
}

function parseVersion(version: string): number[] {
  const [major = "0", minor = "0", patch = "0"] = normalizeVersion(version).split(".")
  return [Number(major) || 0, Number(minor) || 0, Number(patch) || 0]
}

function isVersionGte(version: string, minimum: string): boolean {
  const versionParts = parseVersion(version)
  const minimumParts = parseVersion(minimum)

  for (let i = 0; i < 3; i++) {
    const current = versionParts[i] ?? 0
    const min = minimumParts[i] ?? 0
    if (current > min) {
      return true
    }
    if (current < min) {
      return false
    }
  }

  return true
}

function buildBucketDownloadUrl(fileName: string): string {
  return `https://download.tiles.run/${fileName}`
}

function buildInstallerFileName(version: string): string {
  return `tiles-${normalizeVersion(version)}-signed.pkg`
}

function extractSha256Digest(asset: any): string {
  const digest = typeof asset?.digest === "string" ? asset.digest.trim() : ""
  if (!digest.toLowerCase().startsWith("sha256:")) {
    return "Unavailable"
  }

  const sha256 = digest.slice("sha256:".length).trim().toLowerCase()
  return /^[a-f0-9]{64}$/.test(sha256) ? sha256 : "Unavailable"
}

const githubHeaders = {
  Accept: "application/vnd.github+json",
}

const requiredVersions = Array.from(
  new Set([
    ...Object.keys(customSections),
    ...Object.keys(customTitles),
    ...Object.keys(additionalSections),
    ...Object.keys(replaceLastChange),
  ])
)

export async function fetchReleases(): Promise<Release[]> {
  const res = await fetch(
    "https://api.github.com/repos/tilesprivacy/tiles/releases",
    {
      cache: 'no-store',
      headers: githubHeaders,
    }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch releases")
  }

  let data = await res.json()

  const missingRequiredVersions = requiredVersions.filter(
    (requiredVersion) =>
      !data.some(
        (release: any) =>
          normalizeVersion(release.tag_name) === normalizeVersion(requiredVersion)
      )
  )

  if (missingRequiredVersions.length > 0) {
    const requiredReleases = await Promise.all(
      missingRequiredVersions.map(async (requiredVersion) => {
        const requiredRes = await fetch(
          `https://api.github.com/repos/tilesprivacy/tiles/releases/tags/${requiredVersion}`,
          {
            cache: "no-store",
            headers: githubHeaders,
          }
        )

        if (!requiredRes.ok) {
          return null
        }

        return requiredRes.json()
      })
    )

    data = [...requiredReleases.filter(Boolean), ...data]
  }

  const uniqueByVersion = new Map<string, any>()
  for (const release of data) {
    const normalized = normalizeVersion(release.tag_name)
    if (!uniqueByVersion.has(normalized)) {
      uniqueByVersion.set(normalized, release)
    }
  }

  const normalizedData = Array.from(uniqueByVersion.values()).sort(
    (a, b) =>
      new Date(b.published_at || b.created_at || 0).getTime() -
      new Date(a.published_at || a.created_at || 0).getTime()
  )

  return normalizedData
    .filter((release: any) => !release.prerelease)
    .map((release: any) => {
      const body = release.body || ""
      const extractedSections = extractSections(body)
      const version = release.tag_name
      const normalizedVersion = normalizeVersion(version)

      // Use custom sections if available (overrides), otherwise use extracted sections
      let finalSections =
        customSections[version] || customSections[normalizedVersion] || extractedSections

      // Replace last bullet point if specified
      if (
        (replaceLastChange[version] || replaceLastChange[normalizedVersion]) &&
        finalSections.length > 0
      ) {
        const replacement =
          replaceLastChange[version] || replaceLastChange[normalizedVersion]
        const sectionsCopy = finalSections.map((section) => ({
          ...section,
          changes: [...section.changes],
        }))

        for (let i = sectionsCopy.length - 1; i >= 0; i--) {
          const section = sectionsCopy[i]
          if (section.changes.length > 0) {
            section.changes = [
              ...section.changes.slice(0, -1),
              { text: replacement },
            ]
            break
          }
        }

        finalSections = sectionsCopy
      }

      // Append additional sections if specified (for supplements)
      if (additionalSections[version] || additionalSections[normalizedVersion]) {
        finalSections = mergeSections(
          finalSections,
          additionalSections[version] || additionalSections[normalizedVersion]
        )
      }

      // Remove trailing periods from all bullet points and sub-items
      // Also fix any typos
      finalSections = finalSections.map((section) => ({
        ...section,
        changes: section.changes.map((change) => ({
          ...change,
          text: normalizeChangeText(change.text, section.title),
          subItems: change.subItems?.map((sub) => normalizeChangeText(sub)),
        })),
      }))

      return {
        version,
        date: new Date(release.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        title:
          customTitles[version] ||
          customTitles[normalizedVersion] ||
          release.name ||
          release.tag_name,
        sections: finalSections,
        isPrerelease: release.prerelease,
        githubUrl: release.html_url,
        compareUrl: extractCompareUrl(body),
        tarballs: extractTarballs(release.assets),
        installer: extractInstaller(version, release.assets),
        fullInstaller: customFullInstallers[normalizedVersion],
      }
    })
}

function extractTarballs(assets: any[] | undefined): ReleaseTarball[] {
  if (!Array.isArray(assets)) {
    return []
  }

  return assets
    .filter((asset) => typeof asset?.name === "string" && asset.name.endsWith(".tar.gz"))
    .map((asset) => ({
      name: asset.name,
      url: buildBucketDownloadUrl(asset.name),
      sizeBytes: typeof asset.size === "number" ? asset.size : -1,
      sha256: extractSha256Digest(asset),
    }))
}

function extractInstaller(
  version: string,
  assets: any[] | undefined
): ReleaseInstaller | undefined {
  const normalizedVersion = normalizeVersion(version)
  if (!isVersionGte(normalizedVersion, "0.4.3")) {
    return undefined
  }

  const pkgAsset = Array.isArray(assets)
    ? assets.find(
        (asset) =>
          typeof asset?.name === "string" && asset.name.toLowerCase().endsWith(".pkg")
      )
    : undefined

  const fileName =
    typeof pkgAsset?.name === "string"
      ? pkgAsset.name
      : buildInstallerFileName(normalizedVersion)

  return {
    name: fileName,
    url: buildBucketDownloadUrl(fileName),
    sizeBytes: typeof pkgAsset?.size === "number" ? pkgAsset.size : -1,
    sha256: extractSha256Digest(pkgAsset),
  }
}

const KEEP_A_CHANGELOG_SECTION_ORDER = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
]

const SECTION_TITLE_ALIASES: Record<string, string> = {
  added: "Added",
  add: "Added",
  new: "Added",
  features: "Added",
  changed: "Changed",
  change: "Changed",
  changes: "Changed",
  enhancements: "Changed",
  improved: "Changed",
  improvements: "Changed",
  fixed: "Fixed",
  fixes: "Fixed",
  "bug fixes": "Fixed",
  bugfixes: "Fixed",
  deprecated: "Deprecated",
  removed: "Removed",
  security: "Security",
}

function extractSections(body: string): ChangeSection[] {
  const sections: ChangeSection[] = []
  const lines = body.split("\n")
  let currentSection: ChangeSection | null = null
  let currentChange: ChangeItem | null = null
  let currentMainIndent = 0

  const getOrCreateSection = (rawTitle: string) => {
    const title = normalizeSectionTitle(rawTitle)
    if (!title) {
      return null
    }

    const existing = sections.find((section) => section.title === title)
    if (existing) {
      return existing
    }

    const next = { title, changes: [] }
    sections.push(next)
    return next
  }

  const pushCurrentChange = () => {
    if (currentSection && currentChange) {
      currentSection.changes.push(currentChange)
    }
    currentChange = null
    currentMainIndent = 0
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const indentLevel = line.length - line.trimStart().length

    const sectionHeaderMatch = trimmed.match(/^#{2,6}\s+(.+)$/)
    if (sectionHeaderMatch) {
      pushCurrentChange()
      currentSection = getOrCreateSection(sectionHeaderMatch[1] || "")
      continue
    }

    const isBullet =
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ") ||
      trimmed.startsWith("• ")

    // Treat indented bullets as sub-bullets relative to the current main bullet.
    if (isBullet && currentChange && indentLevel > currentMainIndent) {
      const subItem = trimmed.replace(/^[-*•]\s*/, "").trim()
      if (subItem.length > 0) {
        if (!currentChange.subItems) {
          currentChange.subItems = []
        }
        currentChange.subItems.push(sanitizeBulletText(subItem))
      }
      continue
    }

    // Otherwise, treat as a main bullet point.
    if (isBullet) {
      pushCurrentChange()

      const rawBulletText = trimmed.replace(/^[-*•]\s*/, "")
      const change = sanitizeBulletText(rawBulletText)
      const targetSection =
        currentSection || getOrCreateSection(inferSectionTitle(change))

      if (change && !change.startsWith("@") && change.length > 5) {
        currentSection = targetSection
        currentChange = { text: change }
        currentMainIndent = indentLevel
      } else {
        currentChange = null
      }
    }
  }

  pushCurrentChange()
  return sortSections(
    sections.filter((section) => section.changes.length > 0)
  )
}

function normalizeSectionTitle(rawTitle: string): string | null {
  const title = rawTitle
    .replace(/:$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()

  return SECTION_TITLE_ALIASES[title] || null
}

function inferSectionTitle(changeText: string): string {
  const text = changeText.toLowerCase()

  if (/\b(fix|fixed|bug|issue|crash|error)\b/.test(text)) {
    return "Fixed"
  }
  if (/\b(add|added|new|introduc|support|enable)\b/.test(text)) {
    return "Added"
  }
  if (/\b(change|changed|update|updated|refactor|improv)\b/.test(text)) {
    return "Changed"
  }

  return "Changed"
}

function sanitizeBulletText(text: string): string {
  if (!text) {
    return ""
  }

  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+(?:in|via|through|under)\s+#\d+\b/gi, "")
    .replace(/\s*\((?:#\d+(?:,\s*#\d+)*)\)/g, "")
    .replace(/(^|\s)#\d+\b(?:,\s*#\d+\b)*/g, "$1")
    .replace(/\s+https?:\/\/github\.com\/[^\s]+\/pull\/\d+\b/gi, "")
    .replace(/\s+by\s+@\w+\s+in\s+https?:\/\/[^\s]+/gi, "")
    .replace(/\s+in\s+https?:\/\/[^\s]+/gi, "")
    // Cleanup dangling trailing connectors left after stripping issue references.
    .replace(/\s+(?:in|via|through|under)\s*:?\s*$/gi, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeChangeText(text: string, sectionTitle?: string): string {
  let normalized = text.replace(/\.$/, "").replace(/enoints/g, "endpoints")

  if (sectionTitle === "Added") {
    normalized = normalized.replace(/^Added\s+/i, "")
  } else if (sectionTitle === "Fixed") {
    normalized = normalized.replace(/^Fixed\s+/i, "")
  } else if (sectionTitle === "Changed") {
    normalized = normalized.replace(/^(?:Changed|Updated)\s+/i, "")
  } else if (sectionTitle === "Removed") {
    normalized = normalized.replace(/^Removed\s+/i, "")
  } else if (sectionTitle === "Deprecated") {
    normalized = normalized.replace(/^Deprecated\s+/i, "")
  } else if (sectionTitle === "Security") {
    normalized = normalized.replace(/^Security:\s*/i, "")
  }

  return capitalizeLeadingText(normalized.trim())
}

function capitalizeLeadingText(text: string): string {
  if (!text) {
    return text
  }

  const leadingCodeMatch = text.match(/^((?:`[^`]+`\s*)+)/)
  if (leadingCodeMatch) {
    const prefix = leadingCodeMatch[1] || ""
    const remainder = text.slice(prefix.length)
    return prefix + capitalizeFirstLetter(remainder)
  }

  return capitalizeFirstLetter(text)
}

function capitalizeFirstLetter(text: string): string {
  return text.replace(/^([^A-Za-z]*)([a-z])/, (_, prefix: string, letter: string) => {
    return `${prefix}${letter.toUpperCase()}`
  })
}

function sortSections(sections: ChangeSection[]): ChangeSection[] {
  return [...sections].sort((a, b) => {
    const indexA = KEEP_A_CHANGELOG_SECTION_ORDER.indexOf(a.title)
    const indexB = KEEP_A_CHANGELOG_SECTION_ORDER.indexOf(b.title)

    const normalizedA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA
    const normalizedB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB

    if (normalizedA !== normalizedB) {
      return normalizedA - normalizedB
    }
    return a.title.localeCompare(b.title)
  })
}

function mergeSections(
  baseSections: ChangeSection[],
  extraSections: ChangeSection[]
): ChangeSection[] {
  const merged = baseSections.map((section) => ({
    ...section,
    changes: [...section.changes],
  }))

  for (const section of extraSections) {
    const existing = merged.find((item) => item.title === section.title)
    if (existing) {
      existing.changes.push(...section.changes)
    } else {
      merged.push({
        ...section,
        changes: [...section.changes],
      })
    }
  }

  return sortSections(merged)
}

function extractCompareUrl(body: string): string | undefined {
  const match = body.match(
    /\[([^\]]+)\]\((https:\/\/github\.com\/[^/]+\/[^/]+\/compare\/[^)]+)\)/
  )
  return match?.[2]
}
