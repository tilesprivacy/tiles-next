import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import {
  marketingPageBodyClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import {
  PRICING_SUCCESS,
  type PricingSuccessPlanId,
} from "@/lib/pricing-plans"

const mutedTextClass = "text-black/62 dark:text-white/62"

const linkClass =
  "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"

/**
 * Post-checkout confirmation. The copy is per plan, resolved server side in
 * `app/pricing/success/page.tsx`.
 */
export function PricingSuccessContent({
  plan,
}: {
  plan: PricingSuccessPlanId
}) {
  const copy = PRICING_SUCCESS[plan]

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-24 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-32 lg:pt-[calc(12.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-2xl">
          <header className="mx-auto max-w-xl text-center">
            <h1 className={marketingPageTitleClass}>{copy.title}</h1>
            <p className={`mt-6 ${marketingPageBodyClass}`}>
              {copy.description}
            </p>
          </header>

          <ol className="mt-16 flex flex-col gap-10 lg:mt-20">
            {copy.steps.map((step, index) => (
              <li key={step.title} className="flex gap-5">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/12 text-xs font-medium text-foreground dark:border-white/15"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="font-sans text-base font-semibold tracking-[-0.01em] text-foreground">
                    {step.title}
                  </h2>
                  <p
                    className={`mt-2 text-pretty text-sm leading-6 ${mutedTextClass}`}
                  >
                    {step.body}
                  </p>
                  {step.link ? (
                    step.link.external ? (
                      <a
                        href={step.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {step.link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    ) : (
                      <Link href={step.link.href} className={linkClass}>
                        {step.link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    )
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <p
            className={`mt-16 border-t border-black/8 pt-8 text-sm leading-6 dark:border-white/10 ${mutedTextClass}`}
          >
            {copy.footnote}
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
