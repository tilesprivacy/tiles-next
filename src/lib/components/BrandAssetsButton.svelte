<script lang="ts">
  import { Download } from "@lucide/svelte"
  import {
    downloadButtonIconMotionClasses,
    downloadButtonMotionClasses,
    themeAwareHeaderPrimaryCtaClasses,
  } from "#lib/header-primary-cta-classes"

  // Margin differs between /brand and /press-kit.
  let { marginClass }: { marginClass: string } = $props()
</script>

<a
  href="/tiles-brand-assets.zip"
  class={`group minimal-primary-button minimal-download-action ${marginClass} !min-w-0 !no-underline ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
>
  <span>Download brand assets</span>
  <Download class={`download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`} aria-hidden="true" />
</a>
