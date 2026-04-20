import Link from "next/link"
import Script from "next/script"
import { Check, ChevronDown } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { PolarEmbeddedCheckoutLink } from "@/components/polar-embedded-checkout-link"
import { Button } from "@/components/ui/button"
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
    description: "For hobbyists, students, and non-profits",
    price: "$50",
    cadence: "One-time payment",
    ctaLabel: "Support Tiles",
    ctaHref: "https://buy.polar.sh/polar_cl_UaSG3EKkZRlrPdoeCThS8emJvA7eOCcCHyjdZ1uXyAW",
    learnMoreHref: "/book/licenses#backer",
    features: [
      "Managed public relays for sync",
      "Support development and relay infrastructure",
      "Help shape our roadmap priorities",
      "Valid for up to 5 devices",
      "Community support channel",
    ],
  },
  {
    name: "Commercial",
    description: "For professionals, teams, and companies",
    price: "$100",
    cadence: "Per user, per year",
    ctaLabel: "Support Tiles",
    ctaHref: "https://buy.polar.sh/polar_cl_acVtj1bKcYElIOYc7EuQSJuT9fzwSKHf0Gpd20jDseq",
    learnMoreHref: "/book/licenses#commercial",
    features: [
      "Self-hosted relays for sync",
      "Featured organization status",
      "Priority support channel",
      "Valid for up to 5 devices",
    ],
    note: "For bulk purchases and other inquiries, contact us at support@tiles.run",
  },
]

const faqs: PricingFaq[] = [
  {
    question: "Do I need a license to use Tiles?",
    answer:
      "No. Licenses are optional. The Backer license is a one-time purchase meant for hobbyists, students, non-profits, and other non-commercial supporters who want to help fund Tiles. If you use Tiles for work in an organization, we encourage you to purchase a commercial license to keep Tiles independent and fully user-supported. Commercial licenses are renewed yearly.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Backer licenses and Commercial licenses are non-refundable.",
  },
  {
    question: "Do you support regional purchase parity discounts?",
    answer:
      "Yes. We support regional purchase parity discount codes for eligible buyers.",
  },
  {
    question: "How many devices can I use with one license?",
    answer:
      "Each license is valid for up to 5 devices. You do not need to purchase the license again when you move to a new device, as long as you first de-activate it on your old device and then re-activate it on the new one.",
  },
  {
    question: "Can I transfer my license to another device?",
    answer:
      "Yes. Simply de-activate the license on your old devices, then re-activate it on your new devices. License transfers do not require a new purchase, provided you stay within the 5-device limit for that license.",
  },
  {
    question: "Do you store, access, or process user data?",
    answer:
      "Tiles is your private and secure AI assistant for everyday use. You can use our apps without sharing personal information, and your data is stored locally on your device. Our apps do not collect telemetry data, and we never sell user data.",
  },
  {
    question: "How can I tell whether my license is active?",
    answer:
      "After you activate a license, Tiles shows a Licensed badge in the interface. If no license is active, the interface shows Unlicensed instead.",
  },
  {
    question: "What do development and infrastructure costs support?",
    answer:
      "Development support funds core contributors working on Tiles’ core engineering and applied research. Infrastructure support covers the operation of relay infrastructure used for peer-to-peer connectivity, specifically Iroh public relays, which forward end-to-end encrypted traffic only when direct peer-to-peer connections cannot be established or are impractical. Infrastructure support also covers CDN hosting costs for model distribution and installer builds.",
  },
]

export function PricingContent() {
  const cardClass =
    "flex min-h-[500px] flex-col rounded-sm border border-border bg-card p-6 text-card-foreground shadow-none sm:p-7"
  const primaryCardButtonClass =
    `h-10 w-full rounded-sm px-5 text-sm sm:text-base ${themeAwareHeaderPrimaryCtaClasses}`
  const secondaryCardButtonClass =
    "h-10 w-full rounded-sm border-border bg-secondary px-5 text-sm text-secondary-foreground hover:bg-secondary/80 sm:text-base"

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <Script src="https://www.evendeals.com/banner.js" strategy="beforeInteractive" />
      <main className="flex flex-1 flex-col pb-16 pt-[calc(8.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(10rem+env(safe-area-inset-top,0px))] lg:pb-20 lg:pt-[calc(12rem+env(safe-area-inset-top,0px))]">
        <section className="px-4 sm:px-6 lg:px-12">
          <div className="mx-auto w-full max-w-4xl space-y-14 lg:space-y-16">
            <div className="space-y-3 pt-4 text-center sm:space-y-4 sm:pt-8 lg:pt-10">
              <h1 className="inline-block text-3xl font-bold tracking-tight text-foreground underline decoration-emerald-500 decoration-[4px] underline-offset-[8px] sm:text-4xl">
                Free without limits.
              </h1>
              <p className="mx-auto max-w-xl text-xl font-semibold leading-snug text-foreground/90 sm:text-2xl">
                No sign-up required.
                <br />
                No strings attached.
              </p>
            </div>

            <div className="space-y-2 pt-8 text-center lg:pt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                100% user-supported.
              </h2>
              <p className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-foreground/80 sm:text-xl">
                Optional licenses help support the independent development of Tiles.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {plans.map((plan) => (
                <article
                  key={plan.name}
                  className={cardClass}
                >
                  <h3 className="text-[1.75rem] font-semibold tracking-tight text-card-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm font-normal tracking-[0.03em] text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-end gap-2">
                    <p className="text-5xl font-bold tabular-nums leading-none text-card-foreground sm:text-[3.25rem]">{plan.price}</p>
                    <p className="pb-1 text-sm font-medium tracking-[0.08em] text-muted-foreground">USD</p>
                  </div>
                  <p className="mt-3 text-base font-normal leading-relaxed text-muted-foreground">{plan.cadence}</p>
                  <div className="mt-7 space-y-2.5">
                    <Button
                      asChild
                      size="lg"
                      className={primaryCardButtonClass}
                    >
                      <PolarEmbeddedCheckoutLink
                        href={plan.ctaHref}
                      >
                        {plan.ctaLabel}
                      </PolarEmbeddedCheckoutLink>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      size="lg"
                      className={secondaryCardButtonClass}
                    >
                      <Link href={plan.learnMoreHref}>
                        Learn more
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-8 flex flex-1 flex-col">
                    <ul className="space-y-3 text-base leading-relaxed text-card-foreground">
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

            <section className="space-y-5 border-t border-border pt-8" aria-labelledby="pricing-faq">
              <div className="space-y-2 text-left">
                <h2 id="pricing-faq" className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  FAQ
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">Frequently asked questions about pricing</p>
              </div>

              <div className="w-full divide-y divide-border border-y border-border">
                {faqs.map((faq, faqIndex) => (
                  <details key={faq.question} className="group py-4 sm:py-5" open={faqIndex === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-3 pr-1 text-lg font-medium tracking-tight text-foreground marker:content-[''] sm:text-xl">
                      <span>{faq.question}</span>
                      <ChevronDown
                        className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                        strokeWidth={1.8}
                        aria-hidden
                      />
                    </summary>
                    <p className="mt-3 text-left text-sm leading-relaxed text-muted-foreground sm:text-base">
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

      <SiteFooter />
    </div>
  )
}
