import type { Metadata } from "next"
import { SupportContent } from "@/components/support-content"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const metadata: Metadata = {
  title: "Help | Tiles",
  description: "Find the shortest path from stuck to moving again with Tiles.",
  openGraph: {
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Help | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function HelpPage() {
  return <SupportContent />
}
