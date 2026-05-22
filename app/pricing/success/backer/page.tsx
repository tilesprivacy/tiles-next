import type { Metadata } from "next"
import { PricingSuccessContent } from "@/components/pricing-success-content"

export const metadata: Metadata = {
  title: "Purchase complete | Backer | Tiles",
  description: "Your Backer purchase is complete.",
  robots: { index: false, follow: true },
}

export default function BackerPurchaseSuccessPage() {
  return <PricingSuccessContent variant="backer" />
}
