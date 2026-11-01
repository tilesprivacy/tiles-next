<script lang="ts">
  import { Package } from "@lucide/svelte"

  let { slug, class: className = "h-5 w-5" }: { slug: string; class?: string } = $props()
</script>

{#if slug === "caldir"}
  <img src="/caldir-icon-black.png" alt="" width="64" height="64" loading="lazy" class={`${className} dark:hidden`} aria-hidden="true" />
  <img src="/caldir-icon-white.png" alt="" width="64" height="64" loading="lazy" class={`hidden ${className} dark:block`} aria-hidden="true" />
{:else if slug === "exa"}
  <img src="/exa-icon.svg" alt="" width="64" height="64" loading="lazy" class={`${className} rounded-[3px]`} aria-hidden="true" />
{:else if slug === "fold"}
  <img src="/fold-icon.png" alt="" width="180" height="180" loading="lazy" class={`${className} rounded-[3px] object-contain`} aria-hidden="true" />
{:else if slug === "cloudflare"}
  <img src="/cloudflare-icon.svg" alt="" width="66" height="30" loading="lazy" class={`${className} object-contain`} aria-hidden="true" />
{:else if slug === "obsidian"}
  <img src="/obsidian-icon.svg" alt="" width="64" height="64" loading="lazy" class={`${className} object-contain`} aria-hidden="true" />
{:else if slug === "solstone"}
  <img src="/solstone-icon.svg" alt="" width="64" height="64" loading="lazy" class={`${className} object-contain`} aria-hidden="true" />
{:else}
  <Package class={className} aria-hidden="true" />
{/if}
