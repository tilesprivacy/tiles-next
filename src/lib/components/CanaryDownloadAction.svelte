<script lang="ts">
  import { Download } from "@lucide/svelte"
  import type { CanaryReleaseData } from "#lib/canary-release"
  import InstallerChecksum from "#lib/components/InstallerChecksum.svelte"
  import { CANARY_FALLBACK_DOWNLOAD } from "#lib/download-page-data"
  import { formatBinarySize } from "#lib/format-binary-size"
  import {
    downloadButtonIconMotionClasses,
    downloadButtonMotionClasses,
    themeAwareHeaderPrimaryCtaClasses,
  } from "#lib/header-primary-cta-classes"

  let { release }: { release: CanaryReleaseData | null } = $props()

  type CanaryAsset = CanaryReleaseData["assets"][number]

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
    <span class="minimal-download-size">
      {#if typeof asset.size === "number"}{formatBinarySize(asset.size)} · {/if}
      <InstallerChecksum sha256={asset.sha256} fileName={asset.name} lastKnown={asset === CANARY_FALLBACK_DOWNLOAD} />
      For trying experimental features
    </span>
  </div>
{/each}
