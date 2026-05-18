import type { Metadata } from "next"
import { TILES_PRODUCT_DESCRIPTION } from "@/lib/product-description"

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
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Download | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download | Tiles",
    description: TILES_PRODUCT_DESCRIPTION,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
