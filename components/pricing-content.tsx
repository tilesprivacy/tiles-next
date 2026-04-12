import Link from "next/link"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"

type PricingPlan = {
  name: string
  description: string
  price: string
  cadence: string
  ctaLabel: string
  ctaHref: string
  learnMoreHref: string
  features: string[]
  note?: string
}

type PricingFaq = {
  question: string
  answer: string
}

const plans: PricingPlan[] = [
  {
    name: "Backer",
    description: "For individual supporters",
    price: "$50",
    cadence: "One-time payment",
    ctaLabel: "Support Tiles",
    ctaHref: "https://buy.polar.sh/polar_cl_UaSG3EKkZRlrPdoeCThS8emJvA7eOCcCHyjdZ1uXyAW",
    learnMoreHref: "/mission",
    features: ["Early access to beta versions", "Support development and infrastructure costs", "Priority feature development"],
  },
  {
    name: "Commercial",
    description: "For teams and organizations",
    price: "$100",
    cadence: "Per user, per year",
    ctaLabel: "Support Tiles",
    ctaHref: "https://buy.polar.sh/polar_cl_acVtj1bKcYElIOYc7EuQSJuT9fzwSKHf0Gpd20jDseq",
    learnMoreHref: "/about",
    features: ["Support development and infrastructure costs", "Become a featured organization"],
    note: "For bulk purchases and other inquiries, contact us at support@tiles.run",
  },
]

const faqs: PricingFaq[] = [
  {
    question: "Do I have to pay for commercial use?",
    answer:
      "No. You are not required to pay for a commercial license. If you use Tiles for work in an organization, we encourage you to purchase a commercial license to keep Tiles independent and fully user-supported.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Backer licenses and Commercial licenses are non-refundable.",
  },
  {
    question: "Do you store, access, or process user data?",
    answer:
      "Tiles is your private and secure AI assistant for everyday use. You can use our apps without sharing personal information, and your data is stored locally on your device. Our apps do not collect telemetry data, and we never sell user data.",
  },
  {
    question: "What benefits does the Backer license grant?",
    answer:
      "Backer members receive early access to beta versions, directly support development, and help prioritize feature development. Backer support helps keep Tiles fully user-supported and independent from investor influence.",
  },
]

export function PricingContent() {
  const backerProductId = process.env.POLAR_BACKER_PRODUCT_ID
  const commercialProductId = process.env.POLAR_COMMERCIAL_PRODUCT_ID
  const checkoutPlans = plans.map((plan) => {
    if (plan.name === "Backer" && backerProductId) {
      return {
        ...plan,
        ctaHref: `/api/polar/checkout/backer?products=${encodeURIComponent(backerProductId)}`,
      }
    }

    if (plan.name === "Commercial" && commercialProductId) {
      return {
        ...plan,
        ctaHref: `/api/polar/checkout/commercial?products=${encodeURIComponent(commercialProductId)}`,
      }
    }

    return plan
  })

  const cardClass =
    "flex min-h-[540px] flex-col rounded-2xl border border-border bg-card p-8 text-card-foreground shadow-none"
  const primaryCardButtonClass =
    `inline-flex h-12 w-full items-center justify-center rounded-[10px] px-4 text-base font-medium transition-opacity hover:opacity-95 ${themeAwareHeaderPrimaryCtaClasses}`
  const secondaryCardButtonClass =
    "inline-flex h-12 w-full items-center justify-center rounded-[10px] border border-border bg-secondary px-4 text-base font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col pb-16 pt-[calc(8.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(10rem+env(safe-area-inset-top,0px))] lg:pb-20 lg:pt-[calc(12rem+env(safe-area-inset-top,0px))]">
        <section className="px-4 sm:px-6 lg:px-12">
          <div className="mx-auto w-full max-w-4xl space-y-16 lg:space-y-20">
            <div className="space-y-5 pt-4 text-center sm:pt-8 lg:pt-10">
              <h1 className="inline-block text-4xl font-semibold tracking-tight text-foreground underline decoration-emerald-500 decoration-[4px] underline-offset-[8px] sm:text-5xl">
                Free without limits.
              </h1>
              <p className="mx-auto max-w-xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                No sign-up required.
                <br />
                No strings attached.
              </p>
            </div>

            <div className="space-y-3 border-t border-border pt-10 text-center lg:pt-12">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                100% user-supported.
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Optional licenses help support the independent development of Tiles.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {checkoutPlans.map((plan) => (
                <article
                  key={plan.name}
                  className={cardClass}
                >
                  <h3 className="text-[1.9rem] font-semibold tracking-tight text-card-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-7 flex items-end gap-2">
                    <p className="text-6xl font-semibold leading-none text-card-foreground">{plan.price}</p>
                    <p className="pb-1 text-xl uppercase tracking-wide text-muted-foreground">USD</p>
                  </div>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{plan.cadence}</p>
                  <div className="mt-8 space-y-2.5">
                    <a
                      href={plan.ctaHref}
                      target={plan.ctaHref.startsWith("http") ? "_blank" : undefined}
                      rel={plan.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={primaryCardButtonClass}
                    >
                      {plan.ctaLabel}
                    </a>
                    <Link
                      href={plan.learnMoreHref}
                      className={secondaryCardButtonClass}
                    >
                      Learn more
                    </Link>
                  </div>
                  <div className="mt-9 flex flex-1 flex-col">
                    <ul className="space-y-3 text-[1.05rem] leading-relaxed text-card-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.note && (
                      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                        For bulk purchases and other inquiries, contact us at{" "}
                        <a href="mailto:support@tiles.run" className="underline underline-offset-2 text-foreground hover:opacity-80">
                          support@tiles.run
                        </a>
                        .
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <section className="space-y-6 border-t border-border pt-8" aria-labelledby="pricing-faq">
              <div className="space-y-2 text-left">
                <h2 id="pricing-faq" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  FAQ
                </h2>
                <p className="text-base text-muted-foreground sm:text-lg">Frequently asked questions about pricing</p>
              </div>

              <div className="max-w-3xl divide-y divide-border border-y border-border">
                {faqs.map((faq, faqIndex) => (
                  <details key={faq.question} className="group py-5" open={faqIndex === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 pr-1 text-xl font-semibold tracking-tight text-foreground marker:content-[''] sm:text-2xl">
                      <span>{faq.question}</span>
                      <ChevronDown
                        className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    </summary>
                    <p className="mt-3 max-w-3xl text-left text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                More questions? Email{" "}
                <a href="mailto:support@tiles.run" className="underline underline-offset-2 transition-opacity hover:opacity-80">
                  support@tiles.run
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </main>

      <section
        className="bg-background px-4 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-3 lg:px-12 lg:pb-14 lg:pt-4"
        aria-label="Tiles wordmark"
      >
        <div className="mx-auto flex max-w-6xl justify-center">
          <Image
            src="/tiles_banner_outline_blk.svg"
            alt="Tiles"
            width={1200}
            height={220}
            className="h-auto w-full max-w-lg min-[390px]:max-w-xl sm:max-w-2xl lg:max-w-3xl dark:hidden"
          />
          <Image
            src="/tiles_banner_outline_wht.svg"
            alt="Tiles"
            width={1200}
            height={220}
            className="hidden h-auto w-full max-w-lg min-[390px]:max-w-xl sm:max-w-2xl lg:max-w-3xl dark:block"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
