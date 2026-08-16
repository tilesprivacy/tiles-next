/**
 * Canonical pricing copy for `/pricing`.
 *
 * There is exactly one paid license, Tiles Pro. Plans and included services
 * stay provisional until the 0.5.0 Private Beta, which is what the placeholder
 * pill on the page communicates, but checkout itself is live.
 *
 * `components/pricing-content.tsx` reads everything from this module so the
 * copy lives in one place.
 *
 * Copy is deliberately sparse: feature entries are short scannable labels,
 * not sentences. Keep it that way when editing.
 *
 * Related sources to keep aligned when these change:
 * - `content/licenses.mdx` (the Tiles Pro license page at `/book/licenses`)
 * - `lib/polar.ts` (the Polar product Tiles Pro maps to)
 */

/** Release that firms up provisional pricing. */
export const PRICING_BETA_RELEASE = "0.5.0 Private Beta"

/** Scheduled window for that release. */
export const PRICING_BETA_WINDOW = "the last week of Q3 2026"

export const PRICING_PAGE_TITLE = "Pricing"

export const PRICING_PAGE_DESCRIPTION =
  "Tiles is free. Tiles Pro funds independent development and the services we host for you."

/** One-line notice shown as a pill under the hero. */
export const PRICING_PLACEHOLDER_NOTE = `Pricing goes live with the ${PRICING_BETA_RELEASE}, scheduled for ${PRICING_BETA_WINDOW}.`

/**
 * Shown under the paid action while checkout is not configured, which is the
 * current state: Subscribe renders disabled until Polar credentials are set.
 */
export const PRICING_CHECKOUT_UNAVAILABLE_NOTE = `Subscriptions open with the ${PRICING_BETA_RELEASE}.`

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
  /** Note under the action. */
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
      "Limited private web searches",
      "All client side features that run locally",
      "All collaboration features, including shared chats on the web",
    ],
    ctaLabel: "Download Tiles",
    ctaNote: "Available today for macOS and Linux.",
    highlighted: false,
  },
  {
    id: "pro",
    // Card heading is the short "Pro"; the license is called Tiles Pro in
    // prose, metadata, and content/licenses.mdx.
    name: "Pro",
    price: "$10",
    cadence: "per month",
    tagline: "Supports independent development and the services we host.",
    featuresIntro: "Everything in Free, plus",
    features: [
      "Unlimited private web searches",
      "Access to private cloud models",
      "Managed public relays",
      "Data backup and key recovery",
    ],
    ctaLabel: "Subscribe",
    ctaNote: "Cancel anytime. Payments handled by Polar.",
    highlighted: true,
  },
]

/** Polar customer portal, where license keys and billing live. */
export const POLAR_CUSTOMER_PORTAL_URL = "https://polar.sh/tilesprivacy/portal/"

/** Copy for `/pricing/success`, where Polar sends people after checkout. */
export const PRICING_SUCCESS = {
  title: "You're on Tiles Pro",
  description:
    "Thanks for backing independent development. Here is how to get set up.",
  steps: [
    {
      title: "Find your license key",
      body: "It is in your receipt email and in the Polar customer portal, along with renewals and billing details.",
      link: {
        label: "Open customer portal",
        href: POLAR_CUSTOMER_PORTAL_URL,
        external: true,
      },
    },
    {
      title: "Install Tiles",
      body: "Tiles runs on macOS and Linux. Everything local works straight away, with or without a key.",
      link: { label: "Download Tiles", href: "/download", external: false },
    },
    {
      title: "Activate your key",
      body: `Key activation ships with the ${PRICING_BETA_RELEASE}, scheduled for ${PRICING_BETA_WINDOW}. Your key stays valid until then, and your subscription covers the hosted services from the day they open.`,
      link: null,
    },
  ],
  footnote:
    "Need a hand, or bought by mistake? Email support@tiles.run and we will sort it out.",
} as const

export interface PricingSection {
  title: string
  body: string
}

/** Short sections stacked below the plan grid. */
export const PRICING_SECTIONS: PricingSection[] = [
  {
    title: "Independent by design",
    body: "Tiles is funded by the people who use it. No ads, no trackers, no data resale. Tiles Pro is what lets a small team keep working on it.",
  },
  {
    title: "Free stays free",
    body: "Everything that runs on your own hardware stays free, without limits. Tiles Pro covers only the services we host on your behalf.",
  },
]

export interface PricingFaq {
  question: string
  answer: string
  link?: { label: string; href: string; external?: boolean }
}

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: "Is this pricing final?",
    answer: `No. Plans and included services stay provisional until the ${PRICING_BETA_RELEASE}, scheduled for ${PRICING_BETA_WINDOW}.`,
  },
  {
    question: "Do I need an account?",
    answer: "No. Every local feature works without one.",
  },
  {
    question: "Can I use Tiles for work?",
    answer: "Yes. Tiles Pro covers commercial use. Get in touch for bulk purchases.",
    link: {
      label: "support@tiles.run",
      href: "mailto:support@tiles.run",
      external: true,
    },
  },
  {
    question: "How do I get access after paying?",
    answer:
      "Tiles Pro is a license key, issued at checkout and sent by email. There is no account to create.",
  },
  {
    question: "How do I manage my subscription?",
    answer:
      "License keys, renewals, and billing details live in the Polar customer portal.",
    link: {
      label: "Open customer portal",
      href: POLAR_CUSTOMER_PORTAL_URL,
      external: true,
    },
  },
  {
    question: "Who handles payments?",
    answer:
      "Polar acts as merchant of record on behalf of Tiles Privacy Technologies Pvt. Ltd. Your card details never reach us.",
    link: { label: "See licenses", href: "/book/licenses" },
  },
  {
    question: "Can I support the project another way?",
    answer: "Yes, sponsorships and donations go directly to the work.",
    link: { label: "Sponsor Tiles", href: "/sponsor" },
  },
]
