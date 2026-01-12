import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-posts'
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

// Helper to read MDX file content
function readMdxFile(relativePath: string): string {
  try {
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
  sections.push('Your private AI assistant with offline memory')
  sections.push('')
  sections.push('Tiles is a private AI assistant with offline memory. Download Tiles for macOS 14+ with Apple Silicon (M1+).')
  sections.push('')
  sections.push('='.repeat(80))
  sections.push('')

  // Mission Page
  sections.push(`## Mission (${baseUrl}/mission)`)
  sections.push('')
  sections.push('Our mission is to shape the future of software personalization with decentralized memory networks.')
  sections.push('')
  sections.push('Tiles Privacy was born from the User & Agents community with a simple idea: software should understand you without taking anything from you. We strive to deliver the best privacy-focused engineering while also offering unmatched convenience in our consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both through your personal user agent.')
  sections.push('')
  sections.push('Founded by Ankesh Bharti (@feynon), an independent researcher and technologist, Tiles is built for privacy conscious users who want intelligence without renting their memory to centralized providers. Our first product is an on-device memory management system paired with an SDK that lets developers securely access user memory and create deeply personalized agent experiences.')
  sections.push('')
  sections.push('Contributors:')
  sections.push('Core: Ankesh Bharti, Anandu Pavanan')
  sections.push('Community: Kshitij Taneja')
  sections.push('')
  sections.push('Sponsors:')
  sections.push('Active: Luke Hubbard, Dietrich Ayala, Xi Zhang, Hugo Duprez, Utkarsh Saxena')
  sections.push('Past: Boris Mann, Seref Yarar, Curran Dwyer')
  sections.push('')
  sections.push('='.repeat(80))
  sections.push('')

  // Download Page
  sections.push(`## Download (${baseUrl}/download)`)
  sections.push('')
  sections.push('Install and run Tiles for Mac:')
  sections.push('')
  sections.push('curl -fsSL https://tiles.run/install.sh | sh')
  sections.push('tiles run')
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
    { path: 'cli', title: 'CLI Reference' },
    { path: 'models', title: 'Models Reference' },
    { path: 'modelfile', title: 'Modelfile Reference' },
    { path: 'mir', title: 'MIR Extension' },
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

