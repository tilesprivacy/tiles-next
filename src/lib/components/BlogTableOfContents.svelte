<script lang="ts">
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"
  import type { TocItem } from "#lib/toc"

  let { mode = "desktop", items }: { mode?: "desktop" | "mobile" | "print"; items: TocItem[] } = $props()

  const DEFAULT_STICKY_TOP = 112
  const FIXED_HEADER_SELECTOR = "header.minimal-topbar, header.fixed.inset-x-0, header[data-tiles-site-header]"

  let activeId = $state("")
  let stickyTop = $state(DEFAULT_STICKY_TOP)
  let isExpanded = $state(true)

  const minLevel = $derived(items.length ? Math.min(...items.map((item) => item.level)) : 2)

  function indentClass(level: number): string {
    const depth = level - minLevel
    if (depth <= 0) return ""
    return depth === 1 ? "pl-4" : "pl-8"
  }

  function headerBottom(): number {
    const header = document.querySelector<HTMLElement>(FIXED_HEADER_SELECTOR)
    return header ? Math.ceil(header.getBoundingClientRect().bottom + 16) : DEFAULT_STICKY_TOP
  }

  // Keep the address bar in step without adding history entries or scrolling.
  function updateUrl(url: string) {
    goto(url, { replace: true, shallow: true })
  }

  function scrollToId(id: string, behavior: ScrollBehavior = "smooth") {
    const target = document.getElementById(id)
    if (!target) return
    const top = window.scrollY + target.getBoundingClientRect().top - headerBottom()
    window.scrollTo({ top: Math.max(0, top), behavior })
    if (window.location.hash !== `#${id}`) updateUrl(`#${id}`)
  }

  onMount(() => {
    // The print copy is static; only the on-screen lists track scrolling.
    if (mode === "print" || items.length === 0) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => heading !== null)

    const syncActive = () => {
      const anchor = window.scrollY + headerBottom() + 1
      let next = ""
      for (const heading of headings) {
        if (window.scrollY + heading.getBoundingClientRect().top > anchor) break
        next = heading.id
      }
      activeId = next
    }

    let frame: number | null = null
    const requestSync = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        frame = null
        syncActive()
      })
    }

    // Land below the fixed header when the page opens on a #heading link.
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (mode === "desktop" && hash && items.some((item) => item.id === hash)) scrollToId(hash, "auto")
    syncActive()

    const header = document.querySelector<HTMLElement>(FIXED_HEADER_SELECTOR)
    const resize = header && mode === "desktop" ? new ResizeObserver(() => (stickyTop = headerBottom())) : null
    if (header) resize?.observe(header)

    window.addEventListener("scroll", requestSync, { passive: true })
    window.addEventListener("resize", requestSync, { passive: true })
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", requestSync)
      window.removeEventListener("resize", requestSync)
      resize?.disconnect()
    }
  })

  function jumpTo(event: MouseEvent, id: string) {
    event.preventDefault()
    activeId = id
    scrollToId(id)
  }

  function jumpToTop(event: MouseEvent) {
    event.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (window.location.hash) updateUrl(window.location.pathname + window.location.search)
  }
</script>

{#snippet navItems()}
  <ul class="space-y-2.5">
    {#each items as item (item.id)}
      <li class={indentClass(item.level)}>
        <a
          href="#{item.id}"
          class="block text-sm leading-snug transition-colors {activeId === item.id
            ? 'text-black dark:text-white'
            : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'}"
          onclick={(event) => jumpTo(event, item.id)}>{item.text}</a
        >
      </li>
    {/each}
  </ul>
{/snippet}

{#if items.length > 0}
  {#if mode === "print"}
    <nav aria-label="Table of contents" data-blog-print-toc data-pagefind-ignore="all" class="hidden">
      <p data-blog-print-toc-title>Table of Contents</p>
      <ul>
        {#each items as item (item.id)}
          <li class={indentClass(item.level)}><a href="#{item.id}">{item.text}</a></li>
        {/each}
      </ul>
    </nav>
  {:else if mode === "mobile"}
    <nav
      aria-label="Table of contents"
      data-pagefind-ignore="all"
      class="rounded-sm border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.04]"
    >
      <button
        type="button"
        onclick={() => (isExpanded = !isExpanded)}
        class="flex w-full items-center justify-between text-left"
        aria-expanded={isExpanded}
        aria-controls="blog-content-start-mobile-toc-list"
      >
        <span class="text-[1.15rem] font-medium text-black/60 dark:text-white/60">Table of Contents</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          class="h-4 w-4 text-black/45 transition-transform dark:text-white/45 {isExpanded ? 'rotate-180' : ''}"
        >
          <path d="M5 12.5L10 7.5L15 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      {#if isExpanded}
        <div id="blog-content-start-mobile-toc-list" class="mt-3.5">
          {@render navItems()}
        </div>
      {/if}
    </nav>
  {:else}
    <nav
      aria-label="Table of contents"
      data-pagefind-ignore="all"
      class="sticky z-10 overflow-y-auto pr-4"
      style="top: {stickyTop}px; max-height: calc(100dvh - {stickyTop + 16}px);"
    >
      <a
        href="#top"
        class="mb-3 block border-b border-black/10 pb-3 text-sm font-medium uppercase tracking-wide text-black/55 transition-colors hover:text-black dark:border-white/10 dark:text-white/55 dark:hover:text-white"
        onclick={jumpToTop}
      >
        TOP ↑
      </a>
      {@render navItems()}
    </nav>
  {/if}
{/if}
