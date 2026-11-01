import { SITE_ORIGIN as ORIGIN } from "#lib/absolute-url"
import { getBlogPostMarkdown, getBlogPosts } from "#lib/server/blog"
import { renderMarkdown } from "#lib/markdown.server"
import { getPersonById } from "#lib/people"

// Built with the site: posts only change with a deploy.
export const prerender = true

const cdata = (value: string) => `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`

// Feed readers need absolute URLs inside the article HTML.
function absolutize(html: string, slug: string): string {
  return html
    .replace(/(src|href|poster)="\//g, `$1="${ORIGIN}/`)
    .replace(/href="#/g, `href="${ORIGIN}/blog/${slug}#`)
}

async function renderItems(): Promise<string> {
  const items: string[] = []
  for (const post of await getBlogPosts()) {
    const link = `${ORIGIN}/blog/${post.slug}`
    const author = post.author ? getPersonById(post.author) : null
    const categories = [post.section, ...post.keywords].filter((c): c is string => Boolean(c))
    items.push(
      [
        "    <item>",
        `      <title>${cdata(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <description>${cdata(post.description)}</description>`,
        `      <content:encoded>${cdata(absolutize(renderMarkdown(await getBlogPostMarkdown(post.slug)).html, post.slug))}</content:encoded>`,
        `      <pubDate>${post.date.toUTCString()}</pubDate>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        ...(author ? [`      <dc:creator>${cdata(author.name)}</dc:creator>`] : []),
        ...categories.map((category) => `      <category>${cdata(category)}</category>`),
        "    </item>",
      ].join("\n"),
    )
  }
  return items.join("\n")
}

export async function GET() {
  const items = await renderItems()

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
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
