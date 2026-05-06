import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { SiteFooter } from "@/components/site-footer"

const homeDescription = "Local-first private AI assistant for everyday use."

export const metadata: Metadata = {
  title: "Tiles: Local-first private AI assistant for everyday use",
  description: homeDescription,
  openGraph: {
    title: "Tiles: Local-first private AI assistant for everyday use",
    description: homeDescription,
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles: Local-first private AI assistant for everyday use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles: Local-first private AI assistant for everyday use",
    description: homeDescription,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <HomeContent />
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
