import type { Metadata } from "next"
import { MissionContent } from "@/components/mission-content"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const metadata: Metadata = {
  title: "Mission | Tiles",
  description: "Bringing privacy technology to everyone.",
  openGraph: {
    title: "Mission | Tiles",
    description: "Bringing privacy technology to everyone.",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Mission | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mission | Tiles",
    description: "Bringing privacy technology to everyone.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function MissionPage() {
  return <MissionContent />
}
