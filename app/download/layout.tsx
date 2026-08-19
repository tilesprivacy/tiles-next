import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"
import { TILES_PRODUCT_DESCRIPTION } from "@/lib/product-description"

const socialImage = getSocialImage("Download")

export const metadata: Metadata = {
  title: "Download | Tiles",
  description: TILES_PRODUCT_DESCRIPTION,
  openGraph: {
    title: "Download | Tiles",
    description: TILES_PRODUCT_DESCRIPTION,
    url: "https://www.tiles.run/download",
    siteName: "Tiles Privacy",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download | Tiles",
    description: TILES_PRODUCT_DESCRIPTION,
    images: [socialImage.url],
  },
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
