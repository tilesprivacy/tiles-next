import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing-content"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Tiles pricing and optional support licenses.",
  openGraph: {
    title: "Pricing",
    description: "Tiles pricing and optional support licenses.",
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
    title: "Pricing",
    description: "Tiles pricing and optional support licenses.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function PricingPage() {
  return <PricingContent />
}
