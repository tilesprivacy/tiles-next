import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing-content"
import { getPolarCheckoutModes } from "@/lib/polar"
import { PRICING_PAGE_DESCRIPTION } from "@/lib/pricing-plans"

const title = "Pricing | Tiles"
const canonicalUrl = "https://www.tiles.run/pricing"
// The plans render into this card, so it stays in step with the page.
const socialImageUrl = "/api/og/pricing"
const socialImageAlt = "Tiles pricing: Free, Plus, and Pro"

export const metadata: Metadata = {
  title,
  description: PRICING_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title,
    description: PRICING_PAGE_DESCRIPTION,
    url: canonicalUrl,
    siteName: "Tiles Privacy",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: socialImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tilesprivacy",
    creator: "@tilesprivacy",
    title,
    description: PRICING_PAGE_DESCRIPTION,
    images: [
      {
        url: socialImageUrl,
        alt: socialImageAlt,
      },
    ],
  },
}

export default function PricingPage() {
  // Resolved here so the client-facing component never reads process.env.
  return <PricingContent checkoutModes={getPolarCheckoutModes()} />
}
