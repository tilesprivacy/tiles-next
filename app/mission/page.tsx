import type { Metadata } from "next"
import { MissionContent } from "@/components/mission-content"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Mission | Tiles",
  description: "Bringing privacy technology to everyone.",
  openGraph: {
    title: "Mission | Tiles",
    description: "Bringing privacy technology to everyone.",
    type: "website",
    images: [socialImage("Mission | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mission | Tiles",
    description: "Bringing privacy technology to everyone.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function MissionPage() {
  return <MissionContent />
}
