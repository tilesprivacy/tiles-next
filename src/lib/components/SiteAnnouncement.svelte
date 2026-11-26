<script lang="ts">
  import { ArrowRight } from "@lucide/svelte"

  let height = $state(0)

  // Keep the fixed navigation below the strip when enlarged text wraps.
  $effect(() => {
    if (!height) return
    const style = document.documentElement.style
    style.setProperty("--site-announcement-height", `${height}px`)
    return () => style.removeProperty("--site-announcement-height")
  })
</script>

<aside class="site-announcement" aria-label="Announcement" data-pagefind-ignore="all" bind:offsetHeight={height}>
  <a href="/blog/tiles-joins-mozilla-ai-incubator">
    <span class="site-announcement-message">
      <svg aria-hidden="true" width="17" height="16" viewBox="0 0 51 48" fill="none">
        <path fill="currentColor" d="M17.9709 0.226807L24.1158 30.4734H26.3252L32.47 0.226807H50.4214V47.7884H40.5602V8.55557H38.6311L30.0198 47.7884H20.7141L12.1031 8.55557H9.88078V47.7884H0.0195312V0.226807H17.9709Z" />
        <path fill="#7DEDF6" d="M9.88086 8.5556H12.0869L20.6351 47.7885H9.88086V8.5556Z" />
        <path fill="#F06C13" d="M17.9429 0.226807L24.0877 30.4734H26.2973L32.442 0.226807H17.9429Z" />
        <path fill="#F7EC36" d="M38.3545 8.5556H40.5606V47.7885H29.8062L38.3545 8.5556Z" />
      </svg>
      Backed by Mozilla Foundation
    </span>
    <span class="site-announcement-cta">
      Read the announcement <ArrowRight aria-hidden="true" size="1em" strokeWidth={1.5} />
    </span>
  </a>
</aside>
