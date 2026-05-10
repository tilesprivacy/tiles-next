import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing-content"

export const metadata: Metadata = {
  title: "Pricing | Tiles",
  description: "Optional Backer and Commercial licenses to support Tiles. Tiles is free to use without a license.",
  openGraph: {
    title: "Pricing | Tiles",
    description: "Optional Backer and Commercial licenses to support Tiles. Tiles is free to use without a license.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Pricing | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Tiles",
    description: "Optional Backer and Commercial licenses to support Tiles. Tiles is free to use without a license.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function PricingPage() {
  return <PricingContent />
}
