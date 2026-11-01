<script lang="ts">
  import BookCopyPage from "#lib/components/book/BookCopyPage.svelte"
  import BookMobileBar from "#lib/components/book/BookMobileBar.svelte"
  import BookPageCards from "#lib/components/book/BookPageCards.svelte"
  import BookPageNavigation from "#lib/components/book/BookPageNavigation.svelte"
  import BookSidebar from "#lib/components/book/BookSidebar.svelte"
  import BookToc from "#lib/components/book/BookToc.svelte"
  import { ActiveHeading } from "#lib/components/book/active-heading.svelte"
  import { absoluteUrl } from "#lib/absolute-url"
  import { getSocialImageUrl } from "#lib/social-image"

  let { data } = $props()

  const meta = $derived(data.meta)
  const isIndex = $derived(meta.slug === "")
  const title = $derived(isIndex ? "Tiles Book: Technical documentation for Tiles and Tilekit" : `${meta.title} | Tiles Book`)
  const description = $derived(
    isIndex
      ? "Technical documentation covering the models, infrastructure, and cryptography behind Tiles, the consumer product, and Tilekit, the developer-facing SDK written in Rust."
      : meta.description,
  )
  const image = absoluteUrl(getSocialImageUrl())

  const repo = "https://github.com/tilesprivacy/tiles-next"
  const feedbackHref = $derived(
    `${repo}/issues/new?title=${encodeURIComponent(`Feedback for “${meta.title}”`)}&labels=feedback`,
  )
  const editHref = $derived(`${repo}/tree/main/content/book/${meta.slug || "index"}.md`)

  const updated = $derived(new Date(meta.lastUpdated))
  const updatedLabel = $derived(
    updated.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Kolkata" }),
  )

  const active = new ActiveHeading()
  $effect(() => active.track(data.toc.map((item) => item.id)))

  // Code blocks are static markup from the build; one listener handles every copy button.
  function onCopyClick(event: MouseEvent) {
    const button = (event.target as Element).closest<HTMLButtonElement>(".book-code-copy")
    const code = button?.parentElement?.querySelector("pre")?.textContent
    if (!button || code == null) return
    navigator.clipboard.writeText(code).then(
      () => {
        button.dataset.copied = ""
        setTimeout(() => delete button.dataset.copied, 2000)
      },
      () => {},
    )
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={title} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>

<BookMobileBar slug={meta.slug} toc={data.toc} activeId={active.id} />

<div class="book-layout">
  <BookSidebar slug={meta.slug} />
  <BookToc toc={data.toc} activeId={active.id} {feedbackHref} {editHref} />
  <article class="book-article">
    <BookCopyPage markdown={data.markdown} />
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
    <main onclick={onCopyClick}>
      <h1>{meta.heading}</h1>
      <div class="book-datestamp">Last updated on <time datetime={updated.toISOString()}>{updatedLabel}</time></div>
      <data.content />
      {#if isIndex}<BookPageCards />{/if}
      <BookPageNavigation slug={meta.slug} />
    </main>
  </article>
</div>
