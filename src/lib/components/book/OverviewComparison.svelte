<script lang="ts">
  import { Check, CircleDashed } from "@lucide/svelte"
  import { SHOW_REMOTE_LINK } from "#lib/feature-flags"

  // "What makes Tiles different" matrix on /book/overview.
  type Support = "yes" | "partial" | "no"

  const products = ["Tiles", "Ollama", "LM Studio", "Jan", "Osaurus"]
  const y = "yes"
  const p = "partial"
  const n = "no"

  const rows: { capability: string; support: Support[]; hidden?: boolean }[] = [
    { capability: "Decentralized Identity", support: [y, n, n, n, y] },
    { capability: "Encryption", support: [y, n, p, n, y] },
    { capability: "Sync", support: [y, n, n, n, n] },
    { capability: "On-device models", support: [y, y, y, y, y] },
    { capability: "Cloud models", support: [n, y, y, y, y] },
    { capability: "In-house models", support: [n, n, n, y, y] },
    { capability: "Agent Harness", support: [y, y, y, n, y] },
    { capability: "Memory", support: [n, n, n, n, y] },
    { capability: "Plugins", support: [y, y, y, y, y] },
    { capability: "Sandbox", support: [n, n, n, n, y] },
    { capability: "Remote Link", support: [y, n, y, n, y], hidden: !SHOW_REMOTE_LINK },
    { capability: "Shared Links", support: [y, n, n, n, n] },
    { capability: "Developer SDK", support: [y, y, y, n, y] },
    { capability: "Offline Installer", support: [y, n, n, n, n] },
    { capability: "Cross platform", support: [y, y, y, y, n] },
    { capability: "Open source", support: [y, p, p, y, y] },
  ]

  const labels: Record<Support, string> = {
    yes: "Supported",
    partial: "Partially supported",
    no: "Not supported",
  }
  const legend: Support[] = ["yes", "partial", "no"]

  const cell = "border-b border-black/10 dark:border-white/10"
  const badge = "inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-foreground dark:bg-white/10"
</script>

{#snippet mark(support: Support)}
  {#if support === "yes"}
    <Check class="h-4 w-4" strokeWidth={2} aria-hidden="true" />
  {:else if support === "partial"}
    <CircleDashed class="h-3.5 w-3.5 text-black/50 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden="true" />
  {:else}
    <span class="text-sm text-black/35 dark:text-[#6B6B6B]" aria-hidden="true">-</span>
  {/if}
{/snippet}

<div
  class="not-prose -mx-4 mt-4 max-w-none overflow-x-auto overflow-y-hidden px-4 overscroll-x-contain [contain:paint] sm:mx-0 sm:mt-5 sm:max-w-full sm:px-0 [-webkit-overflow-scrolling:touch]"
>
  <table class="w-full min-w-[42rem] table-fixed border-separate border-spacing-0 text-left sm:min-w-[48rem]">
    <colgroup>
      <col class="w-[32%]" />
      {#each products as product (product)}
        <col class="w-[13.6%]" />
      {/each}
    </colgroup>
    <thead>
      <tr>
        <th class="{cell} py-3 pr-4 text-xs font-medium uppercase tracking-[0.2em] text-black/50 dark:text-[#8A8A8A]">
          Capability
        </th>
        {#each products as product (product)}
          <th class="{cell} px-4 py-3 text-sm font-light text-foreground">{product}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows.filter((row) => !row.hidden) as row (row.capability)}
        <tr>
          <th class="{cell} py-3 pr-4 text-sm font-medium text-foreground">{row.capability}</th>
          {#each row.support as support, index (index)}
            <td class="{cell} px-4 py-3 align-middle">
              <span class={badge}>
                {@render mark(support)}
                <span class="sr-only">{labels[support]}</span>
              </span>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div
  class="not-prose flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/60 dark:text-[#B3B3B3] sm:text-sm mt-4 sm:mt-5"
>
  {#each legend as support (support)}
    <span class="inline-flex items-center gap-2">
      <span class={badge}>{@render mark(support)}</span>
      <span>{labels[support]}</span>
    </span>
  {/each}
</div>
