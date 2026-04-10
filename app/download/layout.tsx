import type { Metadata } from "next"
import { getOGImageUrl } from "@/lib/og-image-url"

export const metadata: Metadata = {
  title: "Download Tiles",
  description: "Download Tiles, a private and secure AI assistant for everyday use",
  openGraph: {
    title: "Download Tiles",
    description: "Download Tiles, a private and secure AI assistant for everyday use",
    url: "https://www.tiles.run/download",
    siteName: "Tiles Privacy",
    type: "website",
    images: [
      {
        url: getOGImageUrl("https://www.tiles.run/api/og"),
        width: 1200,
        height: 630,
        alt: "Download Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Tiles",
    description: "Download Tiles, a private and secure AI assistant for everyday use",
    images: [getOGImageUrl("https://www.tiles.run/api/og")],
  },
}

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
