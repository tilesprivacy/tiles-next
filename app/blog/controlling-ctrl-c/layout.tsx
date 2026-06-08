import type { Metadata } from "next"
import { StandardSiteLinkTags } from "@/components/standard-site-link-tags"
import { getPersonById } from "@/lib/people"
import { getBlogPostSocialImageUrl } from "@/lib/standard-site"

const socialImageUrl = getBlogPostSocialImageUrl("controlling-ctrl-c", "/repl_flow.png")

export const metadata: Metadata = {
  title: "Controlling the Ctrl-C | Tiles Blog",
  description: "Observations while trying to properly exit from Tiles REPL",
  keywords: ["Tiles", "Rust", "REPL", "Pi", "SIGINT", "SIGPIPE", "Tokio", "async IO", "Unix signals"],
  alternates: {
    canonical: "https://www.tiles.run/blog/controlling-ctrl-c",
  },
  openGraph: {
    title: "Controlling the Ctrl-C | Tiles Blog",
    description: "Observations while trying to properly exit from Tiles REPL",
    url: "https://www.tiles.run/blog/controlling-ctrl-c",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-06-08T00:00:00Z",
    authors: ["Anandu Pavanan"],
    section: "Engineering",
    tags: ["Tiles", "Rust", "REPL", "Pi", "SIGINT", "SIGPIPE", "Tokio", "async IO", "Unix signals"],
    images: [
      {
        url: socialImageUrl,
        width: 1076,
        height: 1568,
        alt: "Tiles CLI",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Controlling the Ctrl-C | Tiles Blog",
    description: "Observations while trying to properly exit from Tiles REPL",
    images: [socialImageUrl],
    creator: "@madcla.ws",
  },
  other: {
    "article:author": "Anandu Pavanan",
    "article:published_time": "2026-06-08T00:00:00Z",
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
        "@id": "https://www.tiles.run/blog/controlling-ctrl-c#article",
        headline: "Controlling the Ctrl-C",
        description: "Observations while trying to properly exit from Tiles REPL",
        image: {
          "@type": "ImageObject",
          url: socialImageUrl,
          width: 1076,
          height: 1568,
        },
        datePublished: "2026-06-08T00:00:00Z",
        dateModified: "2026-06-08T00:00:00Z",
        author: {
          "@type": "Person",
          "@id": "https://www.tiles.run/blog/controlling-ctrl-c#author",
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
          "@id": "https://www.tiles.run/blog/controlling-ctrl-c",
        },
        keywords: ["Tiles", "Rust", "REPL", "Pi", "SIGINT", "SIGPIPE", "Tokio", "async IO", "Unix signals"],
        articleSection: "Engineering",
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.tiles.run/blog/controlling-ctrl-c#breadcrumb",
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
            name: "Controlling the Ctrl-C",
            item: "https://www.tiles.run/blog/controlling-ctrl-c",
          },
        ],
      },
    ],
  }

  return (
    <>
      <StandardSiteLinkTags documentSlug="controlling-ctrl-c" includePublication={false} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}
