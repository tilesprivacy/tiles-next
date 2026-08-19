import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"
import { SupportContent } from "@/components/support-content"

const socialImage = getSocialImage("Help")

export const metadata: Metadata = {
  title: "Help | Tiles",
  description: "Find the shortest path from stuck to moving again with Tiles.",
  openGraph: {
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help | Tiles",
    description: "Find the shortest path from stuck to moving again with Tiles.",
    images: [socialImage.url],
  },
}

export default function HelpPage() {
  return <SupportContent />
}
