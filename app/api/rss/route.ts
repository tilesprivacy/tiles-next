import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-posts'
import { getPersonById } from '@/lib/people'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  // Helper to convert relative URLs to absolute in HTML content
  const processContent = (content: string, slug: string): string => {
    return content
      .replace(/src="\//g, `src="${baseUrl}/`)
      .replace(/href="\//g, `href="${baseUrl}/`)
      .replace(/href="#/g, `href="${baseUrl}/blog/${slug}#`)
  }

  // Helper to get keywords for blog posts
  const getKeywordsForPost = (slug: string): string[] => {
    const keywordMap: Record<string, string[]> = {
      'ship-it-up': ['Tiles', 'packaging', 'deployment', 'software distribution', 'venvstacks', 'Python packaging'],
      'move-along-python': ['Python', 'venvstacks', 'portable runtimes', 'Python packaging', 'dependency management', 'Tiles', 'deterministic builds'],
    }
    return keywordMap[slug] || []
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>The Tiles Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Open source privacy technology for personalized software experiences</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <managingEditor>hello@tiles.run (Tiles Privacy)</managingEditor>
    <webMaster>hello@tiles.run (Tiles Privacy)</webMaster>
    ${blogPosts
      .map(
        (post) => {
          const processedContent = processContent(post.content, post.slug)
          const author = post.author ? getPersonById(post.author) : null
          const keywords = getKeywordsForPost(post.slug)

          return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${processedContent}]]></content:encoded>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>${author ? `
      <dc:creator><![CDATA[${author.name}]]></dc:creator>` : ''}
      <category><![CDATA[Engineering]]></category>${keywords.map(keyword => `
      <category><![CDATA[${keyword}]]></category>`).join('')}
    </item>`
        }
      )
      .join('\n')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
