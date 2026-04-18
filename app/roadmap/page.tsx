import type { Metadata } from "next"
import { RoadmapContent } from "@/components/roadmap-content"

export const metadata: Metadata = {
  title: "Roadmap | Tiles",
  description: "Tiles roadmap and implementation priorities.",
  openGraph: {
    title: "Roadmap | Tiles",
    description: "Tiles roadmap and implementation priorities.",
    url: "https://www.tiles.run/roadmap",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og?page=roadmap",
        width: 1200,
        height: 630,
        alt: "Roadmap | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roadmap | Tiles",
    description: "Tiles roadmap and implementation priorities.",
    images: ["https://www.tiles.run/api/og?page=roadmap"],
  },
}

export default function RoadmapPage() {
  return <RoadmapContent />
}
