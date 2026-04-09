import type { Metadata } from "next"
import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About Us",
  description: "Get to know Tiles Privacy, our contributors, and sponsors.",
  openGraph: {
    title: "About Us",
    description: "Get to know Tiles Privacy, our contributors, and sponsors.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "About Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description: "Get to know Tiles Privacy, our contributors, and sponsors.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function AboutPage() {
  return <AboutContent />
}
