<script lang="ts">
  function measureHeight(banner: HTMLElement) {
    const style = document.documentElement.style
    const update = () => style.setProperty("--site-announcement-height", `${banner.offsetHeight}px`)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(banner)
    return () => {
      observer.disconnect()
      style.removeProperty("--site-announcement-height")
    }
  }
</script>

<aside {@attach measureHeight} class="site-announcement" aria-label="Announcement" data-pagefind-ignore="all">
  <a href="/blog/tiles-joins-mozilla-ai-incubator">
    <img src="/mozilla-foundation-logo-dark.svg" alt="Mozilla Foundation" width="440" height="92" class="site-announcement-logo dark:hidden" />
    <img src="/mozilla-foundation-logo.svg" alt="Mozilla Foundation" width="229" height="48" class="site-announcement-logo hidden dark:block" />
    <span class="site-announcement-message">Tiles joins the Human-Scale AI Incubator as an anchor project</span>
  </a>
</aside>
