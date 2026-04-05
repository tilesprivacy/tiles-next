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
  },
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
