import type { Metadata } from "next"
import { getPersonById } from "@/lib/people"

export const metadata: Metadata = {
  title: "Ship it up | Tiles Blog",
  description: "How we package and ship Tiles",
  keywords: ["Tiles", "packaging", "deployment", "software distribution", "venvstacks", "Python packaging"],
  alternates: {
    canonical: "https://www.tiles.run/blog/ship-it-up",
  },
  openGraph: {
    title: "Ship it up | Tiles Blog",
    description: "How we package and ship Tiles",
    url: "https://www.tiles.run/blog/ship-it-up",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-04-05T00:00:00Z",
    authors: ["Anandu Pavanan"],
    section: "Engineering",
    tags: ["Tiles", "packaging", "deployment", "software distribution", "venvstacks", "Python packaging"],
    images: [
      {
        url: "https://www.tiles.run/shipitup.png",
        width: 1154,
        height: 652,
        alt: "Cover image for Ship it up",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ship it up | Tiles Blog",
    description: "How we package and ship Tiles",
    images: ["https://www.tiles.run/shipitup.png"],
    creator: "@madclaws",
  },
  other: {
    "article:author": "Anandu Pavanan",
    "article:published_time": "2026-04-05T00:00:00Z",
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
        "@id": "https://www.tiles.run/blog/ship-it-up#article",
        headline: "Ship it up",
        description: "How we package and ship Tiles",
        image: {
          "@type": "ImageObject",
          url: "https://www.tiles.run/shipitup.png",
          width: 1154,
          height: 652,
        },
        datePublished: "2026-04-05T00:00:00Z",
        dateModified: "2026-04-05T00:00:00Z",
        author: {
          "@type": "Person",
          "@id": "https://www.tiles.run/blog/ship-it-up#author",
          name: "Anandu Pavanan",
          url: author?.links[0] || "https://github.com/madclaws",
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
          "@id": "https://www.tiles.run/blog/ship-it-up",
        },
        keywords: ["Tiles", "packaging", "deployment", "software distribution", "venvstacks", "Python packaging"],
        articleSection: "Engineering",
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.tiles.run/blog/ship-it-up#breadcrumb",
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
            name: "Ship it up",
            item: "https://www.tiles.run/blog/ship-it-up",
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
