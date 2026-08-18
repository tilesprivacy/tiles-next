import type { Metadata } from "next"
import { PricingContent } from "@/components/pricing-content"
import { getPolarCheckoutMode } from "@/lib/polar"
import { PRICING_PAGE_DESCRIPTION } from "@/lib/pricing-plans"
import {
  PRICING_SOCIAL_IMAGE_PATH,
  PRICING_SOCIAL_IMAGE_URL,
  socialImage,
} from "@/lib/social-image"

const title = "Pricing | Tiles"
const canonicalUrl = "https://www.tiles.run/pricing"
const socialImageAlt =
  "Tiles pricing with Free at $0 forever and Pro at $10 per month"

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
    images: [socialImage(socialImageAlt, PRICING_SOCIAL_IMAGE_PATH)],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tilesprivacy",
    creator: "@tilesprivacy",
    title,
    description: PRICING_PAGE_DESCRIPTION,
    images: [
      {
        url: PRICING_SOCIAL_IMAGE_URL,
        alt: socialImageAlt,
      },
    ],
  },
}

export default function PricingPage() {
  // Resolved here so the client-facing component never reads process.env.
  return <PricingContent checkoutMode={getPolarCheckoutMode()} />
}
