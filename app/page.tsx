import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"

const homeDescription =
  "Your private and secure AI assistant for everyday use. Developed as an independent open source project, made possible by wonderful sponsors."

export const metadata: Metadata = {
  title: "Tiles: Your private and secure Al assistant for everyday use",
  description: homeDescription,
  openGraph: {
    title: "Tiles: Your private and secure Al assistant for everyday use",
    description: homeDescription,
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles: Your private and secure Al assistant for everyday use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles: Your private and secure Al assistant for everyday use",
    description: homeDescription,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function Page() {
  return <HomeContent />
}
