import Link from "next/link"
import { ArrowUpRight, Check, ChevronDown, ChevronRight, Gem, Sparkle } from "lucide-react"
import { PolarSubscribeButton } from "@/components/polar-subscribe-button"
import { SiteFooter } from "@/components/site-footer"
import {
  marketingPageSectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import type { PolarCheckoutMode, PolarPaidPlanId } from "@/lib/polar"
import {
  PRICING_FAQS,
  PRICING_PAGE_FUNDING_NOTE,
  PRICING_PAGE_STATUS_BADGE,
  PRICING_PAGE_TITLE,
  PRICING_PLANS,
  type PricingFaq,
  type PricingPlan,
} from "@/lib/pricing-plans"

const mutedTextClass = "text-black/62 dark:text-white/62"

const ctaBaseClass =
  "inline-flex h-11 w-full items-center justify-center gap-1 whitespace-nowrap rounded-full px-5 text-sm font-medium leading-none !no-underline transition-colors"

const outlinedCtaClass =
  `${ctaBaseClass} border border-black/15 bg-transparent text-foreground hover:bg-black/[0.04] dark:border-white/20 dark:hover:bg-white/[0.06]`

const filledCtaClass =
  `${ctaBaseClass} bg-foreground text-background hover:opacity-90`

/**
 * Warm tint so the badge reads as time limited against an otherwise neutral
 * page. Tuned for contrast in both themes rather than picked from the palette.
 */
const statusBadgeClass =
  "inline-flex items-center gap-2 rounded-full border border-[#C98A0A]/25 bg-[#FBF0D9] px-3 py-1 text-xs font-medium text-[#8A5A00] dark:border-[#E9B949]/25 dark:bg-[#3A2E17] dark:text-[#EDC77C]"

const faqLinkClass =
  "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"

/**
 * Trailing mark on a plan action. A chevron rather than `ArrowUpRight`, which
 * this page reserves for links that leave the site in a new tab: the paid
 * actions open Polar's checkout in an overlay.
 */
function CtaChevron() {
  return (
    <ChevronRight
      className="-mr-1 h-4 w-4 shrink-0 opacity-70"
      strokeWidth={2}
      aria-hidden
    />
  )
}

/**
 * Icons for `featuresIntro`, keyed by the plan's token so the copy module stays
 * free of JSX. Sized and offset to sit in the same gutter as the check marks
 * below, so the whole list shares one left edge.
 */
const featuresIntroIcons = {
  sparkle: Sparkle,
  gem: Gem,
} as const

type PricingCheckoutModes = Record<PolarPaidPlanId, PolarCheckoutMode>

interface PricingContentProps {
  /**
   * How each paid plan's Subscribe action should behave. Resolved server side
   * in `app/pricing/page.tsx` so this component never touches `process.env`.
   */
  checkoutModes: PricingCheckoutModes
}

/**
 * Paid plan action. Opens Polar's embedded checkout when it is configured, and
 * renders disabled otherwise so the page never points at a checkout that would
 * fail.
 */
function PaidPlanCta({
  planId,
  ctaLabel,
  checkoutMode,
}: {
  planId: PolarPaidPlanId
  ctaLabel: string
  checkoutMode: PolarCheckoutMode
}) {
  if (checkoutMode.kind === "unavailable") {
    return (
      <button
        type="button"
        disabled
        className={`${ctaBaseClass} cursor-not-allowed border border-black/12 bg-transparent text-black/45 dark:border-white/15 dark:text-white/45`}
      >
        {ctaLabel}
      </button>
    )
  }

  return (
    <PolarSubscribeButton
      plan={planId}
      mode={checkoutMode}
      label={ctaLabel}
      trailingIcon={<CtaChevron />}
      className={planId === "pro" ? filledCtaClass : outlinedCtaClass}
    />
  )
}

function FaqLink({ link }: { link: NonNullable<PricingFaq["link"]> }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={faqLinkClass}
      >
        {link.label}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    )
  }

  return (
    <Link href={link.href} className={faqLinkClass}>
      {link.label}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  )
}

/**
 * One FAQ row, collapsed to its question. Native `details` so the page stays a
 * server component and the answers are still reachable with JavaScript off.
 */
function FaqItem({ faq }: { faq: PricingFaq }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
        <h3 className="text-base font-light leading-snug text-foreground">
          {faq.question}
        </h3>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-black/35 transition-transform duration-200 group-open:rotate-180 dark:text-white/35"
          strokeWidth={1.75}
          aria-hidden
        />
      </summary>
      <div className={`-mt-2 pb-5 pr-8 text-pretty text-sm leading-6 ${mutedTextClass}`}>
        <p>{faq.answer}</p>
        {faq.link ? <FaqLink link={faq.link} /> : null}
      </div>
    </details>
  )
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex gap-2.5 text-sm leading-6 text-foreground/80"
        >
          <Check
            className="mt-[0.3rem] h-3.5 w-3.5 shrink-0 text-black/30 dark:text-white/30"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

function PlanCard({
  plan,
  checkoutModes,
}: {
  plan: PricingPlan
  checkoutModes: PricingCheckoutModes
}) {
  const isPaid = plan.id !== "free"
  const FeaturesIntroIcon = plan.featuresIntroIcon
    ? featuresIntroIcons[plan.featuresIntroIcon]
    : null

  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-black/10 p-7 dark:border-white/12 lg:grid lg:grid-rows-subgrid lg:row-span-4 lg:p-8">
      <div className="flex flex-col gap-2.5">
        <h2 className="font-sans text-[1.5rem] font-semibold leading-none tracking-[-0.03em] text-foreground">
          {plan.name}
        </h2>
        {plan.tagline ? (
          <p className="text-sm leading-6 text-black/55 dark:text-white/55">
            {plan.tagline}
          </p>
        ) : null}
      </div>

      <div>
        <p className="flex items-baseline gap-0.5">
          <span className="font-sans text-[2.5rem] font-normal leading-none tracking-[-0.04em] text-foreground">
            {plan.price}
          </span>
          {plan.cadence ? (
            <span
              className={
                isPaid
                  ? "text-lg font-medium tracking-[-0.02em] text-foreground/65"
                  : "text-sm font-medium text-black/45 dark:text-white/45"
              }
            >
              {plan.cadence}
            </span>
          ) : null}
        </p>
      </div>

      <div>
        {plan.id === "free" ? (
          <Link href="/download" className={outlinedCtaClass}>
            {plan.ctaLabel}
            <CtaChevron />
          </Link>
        ) : (
          <PaidPlanCta
            planId={plan.id}
            ctaLabel={plan.ctaLabel}
            checkoutMode={checkoutModes[plan.id]}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        {plan.featuresIntro ? (
          <p className="flex gap-2.5 text-sm font-medium leading-6 text-foreground">
            {FeaturesIntroIcon ? (
              <FeaturesIntroIcon
                className="mt-[0.3rem] h-3.5 w-3.5 shrink-0 text-black/45 dark:text-white/45"
                strokeWidth={1.75}
                aria-hidden
              />
            ) : null}
            <span>{plan.featuresIntro}</span>
          </p>
        ) : null}
        <FeatureList features={plan.features} />
        {plan.footnote ? (
          <p className="mt-auto pt-8 text-xs leading-5 text-black/45 dark:text-white/45">
            {plan.footnote}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function PricingContent({ checkoutModes }: PricingContentProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-24 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-32 lg:pt-[calc(12.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mx-auto max-w-xl text-center">
            <h1 className={marketingPageTitleClass}>{PRICING_PAGE_TITLE}</h1>
            <div className="mt-5 flex justify-center">
              <span className={statusBadgeClass}>
                <span
                  className="size-1.5 rounded-full bg-[#C98A0A] dark:bg-[#E9B949]"
                  aria-hidden="true"
                />
                {PRICING_PAGE_STATUS_BADGE}
              </span>
            </div>
          </header>

          <div className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:grid-rows-[repeat(4,auto)] lg:gap-x-5 lg:gap-y-0">
            {PRICING_PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                checkoutModes={checkoutModes}
              />
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-xl text-pretty text-center text-sm leading-6 text-black/55 dark:text-white/55">
            {PRICING_PAGE_FUNDING_NOTE}
          </p>

          <section className="mt-20 lg:mt-24">
            <h2 className={marketingPageSectionTitleClass}>
              Frequently Asked Questions
            </h2>
            <div className="mt-8 border-t border-black/8 divide-y divide-black/8 dark:border-white/10 dark:divide-white/10">
              {PRICING_FAQS.map((faq) => (
                <FaqItem key={faq.question} faq={faq} />
              ))}
            </div>
          </section>

          <p className="mt-16 text-center text-xs leading-5 text-black/50 dark:text-white/50 lg:mt-20">
            By downloading or subscribing, you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms
            </Link>
            ,{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy statement
            </Link>
            , and{" "}
            <Link href="/refund-policy" className="underline underline-offset-2">
              refund policy
            </Link>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
