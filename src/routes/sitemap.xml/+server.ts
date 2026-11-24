import { SITE_ORIGIN } from "#lib/absolute-url"
import { allBookPages } from "#lib/book"
import { getTilesPlugins } from "#lib/plugins"
import { getBlogPosts } from "#lib/server/blog"
import { SHOW_PRICING } from "#lib/feature-flags"
import { RESEARCH_LOG_ENTRIES } from "#lib/research-log"

export const prerender = true

interface SitemapEntry {
  path: string
  lastModified?: Date
  changeFrequency: "weekly" | "monthly"
  priority: number
}

const STATIC_ROUTES = [
  "",
  "/download",
  "/mission",
  "/blog",
  "/plugins",
  "/releases",
  ...(SHOW_PRICING ? ["/pricing"] : []),
  "/help",
  "/brand",
  "/about",
  "/sponsor",
  "/press-kit",
  "/indiafoss-2026-giveaway",
  "/tiles-at-india-foss",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/sub-processors",
]

async function entries(): Promise<SitemapEntry[]> {
  return [
    ...STATIC_ROUTES.map((path) => ({
      path: path || "/",
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...allBookPages.map((page) => ({
      path: page.href,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...(await getTilesPlugins()).map((plugin) => ({
      path: `/plugins/${plugin.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...(await getBlogPosts()).map((post) => ({
      path: `/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...RESEARCH_LOG_ENTRIES.map((entry) => ({
      path: `/research/${entry.id}`,
      lastModified: new Date(entry.startedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}

function toXml(entry: SitemapEntry): string {
  return [
    "<url>",
    `<loc>${SITE_ORIGIN}${entry.path}</loc>`,
    ...(entry.lastModified ? [`<lastmod>${entry.lastModified.toISOString()}</lastmod>`] : []),
    `<changefreq>${entry.changeFrequency}</changefreq>`,
    `<priority>${entry.priority}</priority>`,
    "</url>",
  ].join("\n")
}

export const GET = async () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(await entries()).map(toXml).join("\n")}
</urlset>
`,
    { headers: { "Content-Type": "application/xml" } },
  )
