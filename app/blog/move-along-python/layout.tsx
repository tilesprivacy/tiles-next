import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Move Along, Python",
  description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
  openGraph: {
    title: "Move Along, Python",
    description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
    type: "article",
    publishedTime: "2026-02-17",
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
    title: "Move Along, Python",
    description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
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

