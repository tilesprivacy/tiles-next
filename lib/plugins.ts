export interface TilesPlugin {
  slug: string
  name: string
  description: string
  fileName: string
  downloadUrl: string
  installCommand: string
  sizeLabel?: string
  updatedAt?: string
}

export interface TilesPluginSkill {
  name: string
  description: string
  sourceUrl: string
}

const PLUGIN_BASE_URL = "https://download.tiles.run/plugins"
const PLUGIN_PREFIX = "plugins/"
const PLUGIN_SOURCE_BASE_URL = "https://github.com/tilesprivacy/plugins/tree/main"
const PLUGIN_SOURCE_BLOB_BASE_URL = "https://github.com/tilesprivacy/plugins/blob/main"
const PLUGIN_RAW_BASE_URL = "https://raw.githubusercontent.com/tilesprivacy/plugins/main"
const FALLBACK_PLUGIN_FILES = ["caldir.zip", "youtube-transcript.zip"]

function titleFromFileName(fileName: string) {
  if (fileName === "caldir.zip") {
    return "Caldir"
  }

  if (fileName === "youtube-transcript.zip") {
    return "YouTube Transcript"
  }

  return fileName
    .replace(/\.zip$/i, "")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function descriptionFromFileName(fileName: string) {
  if (fileName === "caldir.zip") {
    return "Caldir is a tool for storing your calendar as a directory of ICS files."
  }

  if (fileName === "youtube-transcript.zip") {
    return "Fetch transcripts from YouTube videos for summarization and analysis."
  }

  return "Install this plugin into Tiles from the public plugin archive."
}

function formatBytes(bytes: number | undefined) {
  if (!bytes || Number.isNaN(bytes)) {
    return undefined
  }

  const units = ["B", "KB", "MB", "GB"]
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`
}

function normalizePlugin(fileName: string, metadata: Partial<TilesPlugin> = {}): TilesPlugin {
  const cleanFileName = fileName.split("/").pop() ?? fileName
  const downloadUrl = `${PLUGIN_BASE_URL}/${cleanFileName}`

  return {
    slug: cleanFileName.replace(/\.zip$/i, ""),
    name: metadata.name ?? titleFromFileName(cleanFileName),
    description: metadata.description ?? descriptionFromFileName(cleanFileName),
    fileName: cleanFileName,
    downloadUrl,
    installCommand: `tiles plugin install ${downloadUrl}`,
    sizeLabel: metadata.sizeLabel,
    updatedAt: metadata.updatedAt,
  }
}

function uniqueZipFiles(keys: string[]) {
  return Array.from(
    new Set(
      keys
        .map((key) => key.trim())
        .filter((key) => key.toLowerCase().endsWith(".zip"))
        .map((key) => key.split("/").pop())
        .filter((fileName): fileName is string => Boolean(fileName)),
    ),
  ).sort((a, b) => a.localeCompare(b))
}

async function listFromCloudflareApi() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const bucket = process.env.CLOUDFLARE_R2_BUCKET ?? process.env.TILES_R2_BUCKET ?? "tilesprivacy"

  if (!accountId || !apiToken) {
    return []
  }

  const url = new URL(`https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/objects`)
  url.searchParams.set("prefix", PLUGIN_PREFIX)
  url.searchParams.set("per_page", "1000")

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    return []
  }

  const data = await response.json()
  const objects = Array.isArray(data?.result) ? data.result : []

  return objects
    .map((object: { key?: string; size?: number; uploaded?: string }) => {
      if (!object.key?.toLowerCase().endsWith(".zip")) {
        return null
      }

      return normalizePlugin(object.key, {
        sizeLabel: formatBytes(object.size),
        updatedAt: object.uploaded,
      })
    })
    .filter((plugin: TilesPlugin | null): plugin is TilesPlugin => Boolean(plugin))
}

async function listFromJsonIndex() {
  const manifestUrl = process.env.TILES_PLUGIN_INDEX_URL ?? `${PLUGIN_BASE_URL}/index.json`

  const response = await fetch(manifestUrl, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    return []
  }

  const data = await response.json()
  const entries = Array.isArray(data) ? data : Array.isArray(data?.plugins) ? data.plugins : []

  return entries
    .map((entry: Partial<TilesPlugin> & { file?: string }) => {
      const fileName = entry.fileName ?? entry.file
      if (!fileName?.toLowerCase().endsWith(".zip")) {
        return null
      }

      return normalizePlugin(fileName, entry)
    })
    .filter((plugin: TilesPlugin | null): plugin is TilesPlugin => Boolean(plugin))
}

async function listFromPublicPrefix() {
  const response = await fetch(`${PLUGIN_BASE_URL}/`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    return []
  }

  const body = await response.text()
  const matches = Array.from(body.matchAll(/href=["']([^"']+\.zip)["']/gi)).map((match) => match[1])

  return uniqueZipFiles(matches).map((fileName) => normalizePlugin(fileName))
}

async function withFallbackMetadata(plugin: TilesPlugin) {
  if (plugin.sizeLabel) {
    return plugin
  }

  try {
    const response = await fetch(plugin.downloadUrl, {
      method: "HEAD",
      next: { revalidate: 3600 },
    })
    const contentLength = response.headers.get("content-length")
    const sizeLabel = contentLength ? formatBytes(Number(contentLength)) : undefined

    return {
      ...plugin,
      sizeLabel,
    }
  } catch {
    return plugin
  }
}

export async function getTilesPlugins(): Promise<TilesPlugin[]> {
  const sources = [listFromJsonIndex, listFromCloudflareApi, listFromPublicPrefix]

  for (const listSource of sources) {
    try {
      const plugins = await listSource()
      if (plugins.length > 0) {
        return Promise.all(plugins.map(withFallbackMetadata))
      }
    } catch {
      // Continue to the next source so a missing optional integration never breaks the page.
    }
  }

  return Promise.all(FALLBACK_PLUGIN_FILES.map((fileName) => normalizePlugin(fileName)).map(withFallbackMetadata))
}

export async function getTilesPlugin(slug: string): Promise<TilesPlugin | null> {
  const plugins = await getTilesPlugins()

  return plugins.find((plugin) => plugin.slug === slug) ?? null
}

function parseFrontmatterValue(markdown: string, key: string) {
  const match = markdown.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))
  return match?.[1]?.trim().replace(/^["']|["']$/g, "")
}

function fallbackSkills(slug: string): TilesPluginSkill[] {
  if (slug === "caldir") {
    return [
      {
        name: "Caldir",
        description: "Caldir is a tool for storing your calendar as a directory of ICS files.",
        sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/caldir/skills/caldir/SKILL.md`,
      },
    ]
  }

  if (slug !== "youtube-transcript") return []

  return [
    {
      name: "youtube-transcript",
      description: "",
      sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/${slug}/skills/youtube-transcript/SKILL.md`,
    },
  ]
}

async function readSkill(slug: string, skillName: string): Promise<TilesPluginSkill> {
  const sourceUrl = `${PLUGIN_SOURCE_BLOB_BASE_URL}/${slug}/skills/${skillName}/SKILL.md`
  const markdownUrl = `${PLUGIN_RAW_BASE_URL}/${slug}/skills/${skillName}/SKILL.md`

  const response = await fetch(markdownUrl, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    return {
      name: skillName,
      description: "Skill details are available in the plugin source.",
      sourceUrl,
    }
  }

  const markdown = await response.text()

  return {
    name: parseFrontmatterValue(markdown, "name") ?? skillName,
    description:
      slug === "youtube-transcript" && skillName === "youtube-transcript"
        ? ""
        : parseFrontmatterValue(markdown, "description") ?? "Skill details are available in the plugin source.",
    sourceUrl,
  }
}

export async function getTilesPluginSkills(slug: string): Promise<TilesPluginSkill[]> {
  const skillsUrl = `https://api.github.com/repos/tilesprivacy/plugins/contents/${slug}/skills?ref=main`

  try {
    const response = await fetch(skillsUrl, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return fallbackSkills(slug)
    }

    const entries = await response.json()
    const skillNames = Array.isArray(entries)
      ? entries
          .filter((entry: { type?: string; name?: string }) => entry.type === "dir" && entry.name)
          .map((entry: { name: string }) => entry.name)
      : []

    if (skillNames.length === 0) {
      return fallbackSkills(slug)
    }

    return Promise.all(skillNames.map((skillName) => readSkill(slug, skillName)))
  } catch {
    return fallbackSkills(slug)
  }
}
