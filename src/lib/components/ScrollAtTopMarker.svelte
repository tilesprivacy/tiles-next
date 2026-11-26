<script lang="ts">
  // The announcement and pull-to-refresh both use this top-of-page sentinel.
  function markAtTop(sentinel: HTMLElement) {
    const root = document.documentElement
    const observer = new IntersectionObserver(([entry]) => {
      root.dataset.scrollAtTop = String(entry.isIntersecting)
    })
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      delete root.dataset.scrollAtTop
    }
  }
</script>

<div {@attach markAtTop} aria-hidden="true" class="pointer-events-none absolute left-0 top-0 h-px w-px"></div>
