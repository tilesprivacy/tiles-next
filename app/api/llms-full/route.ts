import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-posts'
import { getLatestDownloadArtifact } from '@/lib/download-artifact'
import { OFFLINE_INSTALLER, OFFLINE_MODEL_NAME } from '@/lib/download-page-data'
import { getPersonById } from '@/lib/people'
import fs from 'fs'
import path from 'path'

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeMdxText(mdx: string): string {
  return mdx
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/```[\s\S]*?```/g, '[code block]')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

function readBookPages(): Array<{ slug: string; title: string; content: string }> {
  const contentDir = path.join(process.cwd(), 'content')

  try {
    const files = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith('.mdx'))
      .sort((a, b) => a.localeCompare(b))

    return files
      .map((file) => {
        const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8')
        const titleMatch = raw.match(/^\s*title:\s*["']?(.+?)["']?\s*$/m)
        const title = titleMatch?.[1]?.trim() || file.replace(/\.mdx$/, '')
        const slug = file === 'index.mdx' ? '' : file.replace(/\.mdx$/, '')
        const content = sanitizeMdxText(raw)
        return { slug, title, content }
      })
      .filter((entry) => entry.content.length > 0)
  } catch {
    return []
  }
}

function pushSection(lines: string[], heading: string, content: string[]) {
  lines.push(`## ${heading}`)
  lines.push('')
  lines.push(...content)
  lines.push('')
  lines.push('='.repeat(80))
  lines.push('')
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const networkArtifact = await getLatestDownloadArtifact()
  const offlineChecksumUrl = `https://download.tiles.run/checksums/${OFFLINE_INSTALLER.fileName}.sha256`
  const bookPages = readBookPages()

  const lines: string[] = []

  lines.push('# llms-full.txt for Tiles Privacy')
  lines.push('')
  lines.push('Expanded full-text context for tiles.run, intended for larger context windows.')
  lines.push(`Source site: ${baseUrl}`)
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push('')
  lines.push('Canonical index file: /llms.txt')
  lines.push('Also available at: /.well-known/llms-full.txt')
  lines.push('')
  lines.push('='.repeat(80))
  lines.push('')

  pushSection(lines, `Homepage (${baseUrl}/)`, [
    'Tiles',
    'Local-first private AI for everyday use.',
    'Runs on-device models with encrypted P2P sync, keeping data and identity local, with support for sharing chats publicly on ATProto.',
    'Current status: CLI alpha.',
    `Linux availability form: ${baseUrl}/form`,
  ])

  pushSection(lines, `Download (${baseUrl}/download)`, [
    'Network installer for macOS:',
    networkArtifact.downloadUrl,
    `Version: ${networkArtifact.version}`,
    `Size: ${networkArtifact.binarySizeLabel}`,
    `SHA256: ${networkArtifact.sha256}`,
    '',
    `Offline installer for macOS (bundled model: ${OFFLINE_MODEL_NAME}):`,
    OFFLINE_INSTALLER.downloadUrl,
    `Size: ${OFFLINE_INSTALLER.binarySizeLabel}`,
    `SHA256: ${OFFLINE_INSTALLER.sha256}`,
    `SHA256 file: ${offlineChecksumUrl}`,
  ])

  pushSection(lines, `Mission (${baseUrl}/mission)`, [
    'Our mission is to bring privacy technology to everyone.',
    'Tiles Privacy was born from the User & Agents community with a simple idea: software should understand you without taking anything from you.',
    'Tiles focuses on privacy-focused engineering and practical consumer experience.',
  ])

  pushSection(lines, `Blog Index (${baseUrl}/blog)`, [
    'The Tiles Blog',
    'Privacy technology for everyone.',
    `Published posts: ${blogPosts.length}`,
  ])

  for (const post of blogPosts) {
    const postLines: string[] = []
    postLines.push(`Published: ${post.date.toISOString().slice(0, 10)}`)

    if (post.author) {
      const person = getPersonById(post.author)
      if (person) {
        postLines.push(`Author: ${person.name}`)
        if (person.links[0]) {
          postLines.push(`Author URL: ${person.links[0]}`)
        }
      }
    }

    postLines.push(`Description: ${post.description}`)
    postLines.push('')
    postLines.push('Content:')
    postLines.push(stripHtml(post.content))

    pushSection(lines, `Blog Post: ${post.title} (${baseUrl}/blog/${post.slug})`, postLines)
  }

  for (const page of bookPages) {
    const pageUrl = page.slug ? `${baseUrl}/book/${page.slug}` : `${baseUrl}/book`
    pushSection(lines, `Book: ${page.title} (${pageUrl})`, [page.content])
  }

  pushSection(lines, 'Additional URLs', [
    `- Privacy: ${baseUrl}/privacy`,
    `- Terms: ${baseUrl}/terms`,
    `- Pricing: ${baseUrl}/pricing`,
    `- Roadmap: ${baseUrl}/roadmap`,
    `- Sponsor: ${baseUrl}/sponsor`,
    `- Brand: ${baseUrl}/brand`,
    `- Changelog: ${baseUrl}/changelog`,
    `- Sub-processors: ${baseUrl}/sub-processors`,
    `- RSS: ${baseUrl}/api/rss`,
  ])

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
