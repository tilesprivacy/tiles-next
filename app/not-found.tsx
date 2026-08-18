import type { Metadata } from "next"
import { NotFoundContent } from "@/components/not-found-content"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

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
    images: [socialImage("Page not found | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page not found | Tiles",
    description: "The page you requested could not be found.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function NotFound() {
  return <NotFoundContent />
}
