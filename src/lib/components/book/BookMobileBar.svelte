<script lang="ts">
  import { afterNavigate, replaceState } from "$app/navigation"
  import { page } from "$app/state"
  import { ChevronDown, ChevronLeft, ChevronRight } from "@lucide/svelte"
  import { bookPages, getAdjacentBookPages } from "#lib/book"
  import type { TocEntry } from "#lib/book-toc"

  // Sticky book bar under the site header on small screens: a scrolling page
  // list plus a full-height "On this page" panel.

  let { slug, toc = [], activeId = "" }: { slug: string | null; toc?: TocEntry[]; activeId?: string } = $props()

  const pages = bookPages.filter((page) => page.slug !== "")
  const adjacent = $derived(getAdjacentBookPages(slug ?? ""))

  const inlinePadding =
    "px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-[max(1.25rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.25rem,env(safe-area-inset-right,0px))]"
  const iconButton =
    "inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border-0 bg-transparent p-0 text-foreground transition-opacity duration-200 hover:opacity-75 focus-visible:ring-0 active:opacity-60"

  const indent = (depth: number) => (depth <= 2 ? "" : depth === 3 ? "pl-3" : depth === 4 ? "pl-6" : "pl-9")

  let scroller = $state<HTMLDivElement>()
  let open = $state(false)

  // Headings carry a scroll-margin that clears this bar, so scrollIntoView lands right.
  function goTo(id: string) {
    open = false
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    replaceState(`#${id}`, page.state)
  }

  // Keep the current page centred in the horizontal list.
  afterNavigate(() => {
    open = false
    const link = scroller?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!scroller || !link) return
    const box = scroller.getBoundingClientRect()
    const rect = link.getBoundingClientRect()
    scroller.scrollLeft += rect.left - box.left - (box.width - rect.width) / 2
  })
</script>

<nav
  aria-label="Book pages"
  data-pagefind-ignore="all"
  class="book-mobile-breadcrumb bg-background lg:hidden border-b border-border {inlinePadding}"
>
  <div class="flex min-h-11 items-stretch gap-1">
    <div
      bind:this={scroller}
      class="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div class="flex w-max items-center gap-0.5 py-2 pr-2">
        {#each pages as item (item.href)}
          {@const active = item.slug === slug}
          <a
            href={item.href}
            aria-current={active ? "page" : undefined}
            class="inline-flex shrink-0 touch-manipulation items-center whitespace-nowrap px-3 py-1.5 text-sm leading-none transition-colors duration-200 no-underline hover:no-underline {active
              ? 'font-semibold text-foreground'
              : 'font-normal text-muted-foreground hover:text-foreground'}"
            style="text-decoration:none">{item.title}</a
          >
        {/each}
      </div>
    </div>

    {#if toc.length > 0}
      <div class="flex shrink-0 items-center border-l border-border pl-1">
        <button
          type="button"
          aria-label={open ? "Close on this page" : "Open on this page"}
          aria-expanded={open}
          onclick={() => (open = !open)}
          class={iconButton}
        >
          <ChevronDown
            class="h-6 w-6 transition-transform duration-300 {open ? 'rotate-180' : ''}"
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>
    {/if}
  </div>
</nav>
<div aria-hidden="true" class="book-mobile-breadcrumb-spacer lg:hidden"></div>

{#if toc.length > 0}
  <div
    aria-hidden={!open}
    data-open={open ? "true" : "false"}
    class="book-mobile-toc-panel fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden bg-background transition-[height] duration-300 ease-out lg:hidden {open
      ? ''
      : 'pointer-events-none'}"
  >
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-border pb-4 pt-4 {inlinePadding}">
      <p class="mb-3 text-xs font-semibold text-muted-foreground">On this page</p>
      <ul class="space-y-1">
        {#each toc as item (item.id)}
          <li class={indent(item.depth)}>
            <a
              href="#{item.id}"
              onclick={(event) => {
                event.preventDefault()
                goTo(item.id)
              }}
              class="block break-words rounded px-1 py-1.5 text-sm leading-snug transition-colors {activeId === item.id
                ? 'font-semibold text-foreground'
                : 'text-muted-foreground hover:text-foreground'}">{item.text}</a
            >
          </li>
        {/each}
      </ul>
    </div>

    {#if adjacent.prev || adjacent.next}
      <div
        class="shrink-0 flex items-center gap-3 border-t border-border pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] {inlinePadding}"
      >
        {#if adjacent.prev}
          <a
            href={adjacent.prev.href}
            class="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft class="h-4 w-4 shrink-0" aria-hidden="true" />
            <span class="truncate">{adjacent.prev.title}</span>
          </a>
        {:else}
          <span class="flex-1"></span>
        {/if}
        {#if adjacent.next}
          <a
            href={adjacent.next.href}
            class="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span class="truncate">{adjacent.next.title}</span>
            <ChevronRight class="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        {:else}
          <span class="flex-1"></span>
        {/if}
      </div>
    {/if}
  </div>
{/if}
