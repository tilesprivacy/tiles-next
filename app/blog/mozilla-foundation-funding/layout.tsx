import type { Metadata } from "next";
import { StandardSiteLinkTags } from "@/components/standard-site-link-tags";
import { getPersonById } from "@/lib/people";
import { getBlogPostSocialImageUrl } from "@/lib/standard-site";

const socialImageUrl = getBlogPostSocialImageUrl("mozilla-foundation-funding");

const title = "Tiles Privacy receives a $300K grant from the Mozilla Foundation to advance human-scale AI systems | Tiles Blog";
const description =
  "Mozilla Foundation is supporting Tiles with a $300,000 non-dilutive anchor grant through its human-scale AI program.";
const keywords = [
  "Mozilla Foundation",
  "Human-Scale AI",
  "grant",
  "non-dilutive funding",
  "Tiles",
  "local-first",
  "open source",
];

export const metadata: Metadata = {
  title,
  description,
  keywords,
  alternates: {
    canonical: "https://www.tiles.run/blog/mozilla-foundation-funding",
  },
  openGraph: {
    title,
    description,
    url: "https://www.tiles.run/blog/mozilla-foundation-funding",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-10-19T00:00:00Z",
    authors: ["Ankesh Bharti"],
    section: "Announcements",
    tags: keywords,
    images: [
      {
        url: socialImageUrl,
        width: 1000,
        height: 563,
        alt: "Mozilla Foundation and Tiles logos",
        type: "image/png",
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
    "article:published_time": "2026-10-19T00:00:00Z",
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
        "@id": "https://www.tiles.run/blog/mozilla-foundation-funding#article",
        headline: "Tiles Privacy receives a $300K grant from the Mozilla Foundation to advance human-scale AI systems",
        description,
        image: {
          "@type": "ImageObject",
          url: socialImageUrl,
          width: 1000,
          height: 563,
        },
        datePublished: "2026-10-19T00:00:00Z",
        dateModified: "2026-10-19T00:00:00Z",
        author: {
          "@type": "Person",
          "@id": "https://www.tiles.run/blog/mozilla-foundation-funding#author",
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
          "@id": "https://www.tiles.run/blog/mozilla-foundation-funding",
        },
        keywords,
        articleSection: "Announcements",
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.tiles.run/blog/mozilla-foundation-funding#breadcrumb",
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
            name: "Tiles Privacy receives a $300K grant from the Mozilla Foundation to advance human-scale AI systems",
            item: "https://www.tiles.run/blog/mozilla-foundation-funding",
          },
        ],
      },
    ],
  };

  return (
    <>
      <StandardSiteLinkTags
        documentSlug="mozilla-foundation-funding"
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
