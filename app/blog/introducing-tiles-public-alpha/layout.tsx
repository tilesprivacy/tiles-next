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
        url: "/kingston.webp",
        width: 1200,
        height: 600,
        alt: "Cover image for Introducing Tiles Alpha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Tiles Public Alpha",
    description: "Building an everyday AI assistant with privacy-first engineering at its core.",
    images: ["/kingston.webp"],
  },
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
