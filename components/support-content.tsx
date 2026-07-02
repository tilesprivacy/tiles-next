import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowUpRight, BookOpen, Github, MessageCircle } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import {
  marketingPageBodyClass,
  marketingPageSectionTitleClass,
  marketingPageSubsectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"

const supportRoutes = [
  {
    title: "Documentation",
    description: "Install Tiles, read the manual, check Tilekit docs, and get unstuck on setup.",
    href: "/book",
    label: "Read book",
    icon: BookOpen,
    external: false,
  },
  {
    title: "GitHub Issues",
    description: "Report reproducible bugs, request features, and track fixes in the open.",
    href: "https://github.com/tilesprivacy/tiles/issues",
    label: "Open issues",
    icon: Github,
    external: true,
  },
  {
    title: "Discord",
    description: "Fast async help from users and maintainers when you need a quick route forward.",
    href: "https://go.tiles.run/discord",
    label: "Join Discord",
    icon: MessageCircle,
    external: true,
  },
]

const faqs = [
  {
    question: "What makes a bug report actionable?",
    answer:
      "Include your Tiles version, operating system version, exact output, screenshots if useful, and the shortest reproduction steps you can write. Clear reports get triaged and fixed faster.",
  },
  {
    question: "Can I request features?",
    answer:
      "Yes. Open a GitHub issue with your workflow context, current workaround, and the outcome you want. Concrete use cases help prioritize the work.",
  },
  {
    question: "Why Discord?",
    answer:
      "We're doing what we can with what we have. Since we're not trying to become a tech circlejerk, we have to meet people on their level. So come on in and help us build something better!",
  },
  {
    question: "Where can I track released fixes?",
    answer:
      "Use the releases page for shipped updates and the issue thread for implementation progress before release.",
  },
]

function SupportLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: ReactNode
  external?: boolean
}) {
  const className =
    "inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:text-black/70 hover:decoration-current dark:hover:text-white/80"

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}

export function SupportContent() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-24 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-3xl">
          <section className="w-full">
            <h1 className={marketingPageTitleClass}>Get help.</h1>
            <p className={`mt-5 max-w-2xl ${marketingPageBodyClass}`}>
              Find the shortest path from stuck to moving again.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {supportRoutes.map((route) => {
                const Icon = route.icon

                return (
                  <article
                    key={route.title}
                    className="flex flex-col justify-between rounded-xl border border-black/8 bg-black/[0.02] p-5 transition-colors dark:border-white/10 dark:bg-white/[0.03] sm:min-h-[11.5rem] sm:p-6"
                  >
                    <div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5 text-foreground dark:bg-white/10">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h2 className={`mt-4 ${marketingPageSubsectionTitleClass}`}>
                        {route.title}
                      </h2>
                      <p className="mt-2.5 text-sm leading-6 text-black/62 dark:text-white/62">
                        {route.description}
                      </p>
                    </div>
                    <div className="mt-5">
                      <SupportLink href={route.href} external={route.external}>
                        {route.label}
                      </SupportLink>
                    </div>
                  </article>
                )
              })}
            </div>

            <section className="mt-14 border-t border-black/8 pt-8 dark:border-white/10">
              <h2 className={marketingPageSectionTitleClass}>
                Support FAQ
              </h2>
              <div className="mt-7 divide-y divide-black/8 dark:divide-white/10">
                {faqs.map((faq) => (
                  <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="text-base font-light text-foreground">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-black/62 dark:text-white/62">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-7 text-sm leading-6 text-black/62 dark:text-white/62">
                <SupportLink href="/releases">Releases</SupportLink> has all versions and
                download links. <SupportLink href="/download">Download</SupportLink> has the
                latest version.{" "}
                <SupportLink href="https://status.tiles.run" external>Status</SupportLink> has
                service availability.
              </p>
            </section>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
