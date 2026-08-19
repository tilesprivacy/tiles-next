import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"

const socialImage = getSocialImage("Terms of Use")

export const metadata: Metadata = {
  title: "Terms of Use | Tiles",
  description: "Read our Terms of Service and how it relates to you.",
  openGraph: {
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    images: [socialImage.url],
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
