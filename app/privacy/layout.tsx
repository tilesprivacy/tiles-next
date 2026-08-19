import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"

const socialImage = getSocialImage("Privacy")

export const metadata: Metadata = {
  title: "Privacy Policy | Tiles",
  description: "Read our Privacy Policy and how it relates to you.",
  openGraph: {
    title: "Privacy Policy | Tiles",
    description: "Read our Privacy Policy and how it relates to you.",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Tiles",
    description: "Read our Privacy Policy and how it relates to you.",
    images: [socialImage.url],
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
