import type { Metadata } from "next"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const metadata: Metadata = {
  title: "Terms of Use | Tiles",
  description: "Read our Terms of Service and how it relates to you.",
  openGraph: {
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Terms of Use | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
