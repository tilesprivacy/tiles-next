<script lang="ts">
  import { X } from "@lucide/svelte"

  // Full-screen view of an article image. Loaded on demand by ClickableImage.
  let { src, alt, onClose }: { src: string; alt: string; onClose: () => void } = $props()

  $effect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  })
</script>

<svelte:document onkeydown={(event) => event.key === "Escape" && onClose()} />

<!-- Escape closes it from the document listener above. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  onclick={(event) => event.target === event.currentTarget && onClose()}
  role="dialog"
  tabindex="-1"
  aria-modal="true"
  aria-label="Full screen image viewer"
  class="image-lightbox-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 dark:bg-black/95"
>
  <button
    type="button"
    onclick={onClose}
    class="absolute right-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
    aria-label="Close image viewer"
  >
    <X class="h-6 w-6 text-white" strokeWidth={2} />
  </button>

  <div class="image-lightbox-content relative max-h-[90vh] max-w-[90vw] p-4">
    <div class="relative h-full w-full">
      <img
        {src}
        {alt}
        width="1920"
        height="1080"
        decoding="async"
        class="max-h-[90vh] max-w-[90vw] object-contain"
        style="height: auto; width: auto;"
      />
    </div>
  </div>
</div>
