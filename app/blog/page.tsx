import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog-posts"
import { BlogListingContent } from "@/components/blog-listing-content"

export const metadata: Metadata = {
  title: "Tiles Blog: Privacy technology for everyone!",
  description: "We're building open source privacy technology for personalized software experiences.",
  openGraph: {
    title: "Tiles Blog: Privacy technology for everyone!",
    description: "We're building open source privacy technology for personalized software experiences.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Blog: Privacy technology for everyone!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Blog: Privacy technology for everyone!",
    description: "We're building open source privacy technology for personalized software experiences.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function BlogPage() {
  // Serialize and sort posts (latest first) for the client component
  const serializedPosts = [...blogPosts]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      author: post.author,
      coverImage: post.coverImage ?? "/og-image.jpg",
      coverAlt: post.coverAlt ?? post.title,
    }))

  return <BlogListingContent posts={serializedPosts} />
}
