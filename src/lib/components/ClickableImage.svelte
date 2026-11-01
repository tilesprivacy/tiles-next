<script lang="ts">
  import type { Component } from "svelte"
  import { Maximize2 } from "@lucide/svelte"
  import { cn } from "#lib/utils"

  // An article image that opens full screen when clicked.
  let {
    src,
    alt = "",
    width,
    height,
    class: className,
    style = "",
  }: {
    src: string
    alt?: string
    width: number
    height: number
    /** Classes for the wrapper, e.g. responsive visibility for light/dark pairs. */
    class?: string
    /** Inline style for the image; its border-radius also rounds the hover hint. */
    style?: string
  } = $props()

  const borderRadius = $derived(/border-radius:\s*([^;]+)/.exec(style)?.[1].trim() ?? "8px")

  type LightboxComponent = Component<{ src: string; alt: string; onClose: () => void }>
  // The viewer is only downloaded the first time someone opens an image.
  let Lightbox = $state<LightboxComponent | null>(null)
  let open = $state(false)

  async function openLightbox() {
    Lightbox ??= (await import("./ImageLightbox.svelte")).default
    open = true
  }
</script>

<div class={cn("relative group", className)}>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <img
    {src}
    {alt}
    {width}
    {height}
    loading="lazy"
    decoding="async"
    class="h-auto w-full"
    style="{style}{style && !style.trim().endsWith(';') ? ';' : ''}cursor:pointer;transition:opacity 0.2s ease"
    onclick={openLightbox}
  />
  <div
    class="absolute inset-0 flex items-center justify-center bg-black/20 dark:bg-black/30 transition-opacity duration-200 pointer-events-none opacity-0 group-hover:opacity-100"
    style="border-radius: {borderRadius}"
  >
    <div class="flex items-center gap-2 bg-white/90 dark:bg-black/90 px-3 py-2 rounded-full shadow-lg">
      <Maximize2 class="h-4 w-4 text-black dark:text-white" strokeWidth={2} />
      <span class="text-xs font-medium text-black dark:text-white">Click to expand</span>
    </div>
  </div>
</div>
{#if open && Lightbox}
  <Lightbox {src} {alt} onClose={() => (open = false)} />
{/if}
