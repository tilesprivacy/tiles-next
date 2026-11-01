<script lang="ts">
  import DownloadPlatformSubtext from "./DownloadPlatformSubtext.svelte"
  import DownloadTilesCta from "./DownloadTilesCta.svelte"
  import { SHOW_PRICING } from "#lib/feature-flags"
  import { DOWNLOAD_PRICING_LINK_LABEL, DOWNLOAD_PRICING_NOTE_LABEL } from "#lib/product-description"

  const pricingNoteClasses: Record<"hero" | "footer", string> = {
    hero: "text-[0.79rem] sm:text-[0.83rem]",
    footer: "text-[0.74rem] sm:text-[0.79rem]",
  }

  let { platformSize = "hero" }: { platformSize?: "hero" | "footer" } = $props()
</script>

<div class="minimal-download-cta">
  <DownloadTilesCta size={platformSize} label="Download for free" />
  <div class="minimal-download-details flex flex-col items-center gap-3">
    <DownloadPlatformSubtext size={platformSize} />
    {#if SHOW_PRICING}
      <p class={`font-medium leading-none text-black/48 dark:text-[#9A9A9A] ${pricingNoteClasses[platformSize]}`}>
        {DOWNLOAD_PRICING_NOTE_LABEL}
        <a href="/pricing" class="underline underline-offset-2 hover:text-black/70 dark:hover:text-white/80">
          {DOWNLOAD_PRICING_LINK_LABEL}
        </a>
      </p>
    {/if}
    {#if platformSize === "hero"}
      <p class="mt-9 font-medium leading-none text-black/40 dark:text-[#8A8A8A] text-[0.74rem] sm:text-[0.79rem]">
        <a
          href="/book/overview#what-makes-tiles-different"
          class="underline underline-offset-2 hover:text-black/60 dark:hover:text-white/70"
        >
          See how Tiles compares to Ollama and others →
        </a>
      </p>
    {/if}
  </div>
</div>
