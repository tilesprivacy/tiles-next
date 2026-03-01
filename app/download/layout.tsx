import type { Metadata } from "next"

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
        url: "https://www.tiles.run/api/og",
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
