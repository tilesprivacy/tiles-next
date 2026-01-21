import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Introducing Tiles Public Alpha",
  description: "Building an everyday AI assistant with privacy-first engineering at its core.",
  openGraph: {
    title: "Introducing Tiles Public Alpha",
    description: "Building an everyday AI assistant with privacy-first engineering at its core.",
    type: "article",
    publishedTime: "2026-01-02",
    images: [
      {
        url: "https://www.tiles.run/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tiles - Your private AI assistant for everyday use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Tiles Public Alpha",
    description: "Building an everyday AI assistant with privacy-first engineering at its core.",
    images: ["https://www.tiles.run/og-image.jpg"],
  },
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
