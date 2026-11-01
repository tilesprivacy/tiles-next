<script lang="ts">
  import { allBookPages } from "#lib/book"

  // Chapter cards on the /book index, numbered in navigation order.
  const cards = allBookPages
    .filter((page) => !page.hidden && page.slug !== "")
    .map((page, index) => ({ ...page, number: String(index + 1).padStart(2, "0") }))
</script>

<div class="not-prose space-y-6 my-10">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each cards as card (card.href)}
      <a href={card.href} class="block group min-w-0" style="text-decoration: none">
        <div
          class="bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] p-8 rounded-sm h-full min-w-0"
          style="text-decoration: none"
        >
          <div class="flex min-w-0 flex-col items-start gap-3">
            <div
              class="text-sm lg:text-base leading-none tabular-nums text-black/35 dark:text-white/40 font-medium tracking-tight"
              style="text-decoration: none"
            >
              {card.number}
            </div>
            <h2
              class="w-full min-w-0 break-words text-3xl font-light leading-[1.05] text-black dark:text-white tracking-tight group-hover:text-black/80 dark:group-hover:text-white/80"
              style="text-decoration: none"
            >
              {card.title}
            </h2>
          </div>
          <p class="mt-4 text-black/60 dark:text-white/70 text-base leading-relaxed" style="text-decoration: none">
            {card.cardDescription}
          </p>
        </div>
      </a>
    {/each}
  </div>
</div>
