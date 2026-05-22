import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { SiteFooter } from "@/components/site-footer"
import { TILES_HOMEPAGE_DESCRIPTION, TILES_SITE_TITLE } from "@/lib/product-description"

export const metadata: Metadata = {
  title: TILES_SITE_TITLE,
  description: TILES_HOMEPAGE_DESCRIPTION,
  openGraph: {
    title: TILES_SITE_TITLE,
    description: TILES_HOMEPAGE_DESCRIPTION,
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: TILES_SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TILES_SITE_TITLE,
    description: TILES_HOMEPAGE_DESCRIPTION,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <HomeContent />
      <SiteFooter />
    </div>
  )
}
