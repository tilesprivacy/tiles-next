import type { Metadata } from "next"
import { FaRss } from "react-icons/fa6"
import NewsletterForm from "@/components/newsletter-form"
import { ResearchProjectsCarousel } from "@/components/research-projects-carousel"
import { SiteFooter } from "@/components/site-footer"
import {
  getArchivedResearchEntries,
  getActiveResearchEntries,
} from "@/lib/research-log"
import {
  marketingPageBodyClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"

function ResearchSectionHeader({
  id,
  title,
}: {
  id: string
  title: string
}) {
  return (
    <div className="mb-6">
      <h2
        id={id}
        className="font-sans text-[1.55rem] font-medium leading-tight tracking-[-0.025em] text-foreground sm:text-[1.85rem] lg:text-[2.05rem]"
      >
        {title}
      </h2>
    </div>
  )
}

export const metadata: Metadata = {
  title: "Research | Tiles",
  description:
    "Progressive experiments exploring decentralized software technologies to identify the primitives needed for privacy adoption without sacrificing utility.",
  openGraph: {
    title: "Research | Tiles",
    description:
      "Progressive experiments exploring decentralized software technologies to identify the primitives needed for privacy adoption without sacrificing utility.",
    url: "https://www.tiles.run/research",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Research | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research | Tiles",
    description:
      "Progressive experiments exploring decentralized software technologies to identify the primitives needed for privacy adoption without sacrificing utility.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function ResearchPage() {
  const activeEntries = getActiveResearchEntries()
  const archivedEntries = getArchivedResearchEntries()

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-10 lg:mb-12">
            <h1 className={`mb-4 ${marketingPageTitleClass}`}>Research</h1>
            <section className="mx-auto w-full max-w-3xl pb-1">
              <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-7">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[0.95rem] font-medium tracking-tight text-black dark:text-white">
                      Stay updated
                    </h2>
                    <a
                      href="/api/rss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-black transition-colors hover:text-black/65 dark:text-[#e7e7ed] dark:hover:text-[#c6c6cf]"
                      aria-label="RSS Feed for blog posts"
                    >
                      <FaRss className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-[0.84rem] leading-6 text-black/70 dark:text-[#b8b8c2]">
                    Get updates on releases, privacy research, and performance engineering.
                  </p>
                </div>
                <NewsletterForm className="w-full lg:max-w-[24rem]" />
              </div>
            </section>
          </div>

          <div className="research-page-content border-t border-black/10 pt-6 dark:border-white/10 sm:pt-9 lg:pt-10">
            <p className={`max-w-2xl ${marketingPageBodyClass}`}>
              Privacy adoption at scale must work backwards from preserving utility. This research is a series of
              progressive experiments exploring decentralized software technologies to uncover primitives that preserve
              utility while strengthening user ownership. Successful ideas from these explorations will eventually be
              adopted into Tiles.
            </p>

            <section aria-labelledby="active-projects-heading" className="mt-12 lg:mt-14">
              <ResearchSectionHeader
                id="active-projects-heading"
                title="Active Projects"
              />
              <ResearchProjectsCarousel entries={activeEntries} />
            </section>

            <section
              aria-labelledby="archived-projects-heading"
              className="mt-12 border-t border-black/10 pt-12 dark:border-white/10 lg:mt-16 lg:pt-16"
            >
              <ResearchSectionHeader
                id="archived-projects-heading"
                title="Archived Projects"
              />
              <ResearchProjectsCarousel entries={archivedEntries} />
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
