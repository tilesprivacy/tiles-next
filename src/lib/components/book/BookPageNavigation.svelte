<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte"
  import { getAdjacentBookPages } from "#lib/book"

  let { slug }: { slug: string } = $props()

  const adjacent = $derived(getAdjacentBookPages(slug))
  const link =
    "group flex items-center gap-1.5 lg:gap-2 text-muted-foreground hover:text-foreground transition-colors no-underline hover:no-underline"
  const placeholder = "flex items-center gap-1.5 lg:gap-2 text-muted-foreground/50"
  const label = "text-sm lg:text-base font-normal"
  const chevron = "h-4 w-4 lg:h-5 lg:w-5 shrink-0"
</script>

{#if adjacent.prev || adjacent.next}
  <nav data-book-navigation data-pagefind-ignore="all" class="not-prose mt-12 mx-4 lg:mx-0 lg:mt-16">
    <div
      class="flex items-center gap-3 lg:gap-4 bg-muted dark:bg-secondary rounded-lg pl-5 pr-2 py-2 lg:pl-7 lg:pr-2.5 lg:py-2.5"
    >
      {#if adjacent.prev}
        <a href={adjacent.prev.href} class={link} style="text-decoration:none">
          <ChevronLeft class={chevron} />
          <span class={label}>Previous</span>
        </a>
      {:else}
        <div class={placeholder}>
          <ChevronLeft class={chevron} />
          <span class={label}>Previous</span>
        </div>
      {/if}

      <div
        class="flex-1 flex items-center justify-end gap-4 lg:gap-6 bg-background rounded-sm pl-4 pr-5 py-3.5 lg:pl-6 lg:pr-7 lg:py-4"
      >
        {#if adjacent.next}
          <span class="text-base lg:text-lg font-light text-foreground">{adjacent.next.title}</span>
          <div class="h-6 lg:h-7 w-px bg-border"></div>
          <a href={adjacent.next.href} class={link} style="text-decoration:none">
            <span class={label}>Next</span>
            <ChevronRight class={chevron} />
          </a>
        {:else}
          <span class="text-base lg:text-lg font-light text-foreground mr-auto">{adjacent.prev?.title}</span>
          <div class={placeholder}>
            <span class={label}>Next</span>
            <ChevronRight class={chevron} />
          </div>
        {/if}
      </div>
    </div>
  </nav>
{/if}
