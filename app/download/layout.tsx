import type { Metadata } from "next"
import { TILES_PRODUCT_DESCRIPTION } from "@/lib/product-description"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

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
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Download | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download | Tiles",
    description: TILES_PRODUCT_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
