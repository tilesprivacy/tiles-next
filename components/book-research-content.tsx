import { NewsletterCta } from "@/components/newsletter-cta"
import { ResearchProjectsCarousel } from "@/components/research-projects-carousel"
import {
  getActiveResearchEntries,
  getArchivedResearchEntries,
  RESEARCH_PAGE_INTRO,
} from "@/lib/research-log"
import { marketingPageSectionTitleClass } from "@/lib/marketing-page-title-classes"

function ResearchSectionHeader({ id, title }: { id: string; title: string }) {
  return (
    <h2
      id={id}
      className={`mt-0 ${marketingPageSectionTitleClass}`}
    >
      {title}
    </h2>
  )
}

export function BookResearchContent() {
  const activeEntries = getActiveResearchEntries()
  const archivedEntries = getArchivedResearchEntries()

  return (
    <div className="book-research-page research-page-content">
      <section className="not-prose mb-10 mt-6">
        <NewsletterCta />
      </section>

      <p>{RESEARCH_PAGE_INTRO}</p>

      <section aria-labelledby="active-projects-heading" className="not-prose mt-12 lg:mt-14">
        <ResearchSectionHeader id="active-projects-heading" title="Active Projects" />
        <ResearchProjectsCarousel entries={activeEntries} />
      </section>

      <section
        aria-labelledby="archived-projects-heading"
        className="not-prose mt-12 border-t border-black/10 pt-12 dark:border-white/10 lg:mt-16 lg:pt-16"
      >
        <ResearchSectionHeader id="archived-projects-heading" title="Archived Projects" />
        <ResearchProjectsCarousel entries={archivedEntries} />
      </section>
    </div>
  )
}
