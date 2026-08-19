import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"

const socialImage = getSocialImage("Refund Policy")

const description =
  "Read the Tiles Refund Policy and 7-day money-back guarantee for Tiles Pro."

export const metadata: Metadata = {
  title: "Refund Policy | Tiles",
  description,
  openGraph: {
    title: "Refund Policy | Tiles",
    description,
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | Tiles",
    description,
    images: [socialImage.url],
  },
}

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
