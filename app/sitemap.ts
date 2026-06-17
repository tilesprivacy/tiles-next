import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-posts"
import { RESEARCH_LOG_ENTRIES } from "@/lib/research-log"

const baseUrl = "https://www.tiles.run"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/mission",
    "/blog",
    "/book/research",
    "/releases",
    "/support",
    "/book",
    "/brand",
    "/privacy",
    "/terms",
    "/sub-processors",
  ].map((path) => ({
    url: `${baseUrl}${path || "/"}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const researchRoutes: MetadataRoute.Sitemap = RESEARCH_LOG_ENTRIES.map((entry) => ({
    url: `${baseUrl}/research/${entry.id}`,
    lastModified: new Date(entry.startedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes, ...researchRoutes]
}
