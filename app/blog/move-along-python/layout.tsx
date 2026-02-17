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
        url: "/og-plain.png",
        width: 1200,
        height: 630,
        alt: "Move Along, Python – deterministic, portable Python runtimes for Tiles using layered venvstacks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Move Along, Python",
    description: "Deterministic, portable Python runtimes for Tiles using layered venvstacks.",
    images: ["/og-plain.png"],
  },
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

