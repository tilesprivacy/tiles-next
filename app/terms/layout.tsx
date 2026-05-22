import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use | Tiles",
  description: "Read our Terms of Service and how it relates to you.",
  openGraph: {
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Terms of Use | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Use | Tiles",
    description: "Read our Terms of Service and how it relates to you.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
