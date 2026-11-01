<script lang="ts">
  import LinkArrowIcon from "./LinkArrowIcon.svelte"
  import type { TocEntry } from "#lib/book-toc"

  let {
    toc,
    activeId,
    feedbackHref,
    editHref,
  }: { toc: TocEntry[]; activeId: string; feedbackHref: string; editHref: string } = $props()

  let list = $state<HTMLUListElement>()

  // Nextra only offers "Scroll to top" once the reader is past the second heading.
  const showBackToTop = $derived(toc.findIndex((item) => item.id === activeId) >= 2)

  // Keep the current entry visible inside a long list.
  $effect(() => {
    const link = activeId && list?.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`)
    if (!list || !link) return
    const box = list.getBoundingClientRect()
    const rect = link.getBoundingClientRect()
    if (rect.top < box.top || rect.bottom > box.bottom) {
      list.scrollBy({ top: rect.top - box.top - (box.height - rect.height) / 2, behavior: "smooth" })
    }
  })

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
    list?.scrollTo({ top: 0, behavior: "smooth" })
  }
</script>

<nav class="book-toc" aria-label="table of contents">
  <div class="book-toc-inner">
    {#if toc.length > 0}
      <p class="book-toc-title">On This Page</p>
      <ul bind:this={list} class="book-toc-list book-mask">
        {#each toc as item (item.id)}
          <li>
            <a
              href="#{item.id}"
              data-depth={item.depth}
              aria-current={item.id === activeId ? "location" : undefined}>{@html item.html}</a
            >
          </li>
        {/each}
      </ul>
    {/if}
    <div class="book-toc-meta" class:has-toc={toc.length > 0}>
      <a href={feedbackHref} target="_blank" rel="noopener noreferrer">Question? Give us feedback <LinkArrowIcon /></a>
      <a href={editHref} target="_blank" rel="noopener noreferrer">Edit this page <LinkArrowIcon /></a>
      <button
        type="button"
        class="book-toc-top"
        aria-hidden={showBackToTop ? undefined : "true"}
        disabled={!showBackToTop}
        onclick={scrollToTop}
        >Scroll to top<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" height="1.1em"
          ><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" /></svg
        ></button
      >
    </div>
  </div>
</nav>

