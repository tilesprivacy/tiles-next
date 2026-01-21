import type { Metadata } from "next"
import { MissionContent } from "@/components/mission-content"

export const metadata: Metadata = {
  title: "Tiles Mission",
  description: "Bringing privacy technology to everyone.",
  openGraph: {
    title: "Tiles Mission",
    description: "Bringing privacy technology to everyone.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Mission",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Mission",
    description: "Bringing privacy technology to everyone.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function MissionPage() {
  return <MissionContent />
}
