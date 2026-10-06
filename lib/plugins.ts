export interface TilesPlugin {
  slug: string
  name: string
  description: string
  fileName: string
  downloadUrl: string
  installCommand: string
  showCliInstall?: boolean
  builtIn?: boolean
  documentationUrl?: string
  requirements?: string
  sizeLabel?: string
  updatedAt?: string
}

export interface TilesPluginSkill {
  name: string
  description: string
  sourceUrl: string
}

export interface TilesPluginMetadataField {
  key: string
  value: string
  href?: string
}

export interface TilesPluginMetadata {
  fields: TilesPluginMetadataField[]
  sourceUrl: string
}

export interface TilesPluginMcpServer {
  name: string
  type: string
  endpoint?: string
  sourceUrl: string
}

const PLUGIN_BASE_URL = "https://download.tiles.run/plugins"
const PLUGIN_PREFIX = "plugins/"
const PLUGIN_SOURCE_BASE_URL = "https://github.com/tilesprivacy/plugins/tree/main"
const PLUGIN_SOURCE_BLOB_BASE_URL = "https://github.com/tilesprivacy/plugins/blob/main"
const PLUGIN_RAW_BASE_URL = "https://raw.githubusercontent.com/tilesprivacy/plugins/main"
const CLOUDFLARE_DOWNLOAD_URL = `${PLUGIN_BASE_URL}/cloudflare.zip`
const OBSIDIAN_DOWNLOAD_URL = `${PLUGIN_BASE_URL}/obsidian.zip`
const SOLSTONE_DOWNLOAD_URL = `${PLUGIN_BASE_URL}/solstone.zip`
const FALLBACK_PLUGIN_FILES = ["caldir.zip"]
const EXA_PLUGIN: TilesPlugin = {
  slug: "exa",
  name: "Exa",
  description: "Web search and content extraction powered by Exa AI",
  fileName: "exa.zip",
  downloadUrl: `${PLUGIN_BASE_URL}/exa.zip`,
  installCommand: `tiles plugin install ${PLUGIN_BASE_URL}/exa.zip`,
  showCliInstall: true,
  documentationUrl: "https://exa.ai/docs/reference/exa-mcp",
}
const CLOUDFLARE_PLUGIN: TilesPlugin = {
  slug: "cloudflare",
  name: "Cloudflare",
  description: "Manage Cloudflare resources and Workers projects with the Cloudflare CLI.",
  fileName: "cloudflare.zip",
  downloadUrl: CLOUDFLARE_DOWNLOAD_URL,
  installCommand: `tiles plugin install ${CLOUDFLARE_DOWNLOAD_URL}`,
  showCliInstall: true,
  documentationUrl: "https://developers.cloudflare.com/cf/",
  requirements: "Requires the Cloudflare CLI (cf) installed and authenticated with access to the Cloudflare account you want to manage. The CLI is currently in beta.",
}
const OBSIDIAN_PLUGIN: TilesPlugin = {
  slug: "obsidian",
  name: "Obsidian",
  description: "Search, read, and organize your Obsidian vault with the Obsidian CLI.",
  fileName: "obsidian.zip",
  downloadUrl: OBSIDIAN_DOWNLOAD_URL,
  installCommand: `tiles plugin install ${OBSIDIAN_DOWNLOAD_URL}`,
  showCliInstall: true,
  documentationUrl: "https://obsidian.md/cli",
  requirements: "Requires the Obsidian desktop app to be running, with the command line interface enabled and registered in your PATH.",
}
const SOLSTONE_PLUGIN: TilesPlugin = {
  slug: "solstone",
  name: "Solstone",
  description: "Search and read your journal",
  fileName: "solstone.zip",
  downloadUrl: SOLSTONE_DOWNLOAD_URL,
  installCommand: `tiles plugin install ${SOLSTONE_DOWNLOAD_URL}`,
  showCliInstall: true,
  documentationUrl: "https://github.com/solpbc/solstone-tiles#connect-tiles-to-your-journal",
  requirements: "Requires Solstone journal 2.0.24 or later and a Tiles build with plugin support, such as the canary channel, on the same computer. In your journal, open agents > connect an agent and create a pairing code, choosing on this computer if asked. Within 10 minutes, enter /mcp-auth solstone__journal in Tiles chat, then choose what to share and enter the code on the journal page that opens.",
}
const FALLBACK_PLUGIN_METADATA: Record<string, Record<string, unknown>> = {
  caldir: {
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    name: "caldir",
    version: "1.0.0",
    description: "Read, create, edit, and sync calendar events as plaintext .ics files",
    homepage: "https://caldir.org",
    keywords: ["calendar", "ics", "caldav"],
  },
  cloudflare: {
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    name: "cloudflare",
    version: "1.0.0",
    description: CLOUDFLARE_PLUGIN.description,
    homepage: "https://developers.cloudflare.com/cf/",
    author: { name: "Tiles Privacy", url: "https://tiles.run" },
    repository: "https://github.com/tilesprivacy/plugins",
    license: "MIT",
    keywords: ["cloudflare", "workers", "dns", "storage", "cli"],
  },
  exa: {
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    name: "exa",
    version: "1.0.0",
    description: "Web search and page fetch",
    homepage: "https://exa.ai",
    license: "MIT",
  },
  obsidian: {
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    name: "obsidian",
    version: "1.0.0",
    description: OBSIDIAN_PLUGIN.description,
    homepage: "https://obsidian.md/cli",
    author: { name: "Tiles Privacy", url: "https://tiles.run" },
    repository: "https://github.com/tilesprivacy/plugins",
    license: "MIT",
    keywords: ["obsidian", "notes", "knowledge-management", "cli"],
  },
  solstone: {
    $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
    name: "solstone",
    version: "0.1.1",
    description: "Search and read your journal from Tiles, on the computer where your journal lives.",
    homepage: "https://solstone.app",
    repository: "https://github.com/solpbc/solstone-tiles",
    license: "AGPL-3.0-only",
    author: { name: "sol pbc", url: "https://solpbc.org" },
    keywords: ["solstone", "journal", "memory", "mcp"],
  },
}
const FALLBACK_MCP_SERVERS: Record<string, Record<string, Record<string, unknown>>> = {
  exa: {
    search: {
      type: "streamable-http",
      url: "https://mcp.exa.ai/mcp",
    },
  },
  solstone: {
    journal: {
      type: "streamable-http",
      url: "http://127.0.0.1:7659/mcp",
    },
  },
}

function titleFromFileName(fileName: string) {
  if (fileName === "caldir.zip") {
    return "Caldir"
  }

  if (fileName === "exa.zip") {
    return "Exa"
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

  if (fileName === "exa.zip") {
    return EXA_PLUGIN.description
  }

  if (fileName === "cloudflare.zip") {
    return CLOUDFLARE_PLUGIN.description
  }

  if (fileName === "obsidian.zip") {
    return OBSIDIAN_PLUGIN.description
  }

  if (fileName === "solstone.zip") {
    return SOLSTONE_PLUGIN.description
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
    showCliInstall: cleanFileName === "caldir.zip",
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

function curatePlugins(plugins: TilesPlugin[]) {
  const downloadPlugins = [CLOUDFLARE_PLUGIN, OBSIDIAN_PLUGIN, SOLSTONE_PLUGIN]
  const downloadSlugs = new Set(downloadPlugins.map((plugin) => plugin.slug))
  const pluginsWithDownloads = [
    ...plugins.filter((plugin) => !downloadSlugs.has(plugin.slug)),
    ...downloadPlugins.map((plugin) => ({
      ...plugins.find((listedPlugin) => listedPlugin.slug === plugin.slug),
      ...plugin,
    })),
  ]

  return [
    EXA_PLUGIN,
    ...pluginsWithDownloads
      .filter((plugin) => plugin.slug !== "youtube-transcript" && plugin.slug !== EXA_PLUGIN.slug)
      .sort((a, b) => a.name.localeCompare(b.name)),
  ]
}

export async function getTilesPlugins(): Promise<TilesPlugin[]> {
  const sources = [listFromJsonIndex, listFromCloudflareApi, listFromPublicPrefix]

  for (const listSource of sources) {
    try {
      const plugins = await listSource()
      if (plugins.length > 0) {
        return curatePlugins(await Promise.all(plugins.map(withFallbackMetadata)))
      }
    } catch {
      // Continue to the next source so a missing optional integration never breaks the page.
    }
  }

  const plugins = await Promise.all(
    FALLBACK_PLUGIN_FILES.map((fileName) => normalizePlugin(fileName)).map(withFallbackMetadata),
  )
  return curatePlugins(plugins)
}

export async function getTilesPlugin(slug: string): Promise<TilesPlugin | null> {
  const plugins = await getTilesPlugins()

  return plugins.find((plugin) => plugin.slug === slug) ?? null
}

function parseFrontmatterValue(markdown: string, key: string) {
  const match = markdown.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))
  return match?.[1]?.trim().replace(/^["']|["']$/g, "")
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function metadataValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).join(", ")
  }

  if (isRecord(value)) {
    return JSON.stringify(value)
  }

  return String(value)
}

function metadataFromJson(slug: string, metadata: Record<string, unknown>): TilesPluginMetadata {
  return {
    fields: Object.entries(metadata).map(([key, value]) => {
      if (key === "author" && isRecord(value)) {
        const name = typeof value.name === "string" ? value.name.trim() : ""
        const email = typeof value.email === "string" ? value.email.trim() : ""
        let href: string | undefined

        if (typeof value.url === "string") {
          try {
            const url = new URL(value.url)
            if (url.protocol === "https:" || url.protocol === "http:") {
              href = url.href
            }
          } catch {
            // Keep the author readable when their website URL is invalid.
          }
        }

        return { key, value: name || email || href || "Unknown author", href }
      }

      return {
        key,
        value: metadataValue(value),
        href: typeof value === "string" && /^https?:\/\//i.test(value) ? value : undefined,
      }
    }),
    sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/${slug}/plugin.json`,
  }
}

export async function getTilesPluginMetadata(slug: string): Promise<TilesPluginMetadata | null> {
  const fallback = FALLBACK_PLUGIN_METADATA[slug]

  try {
    const response = await fetch(`${PLUGIN_RAW_BASE_URL}/${slug}/plugin.json`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return fallback ? metadataFromJson(slug, fallback) : null
    }

    const metadata: unknown = await response.json()
    return isRecord(metadata) ? metadataFromJson(slug, metadata) : fallback ? metadataFromJson(slug, fallback) : null
  } catch {
    return fallback ? metadataFromJson(slug, fallback) : null
  }
}

function mcpServersFromJson(slug: string, servers: Record<string, unknown>): TilesPluginMcpServer[] {
  return Object.entries(servers).flatMap(([name, value]) => {
    if (!isRecord(value)) {
      return []
    }

    const type = typeof value.type === "string" ? value.type : "MCP server"
    const url = typeof value.url === "string" ? value.url : undefined
    const command = typeof value.command === "string" ? value.command : undefined
    const args = Array.isArray(value.args) ? value.args.map(String).join(" ") : undefined

    return [{
      name,
      type,
      endpoint: url ?? ([command, args].filter(Boolean).join(" ") || undefined),
      sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/${slug}/mcp.json`,
    }]
  })
}

export async function getTilesPluginMcpServers(slug: string): Promise<TilesPluginMcpServer[]> {
  const fallback = FALLBACK_MCP_SERVERS[slug] ?? {}

  try {
    const response = await fetch(`${PLUGIN_RAW_BASE_URL}/${slug}/mcp.json`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return mcpServersFromJson(slug, fallback)
    }

    const manifest: unknown = await response.json()
    const servers = isRecord(manifest) && isRecord(manifest.mcpServers) ? manifest.mcpServers : fallback
    return mcpServersFromJson(slug, servers)
  } catch {
    return mcpServersFromJson(slug, fallback)
  }
}

function fallbackSkills(slug: string): TilesPluginSkill[] {
  if (slug === "solstone") {
    return [
      {
        name: "solstone-memory",
        description: "Answer questions about the owner's own past (what they said, heard or planned, and who someone is) from their journal. Use whenever a question is about the owner's life, conversations, people or plans.",
        sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/solstone/skills/solstone-memory/SKILL.md`,
      },
    ]
  }

  if (slug === "cloudflare") {
    return [
      {
        name: "cloudflare",
        description: "Manage Cloudflare resources and Workers projects with the cf CLI. Use for Cloudflare account, zone, DNS, storage, security, or Worker development and deployment tasks; discover current commands and schemas before acting.",
        sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/cloudflare/skills/cloudflare/SKILL.md`,
      },
    ]
  }

  if (slug === "obsidian") {
    return [
      {
        name: "obsidian",
        description: "Work with Obsidian notes, daily notes, tasks, properties, and links through the Obsidian CLI. Use when the user asks to search, read, create, or organize content in an Obsidian vault.",
        sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/obsidian/skills/obsidian/SKILL.md`,
      },
    ]
  }

  if (slug === "exa") {
    return [
      {
        name: "web-research",
        description: "Research a topic on the web across several sources, verify a claim, or dig past search snippets into full pages.",
        sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/exa/skills/web-research/SKILL.md`,
      },
    ]
  }

  if (slug === "caldir") {
    return [
      {
        name: "Caldir",
        description: "Caldir is a tool for storing your calendar as a directory of ICS files.",
        sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/caldir/skills/caldir/SKILL.md`,
      },
    ]
  }

  return []
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
    description: parseFrontmatterValue(markdown, "description") ?? "Skill details are available in the plugin source.",
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
