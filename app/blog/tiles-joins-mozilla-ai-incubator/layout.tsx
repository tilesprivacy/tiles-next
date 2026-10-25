import type { Metadata } from "next";
import { StandardSiteLinkTags } from "@/components/standard-site-link-tags";
import { getPersonById } from "@/lib/people";
import { getBlogPostSocialImageUrl } from "@/lib/standard-site";

const socialImageUrl = getBlogPostSocialImageUrl(
  "tiles-joins-mozilla-ai-incubator",
);

const title =
  "Tiles Privacy joins Mozilla Foundation’s Human-Scale AI Incubator as an anchor project | Tiles Blog";
const description =
  "With support from Mozilla Foundation’s Human-Scale AI Incubator, we will spend the next 18 months building private, user-owned AI for the public interest.";
const keywords = [
  "Mozilla Foundation",
  "Human-Scale AI",
  "anchor project",
  "purpose-built AI",
  "Tiles",
  "local-first",
  "open source",
];

export const metadata: Metadata = {
  title,
  description,
  keywords,
  alternates: {
    canonical:
      "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator",
  },
  openGraph: {
    title,
    description,
    url: "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-10-21T00:00:00Z",
    authors: ["Ankesh Bharti"],
    section: "Announcements",
    tags: keywords,
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Tiles and Mozilla Foundation logos beside a hand holding a glowing data center",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImageUrl],
    creator: "@feynon_",
  },
  other: {
    "article:author": "Ankesh Bharti",
    "article:published_time": "2026-10-21T00:00:00Z",
    "article:section": "Announcements",
  },
};

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const author = getPersonById("ankesh-bharti");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id":
          "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator#article",
        headline:
          "Tiles Privacy joins Mozilla Foundation’s Human-Scale AI Incubator as an anchor project",
        description,
        image: {
          "@type": "ImageObject",
          url: socialImageUrl,
          width: 1200,
          height: 630,
        },
        datePublished: "2026-10-21T00:00:00Z",
        dateModified: "2026-10-21T00:00:00Z",
        author: {
          "@type": "Person",
          "@id":
            "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator#author",
          name: "Ankesh Bharti",
          url: author?.links[0] || "https://ankeshbharti.com",
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
          "@id":
            "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator",
        },
        keywords,
        articleSection: "Announcements",
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator#breadcrumb",
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
            name: "Tiles Privacy joins Mozilla Foundation’s Human-Scale AI Incubator as an anchor project",
            item: "https://www.tiles.run/blog/tiles-joins-mozilla-ai-incubator",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StandardSiteLinkTags
        documentSlug="tiles-joins-mozilla-ai-incubator"
        includePublication={false}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
