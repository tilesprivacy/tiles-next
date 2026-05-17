import type { Metadata } from "next"
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
    "Research on decentralized software to identify useful primitives before integrating successful ideas into Tiles.",
  openGraph: {
    title: "Research | Tiles",
    description:
      "Research on decentralized software to identify useful primitives before integrating successful ideas into Tiles.",
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
      "Research on decentralized software to identify useful primitives before integrating successful ideas into Tiles.",
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
          <h1 className={`mb-6 ${marketingPageTitleClass}`}>Research</h1>

          <div className="research-page-content">
            <p className={`max-w-2xl ${marketingPageBodyClass}`}>
              Privacy adoption at scale must work backwards from preserving utility. This research explores the
              possibilities enabled by decentralized software technologies and aims to identify useful primitives before
              integrating successful ideas into Tiles.
            </p>

            <section aria-labelledby="active-projects-heading" className="mt-12 lg:mt-14">
              <ResearchSectionHeader
                id="active-projects-heading"
                title="Active Projects"
              />
              <ResearchProjectsCarousel entries={activeEntries} />
            </section>

            <section aria-labelledby="archived-projects-heading" className="mt-12 lg:mt-16">
              <ResearchSectionHeader
                id="archived-projects-heading"
                title="Archived Projects"
              />
              <ResearchProjectsCarousel entries={archivedEntries} />
            </section>
          </div>
        </div>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
