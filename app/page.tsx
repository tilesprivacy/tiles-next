import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { blogPosts } from "@/lib/blog-posts"
import { calculateReadingTime } from "@/lib/utils"

const homeDescription =
  "Your private and secure AI assistant for everyday use. Developed as a fully user-supported, independent open-source project."

export const metadata: Metadata = {
  title: "Tiles: Your private and secure Al assistant for everyday use",
  description: homeDescription,
  openGraph: {
    title: "Tiles: Your private and secure Al assistant for everyday use",
    description: homeDescription,
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles: Your private and secure Al assistant for everyday use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles: Your private and secure Al assistant for everyday use",
    description: homeDescription,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function Page() {
  const highlightSlugs = new Set([
    "ship-it-up",
    "move-along-python",
    "introducing-tiles-public-alpha",
  ])

  const highlightReadTimes = blogPosts
    .filter((post) => highlightSlugs.has(post.slug))
    .reduce<Record<string, string>>((acc, post) => {
      const minutes = calculateReadingTime(post.content)
      acc[post.slug] = `${minutes} min read`
      return acc
    }, {})

  return <HomeContent highlightReadTimes={highlightReadTimes} />
}
