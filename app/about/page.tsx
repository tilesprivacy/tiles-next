import type { Metadata } from "next"
import { AboutContent } from "@/components/about-content"
import { getOGImageUrl } from "@/lib/og-image-url"

export const metadata: Metadata = {
  title: "About",
  description: "Get to know Tiles Privacy, our contributors, and sponsors.",
  openGraph: {
    title: "About",
    description: "Get to know Tiles Privacy, our contributors, and sponsors.",
    type: "website",
    images: [
      {
        url: getOGImageUrl("https://www.tiles.run/api/og"),
        width: 1200,
        height: 630,
        alt: "About",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description: "Get to know Tiles Privacy, our contributors, and sponsors.",
    images: [getOGImageUrl("https://www.tiles.run/api/og")],
  },
}

export default function AboutPage() {
  return <AboutContent />
}
