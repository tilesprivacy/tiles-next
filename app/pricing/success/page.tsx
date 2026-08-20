import type { Metadata } from "next"
import { PricingSuccessContent } from "@/components/pricing-success-content"
import { resolveCheckoutPlan } from "@/lib/polar-checkout-plan"
import { PRICING_SUCCESS, type PricingSuccessPlanId } from "@/lib/pricing-plans"

/**
 * Polar appends the checkout id to the success URL, and our checkout routes add
 * `plan`. Both spellings of the id are accepted since the query string differs
 * between our `{CHECKOUT_ID}` template and a dashboard-created Checkout Link.
 */
type SuccessSearchParams = Promise<{
  plan?: string | string[]
  checkoutId?: string | string[]
  checkout_id?: string | string[]
}>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

async function getPlan(
  searchParams: SuccessSearchParams | undefined,
): Promise<PricingSuccessPlanId> {
  // Some render paths (e.g. metadata generation) invoke this without search
  // params, so tolerate both a missing prop and a promise of undefined.
  const params = (await searchParams) ?? {}
  const plan = await resolveCheckoutPlan(
    first(params.plan),
    first(params.checkoutId) ?? first(params.checkout_id),
  )
  return plan ?? "unknown"
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SuccessSearchParams
}): Promise<Metadata> {
  const copy = PRICING_SUCCESS[await getPlan(searchParams)]

  return {
    title: `${copy.title} | Tiles`,
    description: copy.description,
    // Post-checkout confirmation, not a page to surface in search.
    robots: { index: false, follow: false },
  }
}

export default async function PricingSuccessPage({
  searchParams,
}: {
  searchParams?: SuccessSearchParams
}) {
  return <PricingSuccessContent plan={await getPlan(searchParams)} />
}
