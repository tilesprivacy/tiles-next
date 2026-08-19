import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"

const socialImage = getSocialImage("Subprocessors")

export const metadata: Metadata = {
  title: "Subprocessors | Tiles",
  description: "Third-party subprocessors that Tiles uses to provide services.",
  openGraph: {
    title: "Subprocessors | Tiles",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subprocessors | Tiles",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    images: [socialImage.url],
  },
}

export default function SubProcessorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
