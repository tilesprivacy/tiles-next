<script lang="ts">
  import { onMount } from "svelte"
  import { afterNavigate, goto } from "$app/navigation"
  import { searchSite, type SearchHit } from "#lib/site-search"

  let { onOpenChange }: { onOpenChange?: (open: boolean) => void } = $props()

  let isOpen = $state(false)
  let query = $state("")
  let hits = $state<SearchHit[]>([])
  let hasIndex = $state(true)
  let activeIndex = $state(-1)
  let shortcutLabel = $state<string | null>(null)
  let root = $state<HTMLDivElement>()
  let input = $state<HTMLInputElement>()
  let searchSeq = 0

  const showPanel = $derived(isOpen && query.trim().length > 0)

  // Set after mount so the prerendered markup stays platform-neutral.
  onMount(() => {
    shortcutLabel = /Mac|iPhone|iPad/.test(navigator.platform ?? "") ? "⌘ K" : "Ctrl K"
  })

  afterNavigate(() => close())

  // Lock page scroll behind the full-screen results view.
  $effect(() => {
    if (!showPanel) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  })

  export function open() {
    isOpen = true
    onOpenChange?.(true)
  }

  function close() {
    searchSeq++
    isOpen = false
    query = ""
    hits = []
    activeIndex = -1
    onOpenChange?.(false)
  }

  async function search() {
    const trimmed = query.trim()
    const seq = ++searchSeq
    if (!trimmed) {
      hits = []
      activeIndex = -1
      return
    }
    try {
      const results = await searchSite(trimmed)
      if (!results || seq !== searchSeq) return
      hits = results
      activeIndex = -1
    } catch {
      if (seq === searchSeq) hasIndex = false
    }
  }

  function visit(url: string) {
    close()
    void goto(url)
  }

  function onWindowKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault()
      if (isOpen) input?.focus()
      else open()
    } else if (isOpen && event.key === "Escape") {
      close()
    }
  }

  function onDocumentMousedown(event: MouseEvent) {
    if (isOpen && root && !root.contains(event.target as Node)) close()
  }

  function onInputKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (hits.length === 0) return
      event.preventDefault()
      const next = activeIndex + (event.key === "ArrowDown" ? 1 : -1)
      activeIndex = next < -1 ? hits.length - 1 : next >= hits.length ? -1 : next
    } else if (event.key === "Enter") {
      event.preventDefault()
      const hit = hits[activeIndex] ?? hits[0]
      if (hit) visit(hit.url)
    }
  }

  const focusOnMount = (node: HTMLInputElement) => node.focus()
</script>

<svelte:window onkeydown={onWindowKeydown} />
<svelte:document onmousedown={onDocumentMousedown} />

{#snippet glyph(className: string)}
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" />
    <path d="M16.1 16.1 L20.7 20.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
  </svg>
{/snippet}

<div bind:this={root} class="site-search-root">
  <button
    type="button"
    class="site-search-trigger"
    aria-label="Search"
    aria-expanded={isOpen}
    aria-keyshortcuts="Meta+K Control+K"
    title="Search (⌘K)"
    onclick={() => (isOpen ? close() : open())}
  >
    {@render glyph("site-search-glyph")}
    {#if shortcutLabel}<kbd class="site-search-trigger-kbd" aria-hidden="true">{shortcutLabel}</kbd>{/if}
  </button>

  {#if isOpen}
    <div class="site-search-bar" role="search">
      {@render glyph("site-search-glyph site-search-bar-glyph")}
      <input
        bind:this={input}
        {@attach focusOnMount}
        type="text"
        bind:value={query}
        oninput={search}
        onkeydown={onInputKeydown}
        placeholder="Search Tiles"
        aria-label="Search Tiles"
        autocomplete="off"
        autocorrect="off"
        spellcheck={false}
        class="site-search-input"
      />
      <button type="button" class="site-search-close" aria-label="Close search" onclick={close}>
        <svg viewBox="0 0 24 24" fill="none" class="site-search-close-glyph" aria-hidden="true">
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
      <span class="site-search-hairline" aria-hidden="true"></span>
    </div>
  {/if}

  {#if showPanel}
    <div class="site-search-panel">
      <div class="site-search-panel-inner">
        {#if hits.length > 0}
          <p class="site-search-section-label">Pages</p>
          <ul class="site-search-results" role="listbox" aria-label="Search results">
            {#each hits as hit, index (hit.id)}
              <li role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  class="site-search-item"
                  data-active={index === activeIndex || undefined}
                  onmouseenter={() => (activeIndex = index)}
                  onmouseleave={() => (activeIndex = -1)}
                  onclick={() => visit(hit.url)}
                >
                  <span class="site-search-hit-title">{hit.title}</span>
                  <!-- Excerpt is sanitized to text plus <mark> in sanitizeExcerpt. -->
                  <span class="site-search-hit-excerpt">{@html hit.excerpt}</span>
                </button>
              </li>
            {/each}
          </ul>
        {:else if hasIndex}
          <p class="site-search-empty">No matching pages.</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
