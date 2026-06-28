import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-posts'
import { TILES_PRODUCT_DESCRIPTION } from '@/lib/product-description'
import { RESEARCH_PAGE_INTRO } from '@/lib/research-log'
import { getLatestDownloadArtifact } from '@/lib/download-artifact'
import { OFFLINE_INSTALLER, OFFLINE_MODEL_NAME } from '@/lib/download-page-data'
import fs from 'fs'
import path from 'path'

interface BookPageMeta {
  slug: string
  title: string
  description: string
}

function readBookPages(): BookPageMeta[] {
  const contentDir = path.join(process.cwd(), 'content')

  try {
    const files = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith('.mdx'))
      .sort((a, b) => a.localeCompare(b))

    return files
      .map((file) => {
        const filePath = path.join(contentDir, file)
        const raw = fs.readFileSync(filePath, 'utf-8')
        const titleMatch = raw.match(/^\s*title:\s*["']?(.+?)["']?\s*$/m)
        const descriptionMatch = raw.match(/^\s*description:\s*["']?(.+?)["']?\s*$/m)
        const slug = file === 'index.mdx' ? '' : file.replace(/\.mdx$/, '')
        const title = titleMatch?.[1]?.trim() || (slug ? slug : 'Book')
        const description = descriptionMatch?.[1]?.trim() || 'Documentation page'
        return { slug, title, description }
      })
      .sort((a, b) => a.slug.localeCompare(b.slug))
  } catch {
    return []
  }
}

function addSection(lines: string[], heading: string, items: string[]) {
  lines.push(`## ${heading}`)
  lines.push('')
  lines.push(...items)
  lines.push('')
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const networkArtifact = await getLatestDownloadArtifact()
  const offlineChecksumUrl = `https://download.tiles.run/checksums/${OFFLINE_INSTALLER.fileName}.sha256`
  const bookPages = readBookPages()

  const lines: string[] = []

  lines.push('# Tiles Privacy')
  lines.push('')
  lines.push(`> ${TILES_PRODUCT_DESCRIPTION}`)
  lines.push('')
  lines.push(`Last updated: ${new Date().toISOString().slice(0, 10)}`)
  lines.push('This file follows the llms.txt convention and provides a complete content map for tiles.run.')
  lines.push('Use the links below to fetch canonical page content; each list item includes a short note for quick routing.')
  lines.push('')
  addSection(lines, 'Core Pages', [
    `- [Homepage](${baseUrl}/): Product positioning, Why Tiles summary, and core value proposition.`,
    `- [Download](${baseUrl}/download): Current installers and installation guidance.`,
    `- [Plugins](${baseUrl}/plugins): Workflow plugins from the public Tiles plugin archive with terminal install commands.`,
    `- [Mission](${baseUrl}/mission): Project mission, contributors, and sponsors.`,
    `- [Sponsor](${baseUrl}/sponsor): Sponsorship options and support details.`,
    `- [Support](${baseUrl}/support): Support routes, issue reporting guidance, Discord, releases, downloads, and status links.`,
    `- [Research](${baseUrl}/book/research): ${RESEARCH_PAGE_INTRO}`,
    `- [Roadmap](${baseUrl}/roadmap): Planned work and project direction.`,
    `- [Brand](${baseUrl}/brand): Public brand assets and usage details.`,
  ])

  addSection(lines, 'Installers And Release Metadata', [
    `- [Network installer](${networkArtifact.downloadUrl}): Latest macOS installer, version ${networkArtifact.version}, size ${networkArtifact.binarySizeLabel}, sha256 ${networkArtifact.sha256}.`,
    `- [Offline installer](${OFFLINE_INSTALLER.downloadUrl}): Bundled model ${OFFLINE_MODEL_NAME}, size ${OFFLINE_INSTALLER.binarySizeLabel}, sha256 ${OFFLINE_INSTALLER.sha256}.`,
    `- [Offline installer checksum file](${offlineChecksumUrl}): SHA256 checksum file for offline installer validation.`,
    `- [Plugin archive](https://download.tiles.run/plugins/): Public plugin archive. Install plugins with tiles plugin install <zip-url>.`,
    `- [Releases](${baseUrl}/releases): Release notes and links to previous versions.`,
  ])

  addSection(lines, 'Documentation (Book)', [
    `- [Book index](${baseUrl}/book): Technical docs for Tiles and Tilekit.`,
    ...bookPages.map((page) => {
      const pageUrl = page.slug ? `${baseUrl}/book/${page.slug}` : `${baseUrl}/book`
      return `- [${page.title}](${pageUrl}): ${page.description}`
    }),
  ])

  addSection(lines, 'Blog', [
    `- [Blog index](${baseUrl}/blog): Blog landing page with all published posts. Posts here use the Standard.site lexicon for rich presentation in supported ATProto clients and are stored on a PDS hosted by Eurosky.`,
    ...blogPosts.map((post) => `- [${post.title}](${baseUrl}/blog/${post.slug}): ${post.description}`),
  ])

  addSection(lines, 'Legal And Policy', [
    `- [Privacy](${baseUrl}/privacy): Privacy statement for website and product.`,
    `- [Terms](${baseUrl}/terms): Terms for using Tiles services and website.`,
    `- [Sub-processors](${baseUrl}/sub-processors): Third-party processors used by the project.`,
    `- [Subprocessors alias](${baseUrl}/subprocessors): Alias route for subprocessors page.`,
  ])

  addSection(lines, 'Community And Feeds', [
    '- [Discord community](https://go.tiles.run/discord): Community support and discussion channel.',
    `- [Support page](${baseUrl}/support): Start here for documentation, GitHub issue reporting, Discord help, releases, downloads, and status.`,
    `- [RSS feed](${baseUrl}/api/rss): Syndicated feed for blog content.`,
    `- [GitHub organization](https://github.com/tilesprivacy): Source code and issue tracking.`,
  ])

  addSection(lines, 'Optional', [
    `- [Expanded full context](${baseUrl}/llms-full.txt): Full-text context file for larger LLM context windows.`,
    `- [Expanded full context (.well-known)](${baseUrl}/.well-known/llms-full.txt): Mirror of llms-full.txt under .well-known.`,
    `- [Brand assets archive](${baseUrl}/tiles-brand-assets.zip): Public downloadable branding assets.`,
    `- [Status page](https://status.tiles.run): Service and infrastructure status.`,
  ])

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
