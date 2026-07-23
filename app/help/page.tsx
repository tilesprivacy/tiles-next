import type { Metadata } from "next"
import { SupportContent } from "@/components/support-content"

export const metadata: Metadata = {
  title: "Help | Tiles",
  description: "Find the shortest path from stuck to moving again with Tiles.",
  openGraph: {
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Help | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function HelpPage() {
  return <SupportContent />
}
