<script lang="ts">
  // Stamps <html data-scroll-at-top> while the page rests at the very top.
  // app.css uses it to give overscroll back to the browser there: the root
  // `overscroll-behavior-y: none` that stops the footer exposing an empty
  // viewport would otherwise also block pull-to-refresh.
  // A 1px sentinel at the top of the document is visible exactly then.
  function markAtTop(sentinel: HTMLElement) {
    const root = document.documentElement
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) root.dataset.scrollAtTop = "true"
      else delete root.dataset.scrollAtTop
    })
    observer.observe(sentinel)
    return () => {
      observer.disconnect()
      delete root.dataset.scrollAtTop
    }
  }
</script>

<div {@attach markAtTop} aria-hidden="true" class="pointer-events-none absolute left-0 top-0 h-px w-px"></div>
