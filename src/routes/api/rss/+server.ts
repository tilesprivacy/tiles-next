import { SITE_ORIGIN as ORIGIN } from "#lib/absolute-url"
import { getBlogPostMarkdown, getBlogPosts } from "#lib/blog"
import { renderMarkdown } from "#lib/markdown.server"
import { getPersonById } from "#lib/people"

export const prerender = false

const cdata = (value: string) => `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`

// Feed readers need absolute URLs inside the article HTML.
function absolutize(html: string, slug: string): string {
  return html
    .replace(/(src|href|poster)="\//g, `$1="${ORIGIN}/`)
    .replace(/href="#/g, `href="${ORIGIN}/blog/${slug}#`)
}

let items: string | undefined

function renderItems(): string {
  return getBlogPosts()
    .map((post) => {
      const link = `${ORIGIN}/blog/${post.slug}`
      const author = post.author ? getPersonById(post.author) : null
      const categories = [post.section, ...post.keywords].filter((c): c is string => Boolean(c))
      return [
        "    <item>",
        `      <title>${cdata(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <description>${cdata(post.description)}</description>`,
        `      <content:encoded>${cdata(absolutize(renderMarkdown(getBlogPostMarkdown(post.slug)).html, post.slug))}</content:encoded>`,
        `      <pubDate>${post.date.toUTCString()}</pubDate>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        ...(author ? [`      <dc:creator>${cdata(author.name)}</dc:creator>`] : []),
        ...categories.map((category) => `      <category>${cdata(category)}</category>`),
        "    </item>",
      ].join("\n")
    })
    .join("\n")
}

export function GET() {
  // Posts only change with a deploy, so render them once per isolate.
  items ??= renderItems()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>The Tiles Blog</title>
    <link>${ORIGIN}/blog</link>
    <description>Open source privacy technology for personalized software experiences</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${ORIGIN}/api/rss" rel="self" type="application/rss+xml"/>
    <managingEditor>hello@tiles.run (Tiles Privacy)</managingEditor>
    <webMaster>hello@tiles.run (Tiles Privacy)</webMaster>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
