import { SITE_ORIGIN } from "#lib/absolute-url"
import { getBlogPostMarkdown, getBlogPosts } from "#lib/server/blog"
import { allBookPages, getBookPageMarkdown } from "#lib/book"
import { getCanaryRelease } from "#lib/canary-release"
import { getLatestDownloadArtifact } from "#lib/download-artifact"
import {
  CANARY_RELEASE_DESCRIPTION,
  CANARY_RELEASE_URL,
  OFFLINE_INSTALLER,
  OFFLINE_MODEL_NAME,
} from "#lib/download-page-data"
import { SHOW_PRICING } from "#lib/feature-flags"
import {
  getIndiaFossGiveawayArchiveLines,
  INDIAFOSS_GIVEAWAY_ARCHIVE,
} from "#lib/indiafoss-giveaway-archive"
import * as copy from "#lib/llms-content"
import { ownYourAiBlogContent as indiaFoss2026TalkContent } from "#lib/own-your-ai-draft-talk"
import { ownYourAiTalkRecording } from "#lib/own-your-ai-talk"
import { getPersonById, people } from "#lib/people"
import { getTilesPlugins } from "#lib/plugins"
import { TILES_PRODUCT_DESCRIPTION } from "#lib/product-description"
import { getResourceLinks, type ResourceLink } from "#lib/resource-links"
import { sponsorPageTeamSentence } from "#lib/sponsor-page-people"

const BASE = SITE_ORIGIN

interface BookPageText {
  slug: string
  title: string
  description: string
  url: string
}

// Every book page, hidden ones included, sorted like the files on disk
// (index.md sits between finances.md and licenses.md).
const bookPagesByFile: BookPageText[] = allBookPages
  .map((page) => ({
    slug: page.slug,
    title: page.title,
    description: page.description || "Documentation page",
    url: `${BASE}${page.href}`,
  }))
  .sort((a, b) => (a.slug || "index").localeCompare(b.slug || "index"))

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function sanitizeMarkdown(markdown: string): string {
  return (
    markdown
      .replace(/^---[\s\S]*?---\n?/, "")
      // Hidden sections, and the page's own component code.
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/^import\s+.*$/gm, "")
      // Self-closing components (images, embeds) carry no text.
      .replace(/<[A-Z][A-Za-z]*(\s[^<>]*?)?\/>/g, "")
      // Keep code block contents (CLI commands); strip only the fences.
      .replace(/```[^\n]*\n([\s\S]*?)```/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n")
  )
}

/** A blog post's text on one line, as the HTML-based original produced. */
function blogPostText(markdown: string): string {
  return sanitizeMarkdown(markdown.replace(/(?<!!)\[([^\]]*)\]\([^)]*\)/g, "$1"))
    .replace(/^(?:#{1,6}|[-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const sponsorLines = (prefix: string) =>
  people.sponsorsActive.map(
    (person) => `${prefix}Current sponsor: ${person.name}${person.links[0] ? ` (${person.links[0]})` : ""}.`,
  )

function addSection(lines: string[], heading: string, items: string[]) {
  lines.push(`## ${heading}`, "", ...items, "")
}

export async function buildLlmsIndex(): Promise<string> {
  const plugins = await getTilesPlugins()
  const visibleBook = copy.LLMS_INDEX_BOOK_SLUGS.map((slug) =>
    bookPagesByFile.find((page) => page.slug === slug),
  ).filter((page): page is BookPageText => Boolean(page))

  const lines: string[] = []
  lines.push(`# Tiles Privacy Homepage: ${BASE}/`, "")
  lines.push("## Overview", "")
  lines.push(TILES_PRODUCT_DESCRIPTION, copy.MOZILLA_BACKING_LINE, "")
  lines.push(...copy.LLMS_INDEX_OVERVIEW, "")

  addSection(lines, "Primary Pages", [
    `- Homepage: ${BASE}/`,
    `- Download: ${BASE}/download`,
    `  ${copy.MACOS_DOWNLOAD_NOTE}`,
    `- Canary downloads and release notes: ${CANARY_RELEASE_URL}`,
    `  ${CANARY_RELEASE_DESCRIPTION}`,
    copy.LINUX_DOWNLOAD_NOTE,
    `- Book: ${BASE}/book`,
    `- Plugins: ${BASE}/plugins`,
    ...(SHOW_PRICING ? [`- Pricing: ${BASE}/pricing`] : []),
    `- Blog: ${BASE}/blog`,
    `- Releases: ${BASE}/releases`,
    `- Help: ${BASE}/help`,
    `- About: ${BASE}/about`,
    `- Tiles at India FOSS: ${BASE}/tiles-at-india-foss`,
  ])

  addSection(lines, "About", [
    `- About page: ${BASE}/about`,
    `- ${copy.ABOUT_PAGE_SUMMARY}`,
    ...copy.MOZILLA_COHORT_LINES,
    `- ${sponsorPageTeamSentence}`,
    ...sponsorLines("- "),
    `- ${copy.GITHUB_SPONSORS_LINE}`,
    `- ${copy.RECURRING_SPONSORSHIP_LINE}`,
  ])

  addSection(lines, "Documentation", [
    ...visibleBook.map((page) => `- ${page.title}: ${page.url} - ${page.description}`),
    `- ${INDIAFOSS_GIVEAWAY_ARCHIVE.sectionTitle} archive:`,
    ...getIndiaFossGiveawayArchiveLines(BASE).map((line) => `  - ${line}`),
  ])

  addSection(lines, "Plugins", [
    `- Plugin index: ${BASE}/plugins`,
    `- ${copy.PLUGIN_STANDARD_LINE}`,
    ...plugins.map((plugin) => `- ${plugin.name}: ${BASE}/plugins/${plugin.slug} - ${plugin.description}`),
  ])

  addSection(lines, "Blog", [
    `- Blog index: ${BASE}/blog`,
    ...(await getBlogPosts()).map((post) => `- ${post.title}: ${BASE}/blog/${post.slug} - ${post.description}`),
  ])

  addSection(lines, "Legal And Site Information", [
    `- Privacy: ${BASE}/privacy`,
    `- Terms: ${BASE}/terms`,
    `- Refund Policy: ${BASE}/refund-policy - ${copy.REFUND_POLICY_SUMMARY}`,
    `- Subprocessors: ${BASE}/sub-processors`,
    `- Press Kit: ${BASE}/press-kit - ${copy.PRESS_KIT_SUMMARY}`,
    `- Brand: ${BASE}/brand`,
    `- AI-readable website index: ${BASE}/llms.txt`,
  ])

  addSection(lines, "External Links", copy.EXTERNAL_LINKS)

  lines.push(`_Last updated: ${new Date().toISOString().slice(0, 10)}_`)
  return lines.join("\n")
}

function resourcesSection(links: ResourceLink[]): string[] {
  const bySection = new Map<string, ResourceLink[]>()
  for (const link of links) {
    const group = bySection.get(link.section)
    if (group) group.push(link)
    else bySection.set(link.section, [link])
  }

  const lines = [
    ...copy.RESOURCES_INTRO,
    `Total links: ${links.length}. Links marked as highlighted are team picks (shown with a sparkle on the page).`,
    "",
  ]
  for (const [section, sectionLinks] of bySection) {
    lines.push(`Category: ${section}`)
    for (const link of sectionLinks) {
      lines.push(`- ${link.title}${link.highlighted ? " (highlighted)" : ""}: ${link.url}`)
    }
    lines.push("")
  }
  return lines
}

function pushSection(lines: string[], heading: string, content: string[]) {
  lines.push(`## ${heading}`, "", ...content, "", "=".repeat(80), "")
}

export async function buildLlmsFull(): Promise<string> {
  const [networkArtifact, canaryRelease] = await Promise.all([
    getLatestDownloadArtifact(),
    getCanaryRelease(),
  ])
  const offlineChecksumUrl = `https://download.tiles.run/checksums/${OFFLINE_INSTALLER.fileName}.sha256`

  const lines: string[] = []
  lines.push("# llms-full.txt for Tiles Privacy", "")
  lines.push("Expanded full-text context for tiles.run, intended for larger context windows.")
  lines.push(`Source site: ${BASE}`)
  lines.push(`Generated: ${new Date().toISOString()}`, "")
  lines.push("Canonical index file: /llms.txt")
  lines.push("Also available at: /.well-known/llms-full.txt", "")
  lines.push("=".repeat(80), "")

  pushSection(lines, `Homepage (${BASE}/)`, [
    "Tiles",
    TILES_PRODUCT_DESCRIPTION,
    copy.MOZILLA_BACKING_LINE,
    ...copy.HOMEPAGE_FULL,
  ])

  pushSection(lines, `Download (${BASE}/download)`, [
    copy.MACOS_DOWNLOAD_NOTE,
    "Network installer for macOS:",
    networkArtifact.downloadUrl,
    `Version: ${networkArtifact.version}`,
    `Size: ${networkArtifact.binarySizeLabel}`,
    `SHA256: ${networkArtifact.sha256}`,
    "",
    `Offline installer for macOS (bundled model: ${OFFLINE_MODEL_NAME}):`,
    OFFLINE_INSTALLER.downloadUrl,
    `Size: ${OFFLINE_INSTALLER.binarySizeLabel}`,
    `SHA256: ${OFFLINE_INSTALLER.sha256}`,
    `SHA256 file: ${offlineChecksumUrl}`,
    "",
    `Canary downloads and release notes: ${CANARY_RELEASE_URL}`,
    CANARY_RELEASE_DESCRIPTION,
    copy.LINUX_DOWNLOAD_NOTE,
    ...(canaryRelease
      ? [
          ...canaryRelease.assets.map((asset) => `${asset.name}: ${asset.browser_download_url}`),
          canaryRelease.body || "",
        ]
      : []),
  ])

  pushSection(lines, `Plugins (${BASE}/plugins)`, copy.PLUGINS_FULL)
  pushSection(lines, `Mission (${BASE}/mission)`, copy.MISSION_FULL)
  pushSection(lines, `Help (${BASE}/help)`, copy.HELP_FULL)

  pushSection(lines, `Press Kit (${BASE}/press-kit)`, [
    ...copy.PRESS_KIT_INTRO,
    TILES_PRODUCT_DESCRIPTION,
    ...copy.PRESS_KIT_BODY,
    "",
    `Brand assets: ${BASE}/tiles-brand-assets.zip`,
    `Brand guidelines: ${BASE}/brand`,
    `Background talk: ${ownYourAiTalkRecording.watchUrl}`,
    `Adapted blog post: ${BASE}/blog/own-your-ai`,
    copy.PRESS_KIT_SCREENSHOTS,
  ])

  pushSection(lines, `About (${BASE}/about)`, [
    ...copy.ABOUT_FULL,
    ...sponsorLines(""),
    copy.GITHUB_SPONSORS_LINE,
    copy.RECURRING_SPONSORSHIP_LINE,
  ])

  pushSection(lines, `Tiles at India FOSS (${BASE}/tiles-at-india-foss)`, [
    ...copy.INDIA_FOSS_TALK_INTRO,
    stripHtml(indiaFoss2026TalkContent),
  ])

  const posts = await getBlogPosts()
  pushSection(lines, `Blog Index (${BASE}/blog)`, [
    ...copy.BLOG_INDEX_INTRO,
    `Published posts: ${posts.length}`,
  ])

  for (const post of posts) {
    const postLines = [`Published: ${post.date.toISOString().slice(0, 10)}`]
    const person = post.author ? getPersonById(post.author) : null
    if (person) {
      postLines.push(`Author: ${person.name}`)
      if (person.links[0]) postLines.push(`Author URL: ${person.links[0]}`)
    }
    postLines.push(`Description: ${post.description}`, "", "Content:")
    postLines.push(blogPostText(await getBlogPostMarkdown(post.slug)))
    pushSection(lines, `Blog Post: ${post.title} (${BASE}/blog/${post.slug})`, postLines)
  }

  // The resources page is listed below with its link URLs intact.
  for (const page of bookPagesByFile) {
    if (page.slug === "resources") continue
    const content = sanitizeMarkdown(getBookPageMarkdown(page.slug))
    if (content) pushSection(lines, `Book: ${page.title} (${page.url})`, [content])
  }

  pushSection(lines, `${INDIAFOSS_GIVEAWAY_ARCHIVE.sectionTitle} archive`, [
    ...getIndiaFossGiveawayArchiveLines(BASE),
    `Source page: ${BASE}/book/community#community-initiatives`,
  ])

  const resourceLinks = getResourceLinks()
  if (resourceLinks.length > 0) {
    pushSection(lines, `Book: Resources (${BASE}/book/resources)`, resourcesSection(resourceLinks))
  }

  pushSection(lines, "Additional URLs", [
    `- Privacy: ${BASE}/privacy`,
    `- Terms: ${BASE}/terms`,
    `- Refund Policy: ${BASE}/refund-policy - ${copy.REFUND_POLICY_SUMMARY}`,
    `- Research: ${BASE}/book/research`,
    `- About and sponsorship: ${BASE}/about`,
    `- Help: ${BASE}/help`,
    `- Press Kit: ${BASE}/press-kit`,
    `- Brand: ${BASE}/brand`,
    `- Releases: ${BASE}/releases`,
    `- Sub-processors: ${BASE}/sub-processors`,
    `- RSS: ${BASE}/api/rss`,
  ])

  return lines.join("\n")
}

export function textResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
