import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { TILES_HOMEPAGE_DESCRIPTION, TILES_SITE_TITLE } from "@/lib/product-description"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: TILES_SITE_TITLE,
  description: TILES_HOMEPAGE_DESCRIPTION,
  openGraph: {
    title: TILES_SITE_TITLE,
    description: TILES_HOMEPAGE_DESCRIPTION,
    images: [socialImage(TILES_SITE_TITLE)],
  },
  twitter: {
    card: "summary_large_image",
    title: TILES_SITE_TITLE,
    description: TILES_HOMEPAGE_DESCRIPTION,
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function Page() {
  return <HomeContent />
}
