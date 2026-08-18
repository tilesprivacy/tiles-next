import type { Metadata } from "next"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const metadata: Metadata = {
  title: "Privacy Policy | Tiles",
  description: "Read our Privacy Policy and how it relates to you.",
  openGraph: {
    title: "Privacy Policy | Tiles",
    description: "Read our Privacy Policy and how it relates to you.",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Privacy Policy | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Tiles",
    description: "Read our Privacy Policy and how it relates to you.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
