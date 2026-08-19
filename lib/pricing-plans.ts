/**
 * Canonical pricing copy for `/pricing`.
 *
 * There are two paid licenses, Tiles Plus and Tiles Pro. Plans and included
 * services stay provisional until the 0.5.0 Private Beta, but checkout itself
 * is live.
 *
 * `components/pricing-content.tsx` reads everything from this module so the
 * copy lives in one place.
 *
 * Copy is deliberately sparse: feature entries are short scannable labels,
 * not sentences. Keep it that way when editing.
 *
 * Related sources to keep aligned when these change:
 * - `content/licenses.mdx` (the license page at `/book/licenses`)
 * - `lib/polar.ts` (the Polar products the paid plans map to)
 */

/** Release that firms up provisional pricing. */
export const PRICING_BETA_RELEASE = "0.5.0 Private Beta"

/** Scheduled window for that release. */
export const PRICING_BETA_WINDOW = "the last week of Q3 2026"

export const PRICING_PAGE_TITLE = "Pricing"

/**
 * Badge above the status line. The prices on this page are temporary, and a
 * muted sentence read as fine print, so the badge carries that fact first and
 * the status line under it explains what changes.
 */
export const PRICING_PAGE_STATUS_BADGE = "Introductory pricing"

/**
 * Status line under the page title. Applies to every paid plan, so it sits in
 * the header rather than on an individual card. Say the increase before the
 * ship date: it is the part people need before they decide to wait. The prices
 * themselves are not repeated here, so this line cannot drift from the cards.
 */
export const PRICING_PAGE_STATUS_NOTE =
  "Lock in today's price. It increases once Tiles is stable. Features shipping Q3 2026."

/** Why the paid plans exist. Applies to every plan, so it sits in the header. */
export const PRICING_PAGE_FUNDING_NOTE =
  "Every paid plan helps keep Tiles free and funds the independent development and operation of the business."

export const PRICING_PAGE_DESCRIPTION =
  "Tiles is free. Tiles Pro funds independent development and cloud based services we host for you."

/**
 * Shown under the paid action while checkout is not configured, which is the
 * current state: Subscribe renders disabled until Polar credentials are set.
 */
export const PRICING_CHECKOUT_UNAVAILABLE_NOTE = `Subscriptions open with the ${PRICING_BETA_RELEASE}.`

export type PricingPlanId = "free" | "plus" | "pro"

export interface PricingPlan {
  id: PricingPlanId
  name: string
  /** Display price. Kept as a string so formatting stays in one place. */
  price: string
  cadence?: string
  /** One short line under the price, e.g. the Early Member lock-in. */
  priceNote?: string
  /** One short line. Not a paragraph. */
  tagline?: string
  /** Small label above the feature list. Omit on Free to match a title → price → CTA stack. */
  featuresIntro?: string
  /** Short scannable labels, one line each. */
  features: string[]
  ctaLabel: string
  /** True for Tiles Pro. The pricing OG image uses this to accent the paid card. */
  highlighted: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    tagline: "Everything that runs on your hardware.",
    features: [
      "Run open models locally",
      "Keep your data private",
      "Share chats publicly or privately on the web",
      "Extend the agent with plugins",
    ],
    ctaLabel: "Download for free",
    highlighted: false,
  },
  {
    id: "plus",
    // Card heading is the short "Plus"; the license is called Tiles Plus in
    // prose, metadata, and content/licenses.mdx.
    name: "Plus",
    price: "$3",
    cadence: "/ month",
    tagline: "Peer to peer sync and collaboration features",
    featuresIntro: "Everything in Free, plus:",
    features: [
      "Sync chats across linked devices",
      "Remote inference for local models across devices",
    ],
    ctaLabel: "Join waitlist for Plus",
    highlighted: false,
  },
  {
    id: "pro",
    // Card heading is the short "Pro"; the license is called Tiles Pro in
    // prose, metadata, and content/licenses.mdx.
    name: "Pro",
    price: "$10",
    cadence: "/ month",
    tagline: "Cloud based services we host for you.",
    featuresIntro: "Everything in Plus, and:",
    features: [
      "Run open cloud models privately",
      "Unlimited private web searches",
      "Backup and key recovery services",
    ],
    ctaLabel: "Join waitlist for Pro",
    highlighted: true,
  },
]

/** Polar customer portal, where license keys and billing live. */
export const POLAR_CUSTOMER_PORTAL_URL = "https://polar.sh/tilesprivacy/portal/"

/**
 * Which plan's success copy `/pricing/success` should render. `unknown` covers
 * the case where the checkout did not say, so the page stays truthful rather
 * than naming a plan the buyer may not be on.
 */
export type PricingSuccessPlanId = "plus" | "pro" | "unknown"

export interface PricingSuccessStep {
  title: string
  body: string
  link: { label: string; href: string; external?: boolean } | null
}

export interface PricingSuccessCopy {
  title: string
  description: string
  steps: PricingSuccessStep[]
  footnote: string
}

/**
 * Success copy for one plan. Steps 1 and 2 are identical everywhere; only the
 * title, the license name, and what the subscription covers change.
 */
function buildPricingSuccess({
  title,
  licenseName,
  coverage,
}: {
  title: string
  licenseName: string
  coverage: string
}): PricingSuccessCopy {
  return {
    title,
    description:
      "Thanks for backing independent development. Here is how to get set up.",
    steps: [
      {
        title: "Find your license key",
        body: `Your ${licenseName} key is in your receipt email and in the Polar customer portal, along with renewals and billing details.`,
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
        body: `Key activation ships with the ${PRICING_BETA_RELEASE}, scheduled for ${PRICING_BETA_WINDOW}. Your key stays valid until then, and your subscription covers ${coverage} from the day they open.`,
        link: null,
      },
    ],
    footnote:
      "Need a hand, or bought by mistake? Email support@tiles.run and we will sort it out.",
  }
}

/** Copy for `/pricing/success`, where Polar sends people after checkout. */
export const PRICING_SUCCESS: Record<PricingSuccessPlanId, PricingSuccessCopy> =
  {
    plus: buildPricingSuccess({
      title: "You're on Tiles Plus",
      licenseName: "Tiles Plus license",
      coverage: "peer to peer sync and collaboration features",
    }),
    pro: buildPricingSuccess({
      title: "You're on Tiles Pro",
      licenseName: "Tiles Pro license",
      coverage: "the hosted services",
    }),
    unknown: buildPricingSuccess({
      title: "You're subscribed",
      licenseName: "license",
      coverage: "your plan's paid features",
    }),
  }

export interface PricingFaq {
  question: string
  answer: string
  link?: { label: string; href: string; external?: boolean }
}

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: "Is this pricing final?",
    answer:
      "No. The $3 and $10 monthly prices are introductory Early Member pricing that can be locked in during the waitlist period. Once Tiles is stable, the standard prices will increase.",
  },
  {
    question: "Do I need an account?",
    answer: "No. Every local feature works without one.",
  },
  {
    question: "Can I use Tiles for work?",
    answer:
      "Yes. Commercial use is covered on every tier, including Free. Get in touch for bulk purchases.",
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
