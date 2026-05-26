import type { Metadata } from "next"
import { NewsletterCta } from "@/components/newsletter-cta"
import { ResearchProjectsCarousel } from "@/components/research-projects-carousel"
import { SiteFooter } from "@/components/site-footer"
import {
  getArchivedResearchEntries,
  getActiveResearchEntries,
  RESEARCH_PAGE_INTRO,
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
  description: RESEARCH_PAGE_INTRO,
  openGraph: {
    title: "Research | Tiles",
    description: RESEARCH_PAGE_INTRO,
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
    description: RESEARCH_PAGE_INTRO,
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
              <NewsletterCta />
            </section>
          </div>

          <div className="research-page-content border-t border-black/10 pt-6 dark:border-white/10 sm:pt-9 lg:pt-10">
            <p className={`max-w-2xl ${marketingPageBodyClass}`}>{RESEARCH_PAGE_INTRO}</p>

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
