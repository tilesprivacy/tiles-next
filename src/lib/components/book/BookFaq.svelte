<script lang="ts">
  import type { Snippet } from "svelte"
  import { cn } from "#lib/utils"

  // Accordion list of BookFaqItems; the page supplies the heading.
  let { children, class: className }: { children: Snippet; class?: string } = $props()
</script>

<div class={cn("not-prose", className)}>
  <div class="border-t border-black/10 dark:border-white/10 divide-y divide-black/10 dark:divide-white/10">
    {@render children()}
  </div>
</div>
