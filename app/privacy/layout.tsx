import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tiles Privacy Policy",
  description: "Read our Privacy Policy and how it relates to you.",
  openGraph: {
    title: "Tiles Privacy Policy",
    description: "Read our Privacy Policy and how it relates to you.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Privacy Policy",
    description: "Read our Privacy Policy and how it relates to you.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
