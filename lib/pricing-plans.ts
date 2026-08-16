/**
 * Canonical pricing copy for `/pricing`.
 *
 * The page is a placeholder until the 0.5.0 Private Beta, so plan names,
 * prices, and limits here are provisional and nothing is billable yet.
 * `components/pricing-content.tsx` reads everything from this module so the
 * copy lives in one place.
 *
 * Related sources to keep aligned when these change:
 * - `content/licenses.mdx` (Backer and Commercial licenses at `/book/licenses`)
 * - `lib/polar.ts` (the Polar product each paid plan maps to)
 */

/** Release that turns this page from a placeholder into real pricing. */
export const PRICING_BETA_RELEASE = "0.5.0 Private Beta"

/** Scheduled window for that release. */
export const PRICING_BETA_WINDOW = "the last week of Q3 2026"

export const PRICING_PAGE_TITLE = "Pricing"

export const PRICING_PAGE_DESCRIPTION =
  "Tiles is free to use. A paid plan supports independent development and covers the private services we run for you."

export const PRICING_PLACEHOLDER_HEADING = "This page is a placeholder"

export const PRICING_PLACEHOLDER_BODY = `Plans, prices, and limits are provisional until the ${PRICING_BETA_RELEASE}, scheduled for ${PRICING_BETA_WINDOW}. Nothing is billable yet and checkout is not open.`

export type PricingPlanId = "free" | "pro"

export interface PricingPlanFeature {
  title: string
  description: string
}

export interface PricingPlan {
  id: PricingPlanId
  name: string
  /** Display price. Kept as a string so "Free" and "$10" share one field. */
  price: string
  /** Cadence shown next to the price, or null when there is nothing to bill. */
  cadence: string | null
  tagline: string
  /** Short line above the feature list, for example "Everything in Free, plus". */
  featuresIntro: string
  features: PricingPlanFeature[]
  /** Label for the plan action. Inert while billing is disabled. */
  ctaLabel: string
  /** Note under the action explaining current availability. */
  ctaNote: string
  /** Draws the accent border on the paid plan. */
  highlighted: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline:
      "Everything that runs on your own hardware, plus the collaboration features built on the Atmosphere.",
    featuresIntro: "Included at no cost",
    features: [
      {
        title: "All client side features",
        description:
          "Every feature that runs locally on your device, including local models, private chats, plugins, and offline use. No account required.",
      },
      {
        title: "All collaboration features",
        description:
          "Share chats on the web, publish to your own identity, and use every collaboration feature built on the AT Protocol.",
      },
    ],
    ctaLabel: "Download Tiles",
    ctaNote: "Available today for macOS and Linux.",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$10",
    cadence: "per month",
    tagline:
      "Supports independent development and covers the private services we host so you do not have to run them yourself.",
    featuresIntro: "Everything in Free, plus",
    features: [
      {
        title: "Unlimited private web search",
        description:
          "Search the web from Tiles without query limits, proxied so results reach you without your searches being tied back to you.",
      },
      {
        title: "Private cloud models",
        description:
          "Access larger models we run in a privacy preserving cloud for work your device cannot handle on its own.",
      },
      {
        title: "Managed public relays",
        description:
          "We run and maintain the public relays that sync your devices, so peer-to-peer sync keeps working without self-hosting.",
      },
      {
        title: "Data backup and key recovery",
        description:
          "Encrypted backups of your data and a recovery path for your keys, so a lost device does not mean lost history.",
      },
    ],
    ctaLabel: "Subscribe",
    ctaNote: `Opens with the ${PRICING_BETA_RELEASE}.`,
    highlighted: true,
  },
]

/** Closing note under the plan grid. */
export const PRICING_FUNDING_NOTE =
  "Tiles is built by a small independent team. Paid plans and licenses are what let maintainers work on the project sustainably, without advertising or data collection as a business model."
