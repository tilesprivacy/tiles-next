import type { Metadata } from "next"
import { PricingSuccessContent } from "@/components/pricing-success-content"

export const metadata: Metadata = {
  title: "Purchase complete | Commercial | Tiles",
  description: "Your Commercial license purchase is complete.",
  robots: { index: false, follow: true },
}

export default function CommercialPurchaseSuccessPage() {
  return <PricingSuccessContent variant="commercial" />
}
