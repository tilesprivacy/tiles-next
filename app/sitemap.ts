import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-posts"

const baseUrl = "https://www.tiles.run"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/mission",
    "/download",
    "/blog",
    "/book",
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
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}

