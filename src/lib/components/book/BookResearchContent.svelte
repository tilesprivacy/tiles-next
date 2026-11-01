<script lang="ts">
  import NewsletterCta from "#lib/components/NewsletterCta.svelte"
  import ResearchProjectsCarousel from "#lib/components/ResearchProjectsCarousel.svelte"
  import { marketingPageSectionTitleClass } from "#lib/marketing-page-title-classes"
  import { getActiveResearchEntries, getArchivedResearchEntries, RESEARCH_PAGE_INTRO } from "#lib/research-log"

  const sections = [
    { id: "active-projects-heading", title: "Active Projects", entries: getActiveResearchEntries(), class: "not-prose mt-12 lg:mt-14" },
    {
      id: "archived-projects-heading",
      title: "Archived Projects",
      entries: getArchivedResearchEntries(),
      class: "not-prose mt-12 border-t border-black/10 pt-12 dark:border-white/10 lg:mt-16 lg:pt-16",
    },
  ]
</script>

<div class="book-research-page research-page-content">
  <section class="not-prose mb-10 mt-6">
    <NewsletterCta />
  </section>

  <p>{RESEARCH_PAGE_INTRO}</p>

  {#each sections as section (section.id)}
    <section aria-labelledby={section.id} class={section.class}>
      <h2 id={section.id} class="mt-0 {marketingPageSectionTitleClass}">{section.title}</h2>
      <ResearchProjectsCarousel entries={section.entries} />
    </section>
  {/each}
</div>
