import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { SiteFooter } from "@/components/site-footer"

const homeDescription = "Local-first AI assistant built on zero-trust principles."

export const metadata: Metadata = {
  title: "Tiles: Local-first AI assistant built on zero-trust principles",
  description: homeDescription,
  openGraph: {
    title: "Tiles: Local-first AI assistant built on zero-trust principles",
    description: homeDescription,
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles: Local-first AI assistant built on zero-trust principles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles: Local-first AI assistant built on zero-trust principles",
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
