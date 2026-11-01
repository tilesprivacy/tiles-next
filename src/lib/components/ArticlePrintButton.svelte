<script lang="ts">
  import { triggerHaptic } from "#lib/haptics"
  import FaPrint from "./icons/FaPrint.svelte"

  let { className = "" }: { className?: string } = $props()

  const printIconClass =
    "h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5"
  const printLabelClass =
    "text-[11px] text-black/50 transition-colors hover:text-black/70 dark:text-white/50 dark:hover:text-white/70 lg:text-xs"

  function handlePrint() {
    triggerHaptic()
    window.print()
  }
</script>

<div class="article-print-control inline-flex items-center gap-2 print:hidden {className}">
  <button type="button" onclick={handlePrint} aria-label="Print article" class="inline-flex items-center justify-center">
    <FaPrint class={printIconClass} aria-hidden="true" />
  </button>
  <button type="button" onclick={handlePrint} class="{printLabelClass} leading-none">Print</button>
</div>
