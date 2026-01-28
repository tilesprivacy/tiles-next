import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og", "/api/og/", "/llms.txt", "/api/llms", "/api/llms/"],
      },
    ],
    sitemap: "https://www.tiles.run/sitemap.xml",
    host: "www.tiles.run",
  }
}
