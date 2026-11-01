<script lang="ts">
  import { onMount } from "svelte"
  import { ArrowUp } from "@lucide/svelte"

  // Ring that fills as the reader scrolls; clicking it returns to the top.
  const RING_RADIUS = 17
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
  const SHOW_AFTER_SCROLL_PX = 240

  let progress = $state(0)
  let visible = $state(false)

  onMount(() => {
    let frame: number | null = null

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
      visible = window.scrollY > SHOW_AFTER_SCROLL_PX
    }
    const requestUpdate = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(() => {
        frame = null
        update()
      })
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
    }
  })

  function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }

  const percent = $derived(Math.round(progress * 100))
</script>

<button
  type="button"
  onclick={scrollToTop}
  aria-label="{percent}% read — scroll back to top"
  aria-hidden={visible ? undefined : true}
  tabindex={visible ? 0 : -1}
  class="blog-print-screen-only fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1.25rem+env(safe-area-inset-right,0px))] z-40 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border-0 bg-transparent text-black transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/70 dark:text-[var(--sponsor-yellow,#f7ff61)] dark:focus-visible:outline-[var(--sponsor-yellow,#f7ff61)] print:hidden {visible
    ? 'translate-y-0 opacity-100'
    : 'pointer-events-none translate-y-3 opacity-0'}"
>
  <svg viewBox="0 0 40 40" class="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
    <circle
      cx="20"
      cy="20"
      r={RING_RADIUS}
      stroke-width="2.5"
      class="fill-white/90 stroke-black/25 dark:fill-neutral-800/90 dark:stroke-white/25"
    />
    <circle
      cx="20"
      cy="20"
      r={RING_RADIUS}
      fill="none"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-dasharray={RING_CIRCUMFERENCE}
      stroke-dashoffset={RING_CIRCUMFERENCE * (1 - progress)}
      class="stroke-black transition-[stroke-dashoffset] duration-150 ease-out dark:stroke-[var(--sponsor-yellow,#f7ff61)]"
    />
  </svg>
  <ArrowUp class="relative h-4 w-4" aria-hidden="true" />
</button>
