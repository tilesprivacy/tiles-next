import foldManifest from "../../static/plugins/fold/plugin.json"
import foldMcpManifest from "../../static/plugins/fold/mcp.json"

// Also imported by scripts/og-images.ts under plain Node, so this module stays
// free of SvelteKit-only imports.

export interface TilesPlugin {
  slug: string
  name: string
  description: string
  fileName: string
  downloadUrl: string
  installCommand: string
  showCliInstall?: boolean
  documentationUrl?: string
  requirements?: string
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
const PLUGIN_SOURCE_BLOB_BASE_URL = "https://github.com/tilesprivacy/plugins/blob/main"
const PLUGIN_RAW_BASE_URL = "https://raw.githubusercontent.com/tilesprivacy/plugins"
// Pin published releases so cached metadata and skill lists advance with the ZIP.
const PLUGIN_SOURCE_REFS: Record<string, string> = {
  cloudflare: "93835d1d8867e22545ac1244ce8c8ee61d56bcec", // 1.2.1
}
const SKILL_DETAILS_FALLBACK = "Skill details are available in the plugin source."

function pluginSourceRef(slug: string) {
  return PLUGIN_SOURCE_REFS[slug] ?? "main"
}

function pluginRawUrl(slug: string, path: string) {
  return `${PLUGIN_RAW_BASE_URL}/${pluginSourceRef(slug)}/${slug}/${path}`
}

/** A plugin published as `<slug>.zip` in the public archive. */
function archivePlugin(slug: string, details: Omit<TilesPlugin, "slug" | "fileName" | "downloadUrl" | "installCommand">): TilesPlugin {
  const fileName = `${slug}.zip`
  const downloadUrl = `${PLUGIN_BASE_URL}/${fileName}`
  return { slug, fileName, downloadUrl, installCommand: `tiles plugin install ${downloadUrl}`, ...details }
}

const EXA_PLUGIN = archivePlugin("exa", {
  name: "Exa",
  description: "Web search and content extraction powered by Exa AI",
  showCliInstall: true,
  documentationUrl: "https://exa.ai/docs/reference/exa-mcp",
})
const CLOUDFLARE_PLUGIN = archivePlugin("cloudflare", {
  name: "Cloudflare",
  description: "Build with Cloudflare’s developer platform and share local inference remotely through Quick Tunnels",
  showCliInstall: true,
  documentationUrl: "https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/",
  requirements: "Requires cloudflared.",
})
const OBSIDIAN_PLUGIN = archivePlugin("obsidian", {
  name: "Obsidian",
  description: "Search, read, and organize your Obsidian vault with the Obsidian CLI",
  showCliInstall: true,
  documentationUrl: "https://obsidian.md/cli",
  requirements: "Requires the Obsidian desktop app to be running, with the command line interface enabled and registered in your PATH.",
})
const FOLD_PLUGIN = archivePlugin("fold", {
  name: "Fold",
  description: foldManifest.description,
  showCliInstall: true,
  documentationUrl: "https://fold.money/mcp",
  requirements: "Requires a Fold Plus annual or Believer plan. Enable MCP in Fold under Profile > Settings > Beta Playground, then connect your Fold account in Tiles.",
})
const SOLSTONE_PLUGIN = archivePlugin("solstone", {
  name: "Solstone",
  description: "Search and read your journal",
  showCliInstall: true,
  documentationUrl: "https://github.com/solpbc/solstone-tiles#connect-tiles-to-your-journal",
  requirements: "Requires Solstone journal 2.0.24 or later and a Tiles build with plugin support, such as the canary channel, on the same computer. In your journal, open agents > connect an agent and create a pairing code, choosing on this computer if asked. Within 10 minutes, enter /mcp-auth solstone__journal in Tiles chat, then choose what to share and enter the code on the journal page that opens.",
})
const CALDIR_PLUGIN = archivePlugin("caldir", {
  name: "Caldir",
  description: "Caldir is a tool for storing your calendar as a directory of ICS files",
  showCliInstall: true,
})

/** Always listed. The archive index, when it exists, can add more. */
const CURATED_PLUGINS = [EXA_PLUGIN, CALDIR_PLUGIN, CLOUDFLARE_PLUGIN, FOLD_PLUGIN, OBSIDIAN_PLUGIN, SOLSTONE_PLUGIN]
const HIDDEN_PLUGIN_SLUGS = new Set(["youtube-transcript"])

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
    version: "1.2.1",
    description: CLOUDFLARE_PLUGIN.description,
    homepage: "https://developers.cloudflare.com/cf/",
    author: { name: "Tiles Privacy", url: "https://tiles.run" },
    repository: "https://github.com/tilesprivacy/plugins",
    license: "MIT",
    keywords: ["cloudflare", "workers", "dns", "storage", "cli", "tunnel", "tiles", "inference"],
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

function titleFromSlug(slug: string) {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Plugins from the archive's `index.json`, if it publishes one. */
async function listArchivePlugins(): Promise<TilesPlugin[]> {
  try {
    const response = await fetch(`${PLUGIN_BASE_URL}/index.json`)
    if (!response.ok) return []

    const data: unknown = await response.json()
    const entries = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.plugins) ? data.plugins : []

    return entries.flatMap((entry: unknown) => {
      if (!isRecord(entry)) return []
      const fileName = typeof entry.fileName === "string" ? entry.fileName : entry.file
      if (typeof fileName !== "string" || !/^[a-z0-9-]+\.zip$/i.test(fileName.split("/").pop() ?? "")) return []

      const slug = (fileName.split("/").pop() ?? "").replace(/\.zip$/i, "")
      const description =
        typeof entry.description === "string" ? entry.description : "Install this plugin into Tiles from the public plugin archive"
      return [
        archivePlugin(slug, {
          name: typeof entry.name === "string" ? entry.name : titleFromSlug(slug),
          description: description.trim().replace(/\.+$/, ""),
        }),
      ]
    })
  } catch {
    // The index is optional; the curated list always renders.
    return []
  }
}

let pluginsPromise: Promise<TilesPlugin[]> | undefined

/** Exa first, then alphabetical. Memoized: every prerendered plugin page asks for the list. */
export function getTilesPlugins(): Promise<TilesPlugin[]> {
  pluginsPromise ??= listArchivePlugins().then((listed) => {
    const curatedSlugs = new Set(CURATED_PLUGINS.map((plugin) => plugin.slug))
    const extra = listed.filter((plugin) => !curatedSlugs.has(plugin.slug) && !HIDDEN_PLUGIN_SLUGS.has(plugin.slug))
    const [exa, ...rest] = CURATED_PLUGINS
    return [exa, ...[...rest, ...extra].sort((a, b) => a.name.localeCompare(b.name))]
  })
  return pluginsPromise
}

export async function getTilesPlugin(slug: string): Promise<TilesPlugin | null> {
  return (await getTilesPlugins()).find((plugin) => plugin.slug === slug) ?? null
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

/** Fetches a JSON file from the plugin's source, or null on any failure. */
async function fetchPluginJson(slug: string, path: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(pluginRawUrl(slug, path))
    if (!response.ok) return null
    const data: unknown = await response.json()
    return isRecord(data) ? data : null
  } catch {
    return null
  }
}

export async function getTilesPluginMetadata(slug: string): Promise<TilesPluginMetadata | null> {
  if (slug === "fold") {
    return { ...metadataFromJson(slug, foldManifest), sourceUrl: "/plugins/fold/plugin.json" }
  }

  const metadata = (await fetchPluginJson(slug, "plugin.json")) ?? FALLBACK_PLUGIN_METADATA[slug]
  return metadata ? metadataFromJson(slug, metadata) : null
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
  if (slug === "fold") {
    return mcpServersFromJson(slug, foldMcpManifest.mcpServers).map((server) => ({
      ...server,
      sourceUrl: "/plugins/fold/mcp.json",
    }))
  }

  const manifest = await fetchPluginJson(slug, "mcp.json")
  const servers = manifest && isRecord(manifest.mcpServers) ? manifest.mcpServers : FALLBACK_MCP_SERVERS[slug] ?? {}
  return mcpServersFromJson(slug, servers)
}

/** Shown when GitHub can't be reached (for example, rate limited during a build). */
const FALLBACK_SKILLS: Record<string, Array<{ name: string; description: string }>> = {
  solstone: [
    {
      name: "solstone-memory",
      description: "Answer questions about the owner's own past (what they said, heard or planned, and who someone is) from their journal. Use whenever a question is about the owner's life, conversations, people or plans.",
    },
  ],
  cloudflare: [
    {
      name: "cloudflare-cli",
      description: "Manage Cloudflare resources and Workers projects with the cf CLI, or share Tiles inference through account-free Cloudflare Quick Tunnels. Use for Cloudflare resource, deployment, and Tiles remote inference sharing tasks.",
    },
    {
      name: "tiles-remote-inference",
      description: "Share a local Tiles inference server with another device using account-free Cloudflare Quick Tunnels and a bundled non-streaming Responses API bridge. Use for temporary remote inference, client setup, troubleshooting, and teardown; named tunnels remain an option for streaming or authenticated hosting.",
    },
  ],
  obsidian: [
    {
      name: "obsidian",
      description: "Work with Obsidian notes, daily notes, tasks, properties, and links through the Obsidian CLI. Use when the user asks to search, read, create, or organize content in an Obsidian vault.",
    },
  ],
  exa: [
    {
      name: "web-research",
      description: "Research a topic on the web across several sources, verify a claim, or dig past search snippets into full pages.",
    },
  ],
  caldir: [
    {
      name: "caldir",
      description: "Caldir is a tool for storing your calendar as a directory of ICS files.",
    },
  ],
}

function fallbackSkills(slug: string): TilesPluginSkill[] {
  return (FALLBACK_SKILLS[slug] ?? []).map((skill) => ({
    ...skill,
    sourceUrl: `${PLUGIN_SOURCE_BLOB_BASE_URL}/${slug}/skills/${skill.name}/SKILL.md`,
  }))
}

async function readSkill(slug: string, skillName: string): Promise<TilesPluginSkill> {
  const sourceUrl = `${PLUGIN_SOURCE_BLOB_BASE_URL}/${slug}/skills/${skillName}/SKILL.md`
  const response = await fetch(pluginRawUrl(slug, `skills/${skillName}/SKILL.md`))
  const markdown = response.ok ? await response.text() : ""

  return {
    name: parseFrontmatterValue(markdown, "name") ?? skillName,
    description: parseFrontmatterValue(markdown, "description") ?? SKILL_DETAILS_FALLBACK,
    sourceUrl,
  }
}

export async function getTilesPluginSkills(slug: string): Promise<TilesPluginSkill[]> {
  if (slug === "fold") {
    return [{
      name: "fold",
      description: "Answer questions about the user's accounts, spending, recurring expenses, investments, credit, and net worth using their connected Fold MCP account. Use when the user asks to inspect or summarize their own financial data in Fold.",
      sourceUrl: "/plugins/fold/skills/fold/SKILL.md",
    }]
  }

  const skillsUrl = `https://api.github.com/repos/tilesprivacy/plugins/contents/${slug}/skills?ref=${pluginSourceRef(slug)}`

  try {
    const response = await fetch(skillsUrl, { headers: { Accept: "application/vnd.github+json", "User-Agent": "tiles.run" } })
    if (!response.ok) return fallbackSkills(slug)

    const entries: unknown = await response.json()
    const skillNames = Array.isArray(entries)
      ? entries.flatMap((entry: unknown) =>
          isRecord(entry) && entry.type === "dir" && typeof entry.name === "string" && entry.name ? [entry.name] : [],
        )
      : []

    if (skillNames.length === 0) return fallbackSkills(slug)

    return await Promise.all(skillNames.map((skillName) => readSkill(slug, skillName)))
  } catch {
    return fallbackSkills(slug)
  }
}
