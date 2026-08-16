import type { Metadata } from "next"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const metadata: Metadata = {
  title: "Subprocessors | Tiles",
  description: "Third-party subprocessors that Tiles uses to provide services.",
  openGraph: {
    title: "Subprocessors | Tiles",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Subprocessors | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subprocessors | Tiles",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function SubProcessorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
