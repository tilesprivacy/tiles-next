<script lang="ts">
  import type { ResearchExplorationBadge } from "#lib/research-log"

  let { badge }: { badge: ResearchExplorationBadge } = $props()

  const styles: Record<ResearchExplorationBadge, { label: string; class: string }> = {
    "napkin-sketch": {
      label: "NAPKIN SKETCH",
      class: "bg-[#DDEBFF] text-[#1F5FA8] dark:bg-[#243B5A] dark:text-[#BFD8FF]",
    },
    "experimental-prototype": {
      label: "EXPERIMENTAL PROTOTYPE",
      class: "bg-[#E8D5F2] text-[#6B2E99] dark:bg-[#3A2A4A] dark:text-[#D4C5E8]",
    },
    wip: { label: "WIP", class: "bg-black/[0.06] text-black/62 dark:bg-white/[0.1] dark:text-white/72" },
  }
</script>

<span
  class="inline-flex rounded px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] {styles[badge].class}"
>
  {styles[badge].label}
</span>
