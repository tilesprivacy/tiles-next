import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing-content"

export const metadata: Metadata = {
  title: "Pricing | Tiles",
  description: "Tiles is free and 100% user-supported.",
  openGraph: {
    title: "Pricing | Tiles",
    description: "Tiles is free and 100% user-supported.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Tiles",
    description: "Tiles is free and 100% user-supported.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function PricingPage() {
  return <PricingContent />
}
