import { NextResponse } from 'next/server'
import { getPublishedBlogPosts } from '@/lib/blog-posts'
import { TILES_PRODUCT_DESCRIPTION } from '@/lib/product-description'
import { getTilesPlugins } from '@/lib/plugins'
import { sponsorPageTeamSentence } from '@/lib/sponsor-page-people'
import fs from 'fs'
import path from 'path'

interface BookPageMeta {
  slug: string
  title: string
  description: string
}

const visibleBookSlugs = [
  '',
  'overview',
  'manual',
  'models',
  'tilekit',
  'security',
  'community',
  'resources',
  'opensource',
] as const

function readBookPage(slug: (typeof visibleBookSlugs)[number]): BookPageMeta | null {
  const contentDir = path.join(process.cwd(), 'content')
  const file = slug ? `${slug}.mdx` : 'index.mdx'
  const filePath = path.join(contentDir, file)

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const titleMatch = raw.match(/^\s*title:\s*["']?(.+?)["']?\s*$/m)
    const descriptionMatch = raw.match(/^\s*description:\s*["']?(.+?)["']?\s*$/m)
    const title = titleMatch?.[1]?.trim() || (slug ? slug : 'Book')
    const description = descriptionMatch?.[1]?.trim() || 'Documentation page'
    return { slug, title, description }
  } catch {
    return null
  }
}

function readVisibleBookPages(): BookPageMeta[] {
  return visibleBookSlugs
    .map((slug) => readBookPage(slug))
    .filter((page): page is BookPageMeta => Boolean(page))
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
  const bookPages = readVisibleBookPages()
  const plugins = await getTilesPlugins()

  const lines: string[] = []

  lines.push(`# Tiles Privacy Homepage: ${baseUrl}/`)
  lines.push('')
  lines.push('## Overview')
  lines.push('')
  lines.push(TILES_PRODUCT_DESCRIPTION)
  lines.push('')
  lines.push(
    'Tiles is built by Tiles Privacy, an independent team devoted to user agency. The website focuses on the public alpha, product documentation, plugins, release notes, support, sponsorship, and legal information.',
  )
  lines.push(
    'Homepage feature: Use local models on remote devices (nightly) with `tiles remote share`, sharing inference between your devices over Iroh without exposing it to the public Internet.',
  )
  lines.push('')

  addSection(lines, 'Primary Pages', [
    `- Homepage: ${baseUrl}/`,
    `- Download: ${baseUrl}/download`,
    `- Book: ${baseUrl}/book`,
    `- Plugins: ${baseUrl}/plugins`,
    `- Blog: ${baseUrl}/blog`,
    `- Releases: ${baseUrl}/releases`,
    `- Support: ${baseUrl}/support`,
    `- Sponsor: ${baseUrl}/sponsor`,
  ])

  addSection(lines, 'Sponsor', [
    `- Sponsor page: ${baseUrl}/sponsor`,
    '- Support Tiles Privacy and help fund private, local-first AI.',
    `- ${sponsorPageTeamSentence}`,
    '- GitHub Sponsors: https://github.com/sponsors/tilesprivacy',
  ])

  addSection(
    lines,
    'Documentation',
    bookPages.map((page) => {
      const pageUrl = page.slug ? `${baseUrl}/book/${page.slug}` : `${baseUrl}/book`
      return `- ${page.title}: ${pageUrl} - ${page.description}`
    }),
  )

  addSection(lines, 'Plugins', [
    `- Plugin index: ${baseUrl}/plugins`,
    ...plugins.map((plugin) => `- ${plugin.name}: ${baseUrl}/plugins/${plugin.slug} - ${plugin.description}`),
  ])

  addSection(lines, 'Blog', [
    `- Blog index: ${baseUrl}/blog`,
    ...getPublishedBlogPosts().map((post) => `- ${post.title}: ${baseUrl}/blog/${post.slug} - ${post.description}`),
  ])

  addSection(lines, 'Legal And Site Information', [
    `- Privacy: ${baseUrl}/privacy`,
    `- Terms: ${baseUrl}/terms`,
    `- Subprocessors: ${baseUrl}/sub-processors`,
    `- Brand: ${baseUrl}/brand`,
    `- AI-readable website index: ${baseUrl}/llms.txt`,
  ])

  addSection(lines, 'External Links', [
    'These links are visible from the website footer or support page.',
    '- Discord: https://go.tiles.run/discord',
    '- GitHub organization: https://github.com/tilesprivacy',
    '- X / Twitter: https://x.com/tilesprivacy',
    '- Bluesky: https://bsky.app/profile/tiles.run',
    '- Tangled: https://tangled.org/tiles.run',
    '- Hugging Face: https://huggingface.co/tilesprivacy',
    '- Status page: https://status.tiles.run',
  ])

  lines.push(`_Last updated: ${new Date().toISOString().slice(0, 10)}_`)

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
