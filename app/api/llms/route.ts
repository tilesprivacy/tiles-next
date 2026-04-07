import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-posts'
import { getLatestDownloadArtifact } from '@/lib/download-artifact'
import fs from 'fs'
import path from 'path'

// Helper to strip HTML tags and clean text
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// Helper to read MDX file content from the book
function readMdxFile(relativePath: string): string {
  try {
    // Book content lives in the `content` directory, mounted at `/book`
    const filePath = path.join(process.cwd(), 'content', relativePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    // Remove frontmatter
    return content.replace(/^---[\s\S]*?---\n/, '').trim()
  } catch (error) {
    return ''
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const artifact = await getLatestDownloadArtifact()

  const sections: string[] = []

  // Header
  sections.push('# llms.txt for Tiles Privacy')
  sections.push('# Learn more at https://llmstxt.org/')
  sections.push('')
  sections.push('site: Tiles Privacy marketing site (tiles.run)')
  sections.push('owner: Tiles Privacy')
  sections.push('contact: hello@tiles.run')
  sections.push(`last-updated: ${new Date().toISOString().split('T')[0]}`)
  sections.push('')
  sections.push('allowed-uses:')
  sections.push('- Crawl and summarize public pages to help people discover Tiles Privacy offerings.')
  sections.push('- Short-term caching for inference, classification, and question-answering about the site.')
  sections.push('- Non-commercial research that keeps excerpts clearly attributed to Tiles Privacy.')
  sections.push('')
  sections.push('disallowed-uses:')
  sections.push('- Training commercial foundation models or synthetic data generators without prior written consent.')
  sections.push('- Combining our content with third-party data to build user profiles or behavioral dossiers.')
  sections.push('- Serving our copy or visuals as if they were created by your model without attribution.')
  sections.push('')
  sections.push('request:')
  sections.push('- If your system logs or retains content beyond transient processing, please provide an opt-out or deletion path via the contact above.')
  sections.push('- Respect any existing robots.txt and rate limits to avoid service disruption.')
  sections.push('')
  sections.push('thank-you:')
  sections.push('We appreciate responsible AI agents that honor privacy, attribution, and user trust.')
  sections.push('')
  sections.push('='.repeat(80))
  sections.push('')

  // Home Page
  sections.push(`## Homepage (${baseUrl}/)`)
  sections.push('')
  sections.push('Tiles')
  sections.push('Your private and secure AI assistant for everyday use')
  sections.push('')
  sections.push('Tiles is a private and secure AI assistant for everyday use. Download Tiles for macOS 14+ on Apple Silicon Macs (M1 or newer). Recommended: 16 GB unified memory or more.')
  sections.push('')
  sections.push('### Frequently asked questions (security)')
  sections.push('Short answers; full context: /book/security')
  sections.push('')
  sections.push('Q: What does local-first mean for Tiles?')
  sections.push('A: Default experience runs on-device; local server binds to localhost. Config and data live in standard local directories; user data path can be changed.')
  sections.push('')
  sections.push('Q: Are chat and account databases stored as plain SQLite files?')
  sections.push('A: No. Local persistence uses encryption at rest (SQLCipher); passkeys come from secure storage. Does not remove all local risk.')
  sections.push('')
  sections.push('Q: How does Tiles handle identity and secret material?')
  sections.push('A: Public identity is separate from private keys (did:key from Ed25519). Keys and DB passkeys use the OS secure credential store, not plaintext config files.')
  sections.push('')
  sections.push('Q: How does device linking and chat sync work?')
  sections.push('A: User-mediated peer linking (ticket/code, explicit accept/reject). Release builds derive endpoints from stored secret key and verify peer identity. Sync includes caps on downloaded delta size. Networking uses Iroh; when a direct path is not practical, Iroh public relays can help establish the connection (listed as a subprocessor at /sub-processors).')
  sections.push('')
  sections.push('Q: Does Tiles include product analytics, and what is logged locally?')
  sections.push('A: No obvious bundled analytics SDKs. Local logging may include request metadata and bodies under the Tiles data directory (prompts may appear in logs).')
  sections.push('')
  sections.push('Q: How do updates, signing, and bundled dependencies relate to trust?')
  sections.push('A: Updates via GitHub releases and hosted installer depend on release/hosting integrity. macOS package is signed, notarized, stapled. Dependencies pinned; bundled deps are self-contained.')
  sections.push('')
  sections.push('Q: How do I report a security vulnerability?')
  sections.push('A: GitHub Security Advisories or security@tiles.run; see SECURITY.md in the tiles repo.')
  sections.push('')
  sections.push('='.repeat(80))
  sections.push('')

  // Mission Page
  sections.push(`## Mission (${baseUrl}/mission)`)
  sections.push('')
  sections.push('Our mission is to bring privacy technology to everyone.')
  sections.push('')
  sections.push('Tiles Privacy was born from the User & Agents community with a simple idea: software should understand you without taking anything from you. We strive to deliver the best privacy-focused engineering while also offering unmatched convenience in our consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both through your personal user agent.')
  sections.push('')
  sections.push('Founded by Ankesh Bharti (@feynon), an independent researcher and technologist, Tiles is built for privacy conscious users who want intelligence without renting their memory to centralized providers. Our first product is a private and secure AI assistant with offline memory, and an SDK that lets developers customize local models and agent experiences within Tiles.')
  sections.push('')
  sections.push('Contributors:')
  sections.push('Ankesh Bharti, Anandu Pavanan')
  sections.push('')
  sections.push('Sponsors:')
  sections.push('Active: Luke Hubbard, Dietrich Ayala, Xi Zhang, Hugo Duprez, Utkarsh Saxena')
  sections.push('Past: Boris Mann, Seref Yarar, Curran Dwyer, Goblin Oats')
  sections.push('')
  sections.push('='.repeat(80))
  sections.push('')

  // Download Installer
  sections.push(`## Download Installer (${artifact.downloadUrl})`)
  sections.push('')
  sections.push('Network installer for macOS:')
  sections.push('')
  sections.push(artifact.downloadUrl)
  sections.push('')
  sections.push('Offline installer for macOS (bundled model):')
  sections.push('')
  sections.push('https://download.tiles.run/tiles-0.4.7-full-signed.pkg')
  sections.push('SHA256: https://download.tiles.run/checksums/tiles-0.4.7-full-signed.pkg.sha256')
  sections.push('Size: 10.31 GB')
  sections.push('')
  sections.push('='.repeat(80))
  sections.push('')

  // Blog Listing Page
  sections.push(`## Blog (${baseUrl}/blog)`)
  sections.push('')
  sections.push('The Tiles Blog')
  sections.push('Privacy technology for everyone!')
  sections.push('')
  sections.push('We\'re building open source privacy technology for personalized software experiences.')
  sections.push('')
  sections.push('='.repeat(80))
  sections.push('')

  // Blog Posts
  for (const post of blogPosts) {
    sections.push(`## Blog Post: ${post.title} (${baseUrl}/blog/${post.slug})`)
    sections.push('')
    sections.push(`Published: ${post.date.toISOString().split('T')[0]}`)
    sections.push('')
    sections.push(`Description: ${post.description}`)
    sections.push('')
    sections.push('Content:')
    sections.push(stripHtml(post.content))
    sections.push('')
    sections.push('='.repeat(80))
    sections.push('')
  }

  // Book Pages
  const bookPages = [
    { path: '', title: 'Tiles Book' },
    { path: 'cli', title: 'CLI' },
    { path: 'tilekit', title: 'Tilekit' },
    { path: 'mir', title: 'MIR Extension' },
    { path: 'security', title: 'Security' },
    { path: 'memory', title: 'Memory' },
  ]

  for (const page of bookPages) {
    const mdxPath = page.path ? `${page.path}.mdx` : 'index.mdx'
    const content = readMdxFile(mdxPath)
    
    if (content) {
      const urlPath = page.path ? `/book/${page.path}` : '/book'
      sections.push(`## Book: ${page.title} (${baseUrl}${urlPath})`)
      sections.push('')
      // Remove code blocks for cleaner text output
      const textContent = content
        .replace(/```[\s\S]*?```/g, '[code block]')
        .replace(/`[^`]+`/g, (match) => match.replace(/`/g, ''))
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n')
      sections.push(textContent)
      sections.push('')
      sections.push('='.repeat(80))
      sections.push('')
    }
  }

  const output = sections.join('\n')

  return new NextResponse(output, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
