import Link from "next/link"
import { ArrowUpRight, Check, ChevronDown } from "lucide-react"
import { DownloadTilesCta } from "@/components/download-tiles-cta"
import { PolarSubscribeButton } from "@/components/polar-subscribe-button"
import { SiteFooter } from "@/components/site-footer"
import {
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"
import {
  marketingPageBodyClass,
  marketingPageSectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import type { PolarCheckoutMode } from "@/lib/polar"
import {
  PRICING_CHECKOUT_UNAVAILABLE_NOTE,
  PRICING_FAQS,
  PRICING_PAGE_DESCRIPTION,
  PRICING_PAGE_TITLE,
  PRICING_PLANS,
  type PricingFaq,
  type PricingPlan,
} from "@/lib/pricing-plans"

const mutedTextClass = "text-black/62 dark:text-white/62"

const ctaBaseClass =
  "inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-[6px] px-5 text-sm font-medium leading-none !no-underline"

const faqLinkClass =
  "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"

interface PricingContentProps {
  /**
   * How the Subscribe action should behave. Resolved server side in
   * `app/pricing/page.tsx` so this component never touches `process.env`.
   */
  checkoutMode: PolarCheckoutMode
}

/**
 * Paid plan action. Opens Polar's embedded checkout when it is configured, and
 * renders disabled otherwise so the page never points at a checkout that would
 * fail.
 */
function ProPlanCta({
  plan,
  checkoutMode,
}: {
  plan: PricingPlan
  checkoutMode: PolarCheckoutMode
}) {
  if (checkoutMode.kind === "unavailable") {
    return (
      <button
        type="button"
        disabled
        className={`${ctaBaseClass} cursor-not-allowed border border-black/12 bg-transparent text-black/45 dark:border-white/15 dark:text-white/45`}
      >
        {plan.ctaLabel}
      </button>
    )
  }

  return (
    <PolarSubscribeButton
      mode={checkoutMode}
      label={plan.ctaLabel}
      className={`${ctaBaseClass} ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
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

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mt-3 flex flex-col gap-2.5">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex gap-2 text-sm leading-6 text-foreground/85"
        >
          <Check className="mt-1.5 h-3 w-3 shrink-0" aria-hidden />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

function PlanCard({
  plan,
  checkoutMode,
}: {
  plan: PricingPlan
  checkoutMode: PolarCheckoutMode
}) {
  const surfaceClass = plan.highlighted
    ? "border-black/20 bg-black/[0.045] dark:border-white/25 dark:bg-white/[0.065]"
    : "border-black/8 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.025]"

  const isPro = plan.id === "pro"
  const note =
    isPro && checkoutMode.kind === "unavailable"
      ? PRICING_CHECKOUT_UNAVAILABLE_NOTE
      : plan.ctaNote

  return (
    <article
      className={`flex flex-col rounded-2xl border p-7 sm:p-8 ${surfaceClass}`}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <h2 className="font-sans text-base font-semibold tracking-[-0.01em] text-foreground">
          {plan.name}
        </h2>
        {plan.badge ? (
          <span className="rounded-full border border-black/12 px-2 py-[3px] text-[0.6875rem] font-medium leading-none text-black/55 dark:border-white/15 dark:text-white/55">
            {plan.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-4 flex items-baseline gap-2">
        <span className="font-sans text-[2.25rem] font-normal leading-none tracking-[-0.035em] text-foreground">
          {plan.price}
        </span>
        <span className="text-sm text-black/55 dark:text-white/55">
          {plan.cadence}
        </span>
      </p>
      {plan.priceNote ? (
        <p className="mt-2 text-xs leading-5 text-black/55 dark:text-white/55">
          {plan.priceNote}
        </p>
      ) : null}

      {plan.tagline ? (
        <p className="mt-3 text-sm font-medium leading-6 text-foreground/90">
          {plan.tagline}
        </p>
      ) : null}

      <p className="mt-6 text-xs font-medium text-black/40 dark:text-white/40">
        {plan.featuresIntro}
      </p>
      <FeatureList features={plan.features} />

      <div className="mt-auto pt-7">
        {isPro ? (
          <ProPlanCta plan={plan} checkoutMode={checkoutMode} />
        ) : (
          <DownloadTilesCta label={plan.ctaLabel} className="w-full" />
        )}
        <p className="mt-3 text-[0.6875rem] leading-5 text-black/45 dark:text-white/45">
          {note}
        </p>
      </div>
    </article>
  )
}

export function PricingContent({ checkoutMode }: PricingContentProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-24 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-32 lg:pt-[calc(12.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mx-auto max-w-xl text-center">
            <h1 className={marketingPageTitleClass}>{PRICING_PAGE_TITLE}</h1>
            <p className={`mt-6 ${marketingPageBodyClass}`}>
              {PRICING_PAGE_DESCRIPTION}
            </p>
          </header>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20">
            {PRICING_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} checkoutMode={checkoutMode} />
            ))}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-black/50 dark:text-white/50">
            By downloading or subscribing, you agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy statement
            </Link>
            .
          </p>

          <section className="mt-20 lg:mt-24">
            <h2 className={marketingPageSectionTitleClass}>
              Frequently Asked Questions
            </h2>
            <div className="mt-8 border-t border-black/8 divide-y divide-black/8 dark:border-white/10 dark:divide-white/10">
              {PRICING_FAQS.map((faq) => (
                <details key={faq.question} className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left text-base font-light text-foreground transition-colors hover:text-foreground/75 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/25 dark:focus-visible:outline-white/25 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 flex-1 leading-snug">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className="mt-0.5 h-4 w-4 shrink-0 text-black/40 transition-transform group-open:rotate-180 dark:text-white/40"
                      aria-hidden
                    />
                  </summary>
                  <div className={`pb-6 pr-8 text-pretty text-sm leading-6 ${mutedTextClass}`}>
                    <p>{faq.answer}</p>
                    {faq.link ? <FaqLink link={faq.link} /> : null}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
