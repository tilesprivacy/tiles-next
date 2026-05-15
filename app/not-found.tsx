import type { Metadata } from "next"
import { NotFoundContent } from "@/components/not-found-content"

export const metadata: Metadata = {
  title: "Page not found | Tiles",
  description: "The page you requested could not be found.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Page not found | Tiles",
    description: "The page you requested could not be found.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Page not found | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page not found | Tiles",
    description: "The page you requested could not be found.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function NotFound() {
  return <NotFoundContent />
}
