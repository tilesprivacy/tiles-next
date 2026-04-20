import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { SiteFooter } from "@/components/site-footer"

const homeDescription =
  "Your private and secure AI assistant for everyday use. Built as a fully user-supported, independent open-source project, based on open standards and decentralized technologies."

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
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <HomeContent />
      <SiteFooter showTryTilesCta={false} />
    </div>
  )
}
