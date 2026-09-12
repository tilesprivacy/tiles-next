import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { StandardSiteLinkTags } from "@/components/standard-site-link-tags"
import { getBlogPostBySlug, isBlogPostVisible } from "@/lib/blog-posts"
import { getBlogPostSocialImageUrl } from "@/lib/standard-site"

const post = getBlogPostBySlug("own-your-ai")
const socialImageUrl = getBlogPostSocialImageUrl("own-your-ai", "/own-your-ai-og.png")

export const metadata: Metadata = {
  title: post ? `${post.title} | Tiles Blog` : "Own your AI | Tiles Blog",
  description: post?.description,
  alternates: {
    canonical: "https://www.tiles.run/blog/own-your-ai",
  },
  openGraph: {
    title: post ? `${post.title} | Tiles Blog` : "Own your AI | Tiles Blog",
    description: post?.description,
    url: "https://www.tiles.run/blog/own-your-ai",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-07-14T00:00:00Z",
    authors: ["Ankesh Bharti"],
    images: [
      {
        url: socialImageUrl,
        width: 1672,
        height: 941,
        alt: post?.coverAlt ?? "Own your AI with local models and open protocols",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: post ? `${post.title} | Tiles Blog` : "Own your AI | Tiles Blog",
    description: post?.description,
    images: [socialImageUrl],
    creator: "@_feynon",
  },
  other: {
    "article:author": "Ankesh Bharti",
    "article:published_time": "2026-07-14T00:00:00Z",
  },
}

export default function OwnYourAiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!post || !isBlogPostVisible(post)) {
    notFound()
  }

  return (
    <>
      <StandardSiteLinkTags documentSlug="own-your-ai" includePublication={false} />
      {children}
    </>
  )
}
