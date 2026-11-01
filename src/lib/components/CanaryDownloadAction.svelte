<script lang="ts">
  import { Download } from "@lucide/svelte"
  import type { CanaryReleaseData } from "#lib/canary-release"
  import { CANARY_FALLBACK_DOWNLOAD } from "#lib/download-page-data"
  import {
    downloadButtonIconMotionClasses,
    downloadButtonMotionClasses,
    themeAwareHeaderPrimaryCtaClasses,
  } from "#lib/header-primary-cta-classes"

  let { release }: { release: CanaryReleaseData | null } = $props()

  type CanaryAsset = { name: string; browser_download_url: string; size?: number }

  // Release data reaches the browser through /api/canary-release, so only link
  // to installers that really live on our GitHub releases.
  const isReleaseAsset = (asset: CanaryAsset) =>
    typeof asset?.name === "string" &&
    typeof asset.browser_download_url === "string" &&
    asset.browser_download_url.startsWith("https://github.com/tilesprivacy/tiles/releases/download/")

  const assets: CanaryAsset[] = $derived.by(() => {
    const live = (release?.assets ?? []).filter(isReleaseAsset)
    return live.length ? live : [CANARY_FALLBACK_DOWNLOAD]
  })

  function formatSize(size: number) {
    if (size < 1024) return `${size} bytes`
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }
</script>

{#each assets as asset (asset.name)}
  <div class="minimal-download-option">
    <a
      href={asset.browser_download_url}
      class={`group minimal-primary-button minimal-download-action ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
    >
      <span>Download canary installer</span>
      <Download class={`download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`} aria-hidden="true" />
    </a>
    <span class="minimal-download-size"
      >{typeof asset.size === "number" ? `${formatSize(asset.size)} · ` : ""}For early testers</span
    >
  </div>
{/each}
