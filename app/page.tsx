import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"

const homeDescription =
  "Customize local models and agent experiences within Tiles. Built in Rust, based on open-source specifications such as Modelfile and Open Responses API."

export const metadata: Metadata = {
  title: "Tiles: Customize local models and agent experiences",
  description: homeDescription,
  openGraph: {
    title: "Tiles",
    description: homeDescription,
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles - Customize local models and agent experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles",
    description: homeDescription,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function Page() {
  return <HomeContent />
}
