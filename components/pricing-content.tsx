import Link from "next/link"
import { CalendarClock, Check } from "lucide-react"
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
  marketingPageSubsectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import {
  PRICING_FUNDING_NOTE,
  PRICING_PAGE_DESCRIPTION,
  PRICING_PAGE_TITLE,
  PRICING_PLACEHOLDER_BODY,
  PRICING_PLACEHOLDER_HEADING,
  PRICING_PLANS,
  type PricingPlan,
} from "@/lib/pricing-plans"

const mutedTextClass = "text-black/62 dark:text-white/62"

const ctaBaseClass =
  "inline-flex h-11 w-fit items-center justify-center whitespace-nowrap rounded-[6px] px-5 text-sm font-medium leading-none !no-underline"

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
    ? "border-black/15 bg-black/[0.035] dark:border-white/20 dark:bg-white/[0.05]"
    : "border-black/8 bg-black/[0.02] dark:border-white/10 dark:bg-white/[0.03]"

  return (
    <article
      className={`flex flex-col rounded-xl border p-6 transition-colors sm:p-7 ${surfaceClass}`}
    >
      <header>
        <h2 className={marketingPageSubsectionTitleClass}>{plan.name}</h2>
        <p className="mt-3.5 flex items-baseline gap-1.5">
          <span className="font-sans text-[2rem] font-normal leading-none tracking-[-0.03em] text-foreground">
            {plan.price}
          </span>
          {plan.cadence ? (
            <span className={`text-sm ${mutedTextClass}`}>{plan.cadence}</span>
          ) : null}
        </p>
        <p className={`mt-4 text-sm leading-6 ${mutedTextClass}`}>
          {plan.tagline}
        </p>
      </header>

      <div className="mt-6 border-t border-black/8 pt-5 dark:border-white/10">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-black/50 dark:text-white/50">
          {plan.featuresIntro}
        </p>
        <ul className="mt-4 flex flex-col gap-4">
          {plan.features.map((feature) => (
            <li key={feature.title} className="flex gap-3">
              <Check
                className="mt-[0.2rem] h-4 w-4 shrink-0 text-foreground"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-6 text-foreground">
                  {feature.title}
                </p>
                <p className={`mt-1 text-sm leading-6 ${mutedTextClass}`}>
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-7">
        {plan.id === "free" ? (
          <DownloadTilesCta label={plan.ctaLabel} />
        ) : (
          <ProPlanCta plan={plan} />
        )}
        <p className="mt-3 text-xs leading-5 text-black/55 dark:text-white/55">
          {plan.ctaNote}
        </p>
      </div>
    </article>
  )
}

export function PricingContent() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-24 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-3xl">
          <section className="w-full">
            <h1 className={marketingPageTitleClass}>{PRICING_PAGE_TITLE}</h1>
            <p className={`mt-5 max-w-2xl ${marketingPageBodyClass}`}>
              {PRICING_PAGE_DESCRIPTION}
            </p>

            <aside className="mt-8 flex gap-3.5 rounded-xl border border-dashed border-black/15 bg-black/[0.015] p-5 dark:border-white/20 dark:bg-white/[0.02]">
              <CalendarClock
                className="mt-[0.15rem] h-4 w-4 shrink-0 text-foreground"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-6 text-foreground">
                  {PRICING_PLACEHOLDER_HEADING}
                </p>
                <p className={`mt-1 text-sm leading-6 ${mutedTextClass}`}>
                  {PRICING_PLACEHOLDER_BODY}
                </p>
              </div>
            </aside>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5">
              {PRICING_PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>

            <section className="mt-14 border-t border-black/8 pt-8 dark:border-white/10">
              <h2 className={marketingPageSectionTitleClass}>
                Why there is a paid plan
              </h2>
              <p className={`mt-5 text-sm leading-6 ${mutedTextClass}`}>
                {PRICING_FUNDING_NOTE}
              </p>
              <p className={`mt-4 text-sm leading-6 ${mutedTextClass}`}>
                Tiles stays free to use without limits on your own hardware. The
                Pro plan covers services we host on your behalf, so the cost
                tracks what we actually run for you.
              </p>
              <p className={`mt-6 text-sm leading-6 ${mutedTextClass}`}>
                <span className="block">
                  <Link
                    href="/book/licenses"
                    className="font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"
                  >
                    Licenses
                  </Link>{" "}
                  covers the Backer and Commercial licenses for individuals and
                  teams.
                </span>
                <span className="block">
                  <Link
                    href="/sponsor"
                    className="font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"
                  >
                    Sponsor
                  </Link>{" "}
                  is how you can support the project directly today.
                </span>
              </p>
            </section>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
