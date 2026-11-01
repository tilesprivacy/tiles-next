<script lang="ts">
  import FaApple from "./icons/FaApple.svelte"
  import FaLinux from "./icons/FaLinux.svelte"
  import { DOWNLOAD_PLATFORM_LINUX_LABEL, DOWNLOAD_PLATFORM_MACOS_LABEL } from "#lib/product-description"

  type DownloadPlatformSubtextSize = "hero" | "footer"

  const sizeClasses: Record<DownloadPlatformSubtextSize, string> = {
    hero: "text-[0.79rem] sm:text-[0.83rem]",
    footer: "text-[0.74rem] sm:text-[0.79rem]",
  }

  const iconClasses: Record<DownloadPlatformSubtextSize, string> = {
    hero: "h-3.5 w-3.5",
    footer: "h-3 w-3 sm:h-3.5 sm:w-3.5",
  }

  let { size = "hero", className = "" }: { size?: DownloadPlatformSubtextSize; className?: string } = $props()

  const textClass = $derived(`font-medium text-black/48 dark:text-[#9A9A9A] ${sizeClasses[size]}`)
  const platformClass = $derived(`inline-grid grid-cols-[1rem_auto] items-center gap-x-1.5 leading-none ${textClass}`)
  const iconSlotClass = "inline-flex h-4 w-4 items-center justify-center"
</script>

<div
  class={`flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center ${className}`.trim()}
  aria-label={`${DOWNLOAD_PLATFORM_MACOS_LABEL} and ${DOWNLOAD_PLATFORM_LINUX_LABEL}`}
>
  <span class={platformClass}>
    <span class={iconSlotClass} aria-hidden="true">
      <FaApple class={`${iconClasses[size]} shrink-0`} />
    </span>
    {DOWNLOAD_PLATFORM_MACOS_LABEL}
  </span>
  <span class={platformClass}>
    <span class={iconSlotClass} aria-hidden="true">
      <FaLinux class={`${iconClasses[size]} shrink-0`} />
    </span>
    {DOWNLOAD_PLATFORM_LINUX_LABEL}
  </span>
</div>
