import type { Metadata } from "next"
import { PricingSuccessContent } from "@/components/pricing-success-content"
import { PRICING_SUCCESS } from "@/lib/pricing-plans"

const title = "You're on Tiles Pro | Tiles"

export const metadata: Metadata = {
  title,
  description: PRICING_SUCCESS.description,
  // Post-checkout confirmation, not a page to surface in search.
  robots: { index: false, follow: false },
}

export default function PricingSuccessPage() {
  return <PricingSuccessContent />
}
