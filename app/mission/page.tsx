import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"
import { MissionContent } from "@/components/mission-content"

const socialImage = getSocialImage("Mission")

export const metadata: Metadata = {
  title: "Mission | Tiles",
  description: "Bringing privacy technology to everyone.",
  openGraph: {
    title: "Mission | Tiles",
    description: "Bringing privacy technology to everyone.",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mission | Tiles",
    description: "Bringing privacy technology to everyone.",
    images: [socialImage.url],
  },
}

export default function MissionPage() {
  return <MissionContent />
}
