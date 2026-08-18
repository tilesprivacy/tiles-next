import type { Metadata } from "next"
import { SupportContent } from "@/components/support-content"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Help | Tiles",
  description: "Find the shortest path from stuck to moving again with Tiles.",
  openGraph: {
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    type: "website",
    images: [socialImage("Help | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function HelpPage() {
  return <SupportContent />
}
