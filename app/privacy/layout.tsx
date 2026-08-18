import type { Metadata } from "next"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Privacy Policy | Tiles",
  description: "Read our Privacy Policy and how it relates to you.",
  openGraph: {
    title: "Privacy Policy | Tiles",
    description: "Read our Privacy Policy and how it relates to you.",
    type: "website",
    images: [socialImage("Privacy Policy | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Tiles",
    description: "Read our Privacy Policy and how it relates to you.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
