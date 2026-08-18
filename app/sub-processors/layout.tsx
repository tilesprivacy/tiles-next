import type { Metadata } from "next"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Subprocessors | Tiles",
  description: "Third-party subprocessors that Tiles uses to provide services.",
  openGraph: {
    title: "Subprocessors | Tiles",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    type: "website",
    images: [socialImage("Subprocessors | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subprocessors | Tiles",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default function SubProcessorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
