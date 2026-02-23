import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"

export const metadata: Metadata = {
  title: "Tiles: Your private and secure AI assistant for everyday use",
  openGraph: {
    title: "Tiles",
    description: "Your private and secure AI assistant for everyday use. Developed as an independent open source project, made possible by wonderful sponsors.",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles - Your private and secure AI assistant for everyday use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles",
    description: "Your private and secure AI assistant for everyday use. Developed as an independent open source project, made possible by wonderful sponsors.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function Page() {
  return <HomeContent />
}
