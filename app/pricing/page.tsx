import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing-content"
import { isPolarCheckoutConfigured } from "@/lib/polar"
import { PRICING_PAGE_DESCRIPTION } from "@/lib/pricing-plans"

const title = "Pricing | Tiles"

export const metadata: Metadata = {
  title,
  description: PRICING_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title,
    description: PRICING_PAGE_DESCRIPTION,
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: PRICING_PAGE_DESCRIPTION,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function PricingPage() {
  // Resolved here so the client-facing component never reads process.env.
  return <PricingContent checkoutReady={isPolarCheckoutConfigured()} />
}
