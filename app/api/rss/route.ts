import { NextResponse } from 'next/server'
import { blogPosts } from '@/lib/blog-posts'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  
  // Helper to convert relative URLs to absolute in HTML content
  const processContent = (content: string): string => {
    return content
      .replace(/src="\//g, `src="${baseUrl}/`)
      .replace(/href="\//g, `href="${baseUrl}/`)
      .replace(/href="#/g, `href="${baseUrl}/blog/introducing-tiles-public-alpha#`)
  }
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>The Tiles Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Open source privacy technology for personalized software experiences</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    ${blogPosts
      .map(
        (post) => {
          const processedContent = processContent(post.content)
          return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${processedContent}]]></content:encoded>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
    </item>`
        }
      )
      .join('\n')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
