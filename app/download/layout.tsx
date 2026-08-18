import type { Metadata } from "next"
import { TILES_PRODUCT_DESCRIPTION } from "@/lib/product-description"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Download | Tiles",
  description: TILES_PRODUCT_DESCRIPTION,
  openGraph: {
    title: "Download | Tiles",
    description: TILES_PRODUCT_DESCRIPTION,
    url: "https://www.tiles.run/download",
    siteName: "Tiles Privacy",
    type: "website",
    images: [socialImage("Download | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download | Tiles",
    description: TILES_PRODUCT_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
