import type { Metadata } from "next"
import { getPersonById } from "@/lib/people"

export const metadata: Metadata = {
  title: "Move Along, Python | Tiles Blog",
  description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
  keywords: ["Python", "venvstacks", "portable runtimes", "Python packaging", "dependency management", "Tiles", "deterministic builds"],
  alternates: {
    canonical: "https://www.tiles.run/blog/move-along-python",
  },
  openGraph: {
    title: "Move Along, Python | Tiles Blog",
    description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
    url: "https://www.tiles.run/blog/move-along-python",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-02-17T00:00:00Z",
    authors: ["Anandu Pavanan"],
    section: "Engineering",
    tags: ["Python", "venvstacks", "portable runtimes", "Python packaging", "dependency management", "Tiles", "deterministic builds"],
    images: [
      {
        url: "https://www.tiles.run/tiles_banner_outline_blk.svg",
        width: 1200,
        height: 630,
        alt: "Tiles banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Move Along, Python | Tiles Blog",
    description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
    images: ["https://www.tiles.run/tiles_banner_outline_blk.svg"],
    creator: "@madcla.ws",
  },
  other: {
    "article:author": "Anandu Pavanan",
    "article:published_time": "2026-02-17T00:00:00Z",
    "article:section": "Engineering",
  },
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const author = getPersonById("anandu-pavanan")

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": "https://www.tiles.run/blog/move-along-python#article",
        headline: "Move Along, Python",
        description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
        image: {
          "@type": "ImageObject",
          url: "https://www.tiles.run/tiles_banner_outline_blk.svg",
          width: 1200,
          height: 630,
        },
        datePublished: "2026-02-17T00:00:00Z",
        dateModified: "2026-02-17T00:00:00Z",
        author: {
          "@type": "Person",
          "@id": "https://www.tiles.run/blog/move-along-python#author",
          name: "Anandu Pavanan",
          url: author?.links[0] || "https://bsky.app/profile/madcla.ws",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://www.tiles.run/#organization",
          name: "Tiles Privacy",
          logo: {
            "@type": "ImageObject",
            url: "https://www.tiles.run/tiles_banner_outline_blk.svg",
          },
          url: "https://www.tiles.run",
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://www.tiles.run/blog/move-along-python",
        },
        keywords: ["Python", "venvstacks", "portable runtimes", "Python packaging", "dependency management", "Tiles", "deterministic builds"],
        articleSection: "Engineering",
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.tiles.run/blog/move-along-python#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.tiles.run",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://www.tiles.run/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Move Along, Python",
            item: "https://www.tiles.run/blog/move-along-python",
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}

