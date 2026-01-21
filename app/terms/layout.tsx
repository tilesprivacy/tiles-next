import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tiles Terms of Use",
  description: "Read our Terms of Service and how it relates to you.",
  openGraph: {
    title: "Tiles Terms of Use",
    description: "Read our Terms of Service and how it relates to you.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tiles Terms of Use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Terms of Use",
    description: "Read our Terms of Service and how it relates to you.",
    images: ["https://www.tiles.run/og-image.jpg"],
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
