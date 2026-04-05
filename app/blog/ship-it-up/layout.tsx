import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ship it up | Tiles Blog",
  description: "How we package and ship Tiles",
  openGraph: {
    title: "Ship it up | Tiles Blog",
    description: "How we package and ship Tiles",
    url: "https://www.tiles.run/blog/ship-it-up",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-04-05",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles - Your private and secure AI assistant for everyday use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ship it up | Tiles Blog",
    description: "How we package and ship Tiles",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
