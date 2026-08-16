import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"
import { DownloadTilesCta } from "@/components/download-tiles-cta"
import { SiteFooter } from "@/components/site-footer"
import { POLAR_BILLING_ENABLED } from "@/lib/feature-flags"
import {
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"
import {
  marketingPageBodyClass,
  marketingPageSectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import {
  PRICING_FAQS,
  PRICING_PAGE_DESCRIPTION,
  PRICING_PAGE_TITLE,
  PRICING_PLACEHOLDER_LABEL,
  PRICING_PLACEHOLDER_NOTE,
  PRICING_PLANS,
  PRICING_SECTIONS,
  type PricingPlan,
} from "@/lib/pricing-plans"

const mutedTextClass = "text-black/62 dark:text-white/62"

const ctaBaseClass =
  "inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-[6px] px-5 text-sm font-medium leading-none !no-underline"

/**
 * Paid plan action. Stays inert while `POLAR_BILLING_ENABLED` is false, so the
 * placeholder page never sends anyone to a checkout that cannot complete.
 */
function ProPlanCta({ plan }: { plan: PricingPlan }) {
  return POLAR_BILLING_ENABLED ? (
    <a
      href="/api/polar/checkout/pro"
      className={`${ctaBaseClass} ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
    >
      {plan.ctaLabel}
    </a>
  ) : (
    <button
      type="button"
      disabled
      className={`${ctaBaseClass} cursor-not-allowed border border-black/12 bg-transparent text-black/45 dark:border-white/15 dark:text-white/45`}
    >
      {plan.ctaLabel}
    </button>
  )
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  const surfaceClass = plan.highlighted
    ? "border-black/15 bg-black/[0.03] dark:border-white/20 dark:bg-white/[0.05]"
    : "border-black/8 bg-black/[0.015] dark:border-white/10 dark:bg-white/[0.025]"

  return (
    <article
      className={`flex flex-col rounded-2xl border p-7 sm:p-8 ${surfaceClass}`}
    >
      <h2 className="font-sans text-base font-semibold tracking-[-0.01em] text-foreground">
        {plan.name}
      </h2>

      <p className="mt-4 flex items-baseline gap-2">
        <span className="font-sans text-[2.5rem] font-normal leading-none tracking-[-0.035em] text-foreground">
          {plan.price}
        </span>
        <span className="text-sm text-black/55 dark:text-white/55">
          {plan.cadence}
        </span>
      </p>

      <p className={`mt-4 text-sm leading-6 ${mutedTextClass}`}>
        {plan.tagline}
      </p>

      <p className="mt-9 text-[0.6875rem] font-medium uppercase tracking-[0.09em] text-black/45 dark:text-white/45">
        {plan.featuresIntro}
      </p>
      <ul className="mt-4 flex flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-2.5 text-sm leading-6 text-foreground/85"
          >
            <Check className="mt-[0.3rem] h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        {plan.id === "free" ? (
          <DownloadTilesCta label={plan.ctaLabel} className="w-full" />
        ) : (
          <ProPlanCta plan={plan} />
        )}
        <p className="mt-3 text-xs leading-5 text-black/50 dark:text-white/50">
          {plan.ctaNote}
        </p>
      </div>
    </article>
  )
}

export function PricingContent() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-24 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-32 lg:pt-[calc(12.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mx-auto max-w-xl text-center">
            <h1 className={marketingPageTitleClass}>{PRICING_PAGE_TITLE}</h1>
            <p className={`mt-6 ${marketingPageBodyClass}`}>
              {PRICING_PAGE_DESCRIPTION}
            </p>
            <p className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-2xl border border-dashed border-black/20 px-4 py-2.5 dark:border-white/25">
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.09em] text-foreground">
                {PRICING_PLACEHOLDER_LABEL}
              </span>
              <span className="text-xs leading-5 text-black/60 dark:text-white/60">
                {PRICING_PLACEHOLDER_NOTE}
              </span>
            </p>
          </header>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20">
            {PRICING_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <section className="mt-24 grid gap-12 border-t border-black/8 pt-14 dark:border-white/10 sm:grid-cols-2 sm:gap-14 lg:mt-28">
            {PRICING_SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className={marketingPageSectionTitleClass}>
                  {section.title}
                </h2>
                <p className={`mt-4 text-pretty text-sm leading-6 ${mutedTextClass}`}>
                  {section.body}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-20 lg:mt-24">
            <h2 className={marketingPageSectionTitleClass}>Questions</h2>
            <div className="mt-8 divide-y divide-black/8 dark:divide-white/10">
              {PRICING_FAQS.map((faq) => (
                <div key={faq.question} className="py-6 first:pt-0 last:pb-0">
                  <h3 className="text-base font-light text-foreground">
                    {faq.question}
                  </h3>
                  <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
                    {faq.answer}
                  </p>
                  {faq.link ? (
                    <Link
                      href={faq.link.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"
                    >
                      {faq.link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
