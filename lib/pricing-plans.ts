/**
 * Canonical pricing copy for `/pricing`.
 *
 * The page is a placeholder until the 0.5.0 Private Beta, so plan names,
 * prices, and limits here are provisional and nothing is billable yet.
 * `components/pricing-content.tsx` reads everything from this module so the
 * copy lives in one place.
 *
 * Copy is deliberately sparse: feature entries are short scannable labels,
 * not sentences. Keep it that way when editing.
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
  "Tiles is free. A paid plan funds independent development and the services we host for you."

/** Short badge label on the placeholder notice. */
export const PRICING_PLACEHOLDER_LABEL = "Placeholder"

/** One-line placeholder notice shown under the hero. */
export const PRICING_PLACEHOLDER_NOTE = `Pricing goes live with the ${PRICING_BETA_RELEASE}, scheduled for ${PRICING_BETA_WINDOW}.`

export type PricingPlanId = "free" | "pro"

export interface PricingPlan {
  id: PricingPlanId
  name: string
  /** Display price. Kept as a string so formatting stays in one place. */
  price: string
  cadence: string
  /** One short line. Not a paragraph. */
  tagline: string
  /** Small label above the feature list. */
  featuresIntro: string
  /** Short scannable labels, one line each. */
  features: string[]
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
    tagline: "Everything that runs on your own hardware.",
    featuresIntro: "Included",
    features: [
      "All client side features that run locally",
      "All collaboration features, including shared chats on the web",
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
    tagline: "Supports independent development and the services we host.",
    featuresIntro: "Everything in Free, plus",
    features: [
      "Unlimited private web search",
      "Access to private cloud models",
      "Managed public relays",
      "Data backup and key recovery",
    ],
    ctaLabel: "Subscribe",
    ctaNote: `Opens with the ${PRICING_BETA_RELEASE}.`,
    highlighted: true,
  },
]

export interface PricingSection {
  title: string
  body: string
}

/** Short sections stacked below the plan grid. */
export const PRICING_SECTIONS: PricingSection[] = [
  {
    title: "Independent by design",
    body: "Tiles is funded by the people who use it. No ads, no trackers, no data resale. Paid plans are what let a small team keep working on it.",
  },
  {
    title: "Free stays free",
    body: "Everything that runs on your own hardware stays free, without limits. Pro covers only the services we host on your behalf.",
  },
]

export interface PricingFaq {
  question: string
  answer: string
  link?: { label: string; href: string }
}

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: "When does billing start?",
    answer: `With the ${PRICING_BETA_RELEASE}, scheduled for ${PRICING_BETA_WINDOW}. Nothing is billable until then.`,
  },
  {
    question: "Do I need an account?",
    answer: "No. Every local feature works without one.",
  },
  {
    question: "Is there a plan for teams?",
    answer: "Backer and Commercial licenses cover individuals and organizations.",
    link: { label: "See licenses", href: "/book/licenses" },
  },
  {
    question: "Can I support the project another way?",
    answer: "Yes, sponsorships and donations go directly to the work.",
    link: { label: "Sponsor Tiles", href: "/sponsor" },
  },
]
