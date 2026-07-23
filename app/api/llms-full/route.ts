import { NextResponse } from 'next/server'
import { getPublishedBlogPosts } from '@/lib/blog-posts'
import { getLatestDownloadArtifact } from '@/lib/download-artifact'
import {
  OFFLINE_INSTALLER,
  OFFLINE_MODEL_NAME,
} from '@/lib/download-page-data'
import { getPersonById } from '@/lib/people'
import { TILES_PRODUCT_DESCRIPTION } from '@/lib/product-description'
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
    TILES_PRODUCT_DESCRIPTION,
    'Hero subtext: For sensitive knowledge work or personal tasks, your AI shouldn’t require trusting a third party with your conversations and intellectual property. Run models locally, sync chats P2P, and use social features built on AT Protocol while your data and identity stay private.',
    'Current status: CLI alpha.',
    'Feature: Use local models on remote devices with `tiles remote share`; start the remote inference server with `tiles server start`, generate a share ticket, then run `tiles --remote <ticket>` on the device intending to use remote inference.',
    'Why Tiles: sensitive knowledge work stays private on your machines, with secure collaboration built in; out-of-the-box on first open without API keys, model or harness selection, sync sessions and work across devices without leaking data to a cloud vendor, share chats publicly or privately without copy-pasting threads elsewhere, sovereignty over your online identity and data with DID and UCAN for local control and ATproto for social features, use models on remote machines as if they were local, Offline Installer bundles the model for air-gapped use.',
    'Platform support: Apple Silicon (M1+), Linux (NVIDIA).',
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

  pushSection(lines, `Plugins (${baseUrl}/plugins)`, [
    'Workflow plugins from the public Tiles plugin archive.',
    'Current install pattern:',
    'tiles plugin install https://download.tiles.run/plugins/caldir.zip',
    'Plugins are distributed as zip files under https://download.tiles.run/plugins/.',
  ])

  pushSection(lines, `Mission (${baseUrl}/mission)`, [
    'Our mission is to bring privacy technology to everyone.',
    'Tiles Privacy was born from the User & Agents community with a simple idea: software should understand you without taking anything from you.',
    'Tiles focuses on privacy-focused engineering and practical consumer experience.',
  ])

  pushSection(lines, `Help (${baseUrl}/help)`, [
    'Get help',
    'Find the shortest path from stuck to moving again.',
    'Documentation: install Tiles, read the manual, check Tilekit docs, and get unstuck on setup.',
    'GitHub Issues: report reproducible bugs, request features, and track fixes in the open.',
    'Discord: fast async help from users and maintainers when you need a quick route forward.',
    'Support FAQ: include Tiles version, operating system version, exact output, screenshots if useful, and the shortest reproduction steps for bug reports. Feature requests should include workflow context, current workaround, and the outcome you want. Discord is used because the team is doing what it can with what it has, meeting people on their level while building something better. Releases has all versions and download links. Download has the latest version. Status has service availability.',
  ])

  pushSection(lines, `Sponsor (${baseUrl}/sponsor)`, [
    'Help keep Tiles Privacy independent.',
    'Our mission is to empower people by designing and building software that provides agency, control, and choice in our digital lives. We believe that privacy adoption at scale must work backwards from preserving utility. This means negligible impact on user experience, model intelligence, throughput, latency, tool use & agentic capabilities, and web access.',
    'Tiles Privacy is also a signatory to the European Social Stack initiative (https://european.social/#signatories), supporting an open, interoperable, and publicly accountable digital ecosystem for Europe.',
    'Tiles Privacy is built by a small independent team of three: Ankesh Bharti, Anandu Pavanan, and Prashant Mishra.',
    'We are grateful to the organizations supporting our work financially through our Partner Program on Open Collective, which belongs to the User & Agents Community with Open Source Europe as its fiscal host, and to everyone who has supported our projects through GitHub Sponsors.',
    'GitHub Sponsors: https://github.com/sponsors/tilesprivacy',
  ])

  const publishedPosts = getPublishedBlogPosts()

  pushSection(lines, `Blog Index (${baseUrl}/blog)`, [
    'The Tiles Blog',
    'Privacy technology for everyone.',
    'Posts here use the Standard.site lexicon for rich presentation in supported ATproto clients and are stored on a PDS hosted by Eurosky.',
    `Published posts: ${publishedPosts.length}`,
  ])

  for (const post of publishedPosts) {
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
    `- Research: ${baseUrl}/book/research`,
    `- Roadmap: ${baseUrl}/roadmap`,
    `- Sponsor: ${baseUrl}/sponsor`,
    `- Help: ${baseUrl}/help`,
    `- Brand: ${baseUrl}/brand`,
    `- Releases: ${baseUrl}/releases`,
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
