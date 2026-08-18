import type { Metadata } from "next"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Terms of Use | Tiles",
  description: "Read our Terms of Service and how it relates to you.",
  openGraph: {
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    type: "website",
    images: [socialImage("Terms of Use | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
