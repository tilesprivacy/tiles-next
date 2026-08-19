import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing-content"
import { getPolarCheckoutModes } from "@/lib/polar"
import { PRICING_PAGE_DESCRIPTION } from "@/lib/pricing-plans"

const title = "Pricing | Tiles"
const canonicalUrl = "https://www.tiles.run/pricing"
const socialImageUrl =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"
const socialImageAlt = "Tiles | Own your AI"

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
        width: 1672,
        height: 941,
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
