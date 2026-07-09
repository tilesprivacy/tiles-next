import { fetchGithubJson } from "@/lib/github-json"
import { FALLBACK_DOWNLOAD_VERSION } from "@/lib/download-artifact"
import { normalizeReleaseVersion } from "@/lib/release-visibility"

export interface ChangeItem {
  text: string
  subItems?: Array<string | ChangeItem>
  codeBlock?: string
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
  "0.4.8": {
    name: "tiles-0.4.8-full-signed.pkg",
    url: "https://download.tiles.run/tiles-0.4.8-full-signed.pkg",
    sizeBytes: 11070278205,
    sha256: "63acf5ca1673ad4631bea42454a5ecc45d2efd6cc3863a0e8b0e8a0f90549d49",
  },
  "0.4.9": {
    name: "tiles-0.4.9-full-signed.pkg",
    url: "https://download.tiles.run/tiles-0.4.9-full-signed.pkg",
    sizeBytes: 11070278205,
    sha256: "fc2bbaf0408a3355d3079bf3435a2eba145c63bea48c35d3d14bb4a518a9a748",
  },
  "0.4.15": {
    name: "tiles-0.4.15-full-signed.pkg",
    url: "https://download.tiles.run/tiles-0.4.15-full-signed.pkg",
    sizeBytes: 11070278205,
    sha256: "25d27f6284c67a0818746ef118d57951bded5cb98819754b608eea56ecb",
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
  ],
  "0.4.12": [
    {
      title: "Added",
      changes: [
        {
          text: "Full Linux support, including llama.cpp inference, keychain management, and the network installer",
        },
      ],
    },
    {
      title: "Changed",
      changes: [
        {
          text: "Renamed `tiles server` to `tiles inference` with a `run-background <bool>` subcommand so inference can keep running after the REPL exits",
        },
        {
          text: "Extra tool-call metadata in session records for Tiles sessions hosted on an ATProto PDS",
        },
      ],
    },
  ],
  "0.4.13": [
    {
      title: "Added",
      changes: [
        {
          text: "`tiles run` flags for llama.cpp tuning: `--context-length`, `--gpu-layers`, `--offload-kqv`, and `--batch-size`",
        },
        {
          text: "Daemon `/config` endpoint so the Python inference backend can read Rust-owned Tiles config",
        },
      ],
    },
    {
      title: "Changed",
      changes: [
        {
          text: "Persist llama.cpp settings under `[llama]` in `config.toml` instead of `TILES_LLAMA_CPP_*` environment variables",
        },
        {
          text: "Reload the Linux llama.cpp runner when llama configuration changes, even if the selected model path stays the same",
        },
        {
          text: "Renamed inference controls to `tiles server` with `start`, `stop`, and `daemon` subcommands",
        },
        {
          text: "Switched Harmony handling to `tiles-harmony` across active server manifests",
        },
      ],
    },
    {
      title: "Fixed",
      changes: [
        {
          text: "gpt-oss tool call handling by normalizing malformed tool names and passing tool metadata into Harmony conversation replay",
        },
        {
          text: "Tool-call streaming state handling so final answers and function-call arguments are emitted more reliably",
        },
        {
          text: "Dev Modelfile handling so `cargo run -- run modelfiles/gpt-oss-gguf` no longer depends on a pre-existing copied default Modelfile",
        },
      ],
    },
  ],
  "0.4.14": [
    {
      title: "Added",
      changes: [
        {
          text: "Implemented Tiles plugin system",
          subItems: [
            {
              text: "`tiles plugin install <url / filesystem-path>`, `tiles plugin uninstall <plugin-name>`, `tiles plugin list` (for installed plugins)",
              subItems: [
                {
                  text: "Plugins should be a `.zip` or `.tar.gz` file either hosted or available in local filesystem",
                  codeBlock: `## Plugin folder structure

plugin_name
  - extensions
    - extension_1
      - ...
    - extension_2
      - ...
  - skills
    - skill_1
      - SKILLS.md`,
                },
                {
                  text: "Added skills support via plugins",
                  subItems: [
                    "In repl use `/skills` for list of skills and `$<skill-name>` to use the skill directly. Tiles can use available skills as needed too",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Changed",
      changes: [
        {
          text: "Upgraded project dependencies",
        },
      ],
    },
  ],
}

// Additional changes to append to existing changes (for supplements, not overrides)
const additionalSections: Record<string, ChangeSection[]> = {}

// Override release titles when GitHub release names are not user-facing labels
const customTitles: Record<string, string> = {
  "0.4.1": "Alpha 5",
}

// Versions where the last bullet point should be replaced
const replaceLastChange: Record<string, string> = {}

const normalizeVersion = normalizeReleaseVersion

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

const requiredVersions = Array.from(
  new Set([
    ...Object.keys(customSections),
    ...Object.keys(customTitles),
    ...Object.keys(additionalSections),
    ...Object.keys(replaceLastChange),
  ])
)

function isVisibleReleaseData(release: any): boolean {
  const normalizedVersion = normalizeVersion(String(release?.tag_name || ""))
  return normalizedVersion.length > 0
}

function compareVersionsDescending(a: string, b: string): number {
  const aParts = parseVersion(a)
  const bParts = parseVersion(b)

  for (let i = 0; i < 3; i++) {
    const aValue = aParts[i] ?? 0
    const bValue = bParts[i] ?? 0
    if (bValue !== aValue) {
      return bValue - aValue
    }
  }

  return 0
}

function buildOfflineReleases(): Release[] {
  const versions = Array.from(new Set(Object.keys(customSections))).sort(compareVersionsDescending)

  return versions.map((version) => {
    const normalizedVersion = normalizeVersion(version)

    return {
      version,
      date: "",
      title: customTitles[version] || customTitles[normalizedVersion] || version,
      sections: customSections[version] || customSections[normalizedVersion] || [],
      isPrerelease: false,
      githubUrl: `https://github.com/tilesprivacy/tiles/releases/tag/${version}`,
      tarballs: [],
      installer: undefined,
      fullInstaller: customFullInstallers[normalizedVersion],
    }
  })
}

export async function fetchReleases(): Promise<Release[]> {
  let data: any[]

  try {
    data = await fetchGithubJson<any[]>(
      "https://api.github.com/repos/tilesprivacy/tiles/releases",
      (releases) => releases.filter(isVisibleReleaseData)
    )
  } catch {
    return buildOfflineReleases()
  }

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
        try {
          return await fetchGithubJson<any>(
            `https://api.github.com/repos/tilesprivacy/tiles/releases/tags/${requiredVersion}`
          )
        } catch {
          return null
        }
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
    .filter((release: any) => {
      const normalizedVersion = normalizeVersion(String(release.tag_name || ""))
      return !release.prerelease && isVisibleReleaseData(release)
    })
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
        changes: section.changes.map((change) =>
          normalizeChangeItem(change, section.title)
        ),
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

export async function getLatestReleaseVersion(): Promise<string | null> {
  try {
    const releases = await fetchReleases()
    if (releases.length === 0) {
      return FALLBACK_DOWNLOAD_VERSION
    }

    return normalizeReleaseVersion(releases[0].version)
  } catch {
    return FALLBACK_DOWNLOAD_VERSION
  }
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
    .replace(/\s+by\s+@[\w-]+\b(?:\s+in\s+https?:\/\/[^\s]+)?/gi, "")
    .replace(/\s+(?:in|via|through|under)\s+#\d+\b/gi, "")
    .replace(/\s*\((?:#\d+(?:,\s*#\d+)*)\)/g, "")
    .replace(/(^|\s)#\d+\b(?:,\s*#\d+\b)*/g, "$1")
    .replace(/\s+in\s+https?:\/\/[^\s]+/gi, "")
    .replace(/\s+https?:\/\/github\.com\/[^\s]+\/pull\/\d+\b/gi, "")
    .replace(/\s+@[\w-]+\b/g, "")
  // Cleanup dangling trailing connectors left after stripping issue references.
    .replace(/\s+(?:in|via|through|under)\s*:?\s*$/gi, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeChangeItem(
  change: ChangeItem,
  sectionTitle?: string
): ChangeItem {
  const normalizedSubItems = change.subItems
    ?.map((sub) =>
      typeof sub === "string"
        ? { text: normalizeChangeText(sub, sectionTitle) }
        : normalizeChangeItem(sub, sectionTitle)
    )
    .filter((sub) => sub.text.length > 0 || sub.codeBlock)

  return {
    ...change,
    text: normalizeChangeText(change.text, sectionTitle),
    subItems:
      normalizedSubItems && normalizedSubItems.length > 0
        ? normalizedSubItems
        : undefined,
    codeBlock: change.codeBlock?.trim() || undefined,
  }
}

function normalizeChangeText(text: string, sectionTitle?: string): string {
  let normalized = sanitizeBulletText(text).replace(/\.$/, "").replace(/enoints/g, "endpoints")

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

  const lowercaseLeadingTerms = ["gpt-oss"] as const
  for (const term of lowercaseLeadingTerms) {
    if (text.toLowerCase().startsWith(term)) {
      return term + text.slice(term.length)
    }
  }

  const leadingCodeMatch = text.match(/^((?:`[^`]+`\s*)+)/)
  if (leadingCodeMatch) {
    return text
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
