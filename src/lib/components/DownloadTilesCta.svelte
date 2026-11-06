<script lang="ts">
  import { Download } from "@lucide/svelte"
  import { cn } from "#lib/utils"
  import { triggerHaptic } from "#lib/haptics"
  import {
    downloadButtonIconMotionClasses,
    downloadButtonLabelMotionClasses,
    downloadButtonMotionClasses,
    themeAwareHeaderPrimaryCtaClasses,
  } from "#lib/header-primary-cta-classes"

  type DownloadTilesCtaSize = "footer" | "hero" | "nav"

  const sizeClasses: Record<DownloadTilesCtaSize, string> = {
    footer: "h-10 gap-2 px-5 text-[0.875rem] lg:px-6 lg:text-[0.9rem]",
    hero: "h-11 gap-2 px-5 text-[0.9rem] sm:px-6 sm:text-[0.94rem]",
    nav: "h-9 gap-1.5 px-3 text-xs sm:px-3.5 sm:text-[0.8125rem]",
  }

  const iconSizeClasses: Record<DownloadTilesCtaSize, string> = {
    footer: "h-3.5 w-3.5 lg:h-4 lg:w-4",
    hero: "h-4 w-4",
    nav: "h-3.5 w-3.5",
  }

  const baseClasses = [
    "group inline-flex w-fit items-center justify-center whitespace-nowrap rounded-[6px] font-medium leading-none !no-underline",
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    themeAwareHeaderPrimaryCtaClasses,
    downloadButtonMotionClasses,
  ].join(" ")

  let {
    size,
    label,
    className,
    ariaLabel,
  }: {
    size: DownloadTilesCtaSize
    label: string
    className?: string
    ariaLabel?: string
  } = $props()
</script>

<a
  href="/download"
  onclick={() => triggerHaptic()}
  aria-label={ariaLabel}
  class={cn(baseClasses, sizeClasses[size], className)}
  data-slot="button"
>
  <span class={downloadButtonLabelMotionClasses}>{label}</span>
  <Download
    class={cn("download-cta-icon shrink-0", iconSizeClasses[size], downloadButtonIconMotionClasses)}
    aria-hidden="true"
  />
</a>
