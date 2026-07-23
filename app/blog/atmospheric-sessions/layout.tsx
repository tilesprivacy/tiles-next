import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardSiteLinkTags } from "@/components/standard-site-link-tags";
import { getBlogPostBySlug, isBlogPostVisible } from "@/lib/blog-posts";
import { getBlogPostSocialImageUrl } from "@/lib/standard-site";

const post = getBlogPostBySlug("atmospheric-sessions");
const socialImageUrl = getBlogPostSocialImageUrl(
  "atmospheric-sessions",
  post?.coverImage ?? "/atmospheric-sessions-banner-og.png",
);

export const metadata: Metadata = {
  title: post
    ? `${post.title} | Tiles Blog`
    : "Atmopsheric sessions | Tiles Blog",
  description: post?.description,
  alternates: { canonical: "https://www.tiles.run/blog/atmospheric-sessions" },
  openGraph: {
    title: post
      ? `${post.title} | Tiles Blog`
      : "Atmopsheric sessions | Tiles Blog",
    description: post?.description,
    url: "https://www.tiles.run/blog/atmospheric-sessions",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-07-24T00:00:00Z",
    authors: ["Anandu Pavanan"],
    images: [
      {
        url: socialImageUrl,
        width: 1536,
        height: 1024,
        alt: post?.coverAlt ?? "Atmospheric link over a cloudscape",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: post
      ? `${post.title} | Tiles Blog`
      : "Atmopsheric sessions | Tiles Blog",
    description: post?.description,
    images: [socialImageUrl],
  },
  other: {
    "article:author": "Anandu Pavanan",
    "article:published_time": "2026-07-24T00:00:00Z",
  },
};

export default function AtmosphericSessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!post || !isBlogPostVisible(post)) notFound();

  return (
    <>
      <StandardSiteLinkTags
        documentSlug="atmospheric-sessions"
        includePublication={false}
      />
      {children}
    </>
  );
}
