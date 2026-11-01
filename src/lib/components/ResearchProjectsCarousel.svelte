<script lang="ts">
  import { getResearchAuthors } from "#lib/research-authors"
  import { formatResearchListingMonthYear, type ResearchLogEntry } from "#lib/research-log"
  import BlogAuthorDisplayName from "./BlogAuthorDisplayName.svelte"
  import PersonAvatar from "./PersonAvatar.svelte"
  import ResearchBadge from "./ResearchBadge.svelte"

  let { entries }: { entries: ResearchLogEntry[] } = $props()
</script>

{#each entries as entry (entry.id)}
  <a href="/research/{entry.id}" class="group block">
    <article class="py-6 sm:py-9">
      <div class="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mb-5">
        <span class="font-mono text-[0.78rem] tabular-nums text-black/52 dark:text-white/52 sm:text-[0.84rem]">
          {formatResearchListingMonthYear(entry.logMonth)}
        </span>
        {#if entry.badge}<ResearchBadge badge={entry.badge} />{/if}
      </div>

      <h3 class="text-[1.375rem] font-normal leading-[1.25] tracking-[-0.0125em] text-black/90 transition-colors group-hover:text-black/72 dark:text-white/90 dark:group-hover:text-white/76 lg:text-[1.625rem]">
        {entry.title}
      </h3>

      <p class="mt-3 line-clamp-3 text-[0.92rem] leading-6 text-black/60 dark:text-white/60 sm:line-clamp-2 sm:text-[0.98rem] sm:leading-7">
        {entry.description}
      </p>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 pt-5 text-xs text-black/45 dark:text-white/45 sm:pt-6 sm:text-[0.82rem]">
        {#each getResearchAuthors(entry) as author (author.id)}
          <span class="inline-flex items-center gap-1.5">
            <PersonAvatar name={author.name} links={author.links} variant="blog" className="inline-flex shrink-0" />
            <BlogAuthorDisplayName fullName={author.name} handleClassName="text-black/38 dark:text-white/38" />
          </span>
        {/each}
      </div>

      <p class="pt-4 text-xs font-medium text-black/68 transition-colors group-hover:text-black dark:text-white/68 dark:group-hover:text-white sm:pt-5 lg:text-sm">
        Read research →
      </p>
    </article>
  </a>
{/each}
