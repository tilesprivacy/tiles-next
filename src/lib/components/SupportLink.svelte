<script lang="ts">
  import type { Snippet } from "svelte"
  import { ArrowUpRight } from "@lucide/svelte"

  let { href, external = false, children }: { href: string; external?: boolean; children: Snippet } = $props()

  const className =
    "inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:text-black/70 hover:decoration-current dark:hover:text-white/80"
</script>

{#if external}
  <a {href} target="_blank" rel="noopener noreferrer" class={className}>
    {@render children()}
    <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
  </a>
{:else}
  <a {href} class={className}>{@render children()}</a>
{/if}
