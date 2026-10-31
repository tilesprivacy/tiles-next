import type { Metadata } from "next"

const title = "Own your AI with open models and decentralized protocols"
const description =
  "An IndiaFOSS 2026 talk about open models, decentralized protocols, and user-owned AI"

export const metadata: Metadata = {
  title: `${title} | Tiles Privacy`,
  description,
  alternates: {
    canonical: "https://www.tiles.run/india-foss-2026",
  },
  openGraph: {
    title,
    description,
    url: "https://www.tiles.run/india-foss-2026",
    siteName: "Tiles Privacy",
    type: "article",
    publishedTime: "2026-09-27T00:00:00+05:30",
    authors: ["Ankesh Bharti"],
    images: [
      {
        url: "/own-your-ai-og.png",
        width: 1672,
        height: 941,
        alt: title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/own-your-ai-og.png"],
    creator: "@_feynon",
  },
  other: {
    "article:author": "Ankesh Bharti",
    "article:published_time": "2026-09-27T00:00:00+05:30",
  },
}

export default function IndiaFoss2026Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
