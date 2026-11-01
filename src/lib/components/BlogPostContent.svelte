<script lang="ts">
  import type { Snippet } from "svelte"
  import { onMount } from "svelte"
  import { ArrowLeft } from "@lucide/svelte"
  import { blogArticleProseClass } from "#lib/blog-article-prose-classes"
  import { marketingPageArticleTitleClass } from "#lib/marketing-page-title-classes"
  import { getPersonById } from "#lib/people"
  import type { TocItem } from "#lib/toc"
  import { TILES_PRODUCT_DESCRIPTION_CORE, TILES_PRODUCT_TECHNOLOGY_LINE } from "#lib/product-description"
  import ArticleShareAndNewsletter from "./ArticleShareAndNewsletter.svelte"
  import BlogAuthorDisplayName from "./BlogAuthorDisplayName.svelte"
  import BlogDiscussion from "./BlogDiscussion.svelte"
  import BlogReadingProgress from "./BlogReadingProgress.svelte"
  import BlogTableOfContents from "./BlogTableOfContents.svelte"
  import PersonAvatar from "./PersonAvatar.svelte"
  import ReadingTime from "./ReadingTime.svelte"
  import SiteFooter from "./SiteFooter.svelte"
  import SocialLinks from "./SocialLinks.svelte"

  let {
    title,
    description,
    date,
    authorId,
    coverImage,
    coverImageDark,
    coverAlt,
    coverImageWidth = 1200,
    coverImageHeight = 600,
    printCoverImage,
    standardSiteDocumentUri,
    blueskyPostUri,
    content,
    showTableOfContents = true,
    tocItems = [],
    children,
  }: {
    title: string
    description: string
    date: string
    /** Person ID from `people.ts`. */
    authorId?: string
    coverImage?: string
    coverImageDark?: string
    coverAlt?: string
    coverImageWidth?: number
    coverImageHeight?: number
    /** Print-only cover for posts whose cover is only used for social cards and the listing. */
    printCoverImage?: string
    standardSiteDocumentUri?: string
    blueskyPostUri?: string
    /** Article HTML, used for the reading time. */
    content: string
    showTableOfContents?: boolean
    tocItems?: TocItem[]
    children: Snippet
  } = $props()

  const outroLine = `Tiles is ${TILES_PRODUCT_DESCRIPTION_CORE.charAt(0).toLowerCase()}${TILES_PRODUCT_DESCRIPTION_CORE.slice(1)}`

  const author = $derived(authorId ? getPersonById(authorId) : null)
  // Print forces a white page, so always prefer the light cover variant.
  const printCover = $derived(coverImage ?? printCoverImage)
  // Skip the print cover when the article already shows the same image.
  const coverInArticleBody = $derived(!!printCover && content.includes(`src="${printCover}"`))
  const standardSiteDocumentUrl = $derived(
    standardSiteDocumentUri?.startsWith("at://")
      ? `https://atproto.at/viewer?uri=${encodeURIComponent(standardSiteDocumentUri.slice("at://".length))}`
      : null,
  )

  let article: HTMLElement

  onMount(() => {
    // Wrap toggles on JSON code blocks (markup comes from markdown.server.ts).
    const onClick = (event: MouseEvent) => {
      const toggle = (event.target as HTMLElement).closest<HTMLButtonElement>(".article-code-wrap-toggle")
      const pre = toggle?.parentElement?.querySelector("pre")
      if (!toggle || !pre) return
      const wrapped = pre.dataset.codeWrap !== "true"
      pre.dataset.codeWrap = String(wrapped)
      toggle.setAttribute("aria-pressed", String(wrapped))
      toggle.textContent = wrapped ? "Unwrap" : "Wrap"
      toggle.setAttribute("aria-label", wrapped ? "Show JSON without line wrapping" : "Wrap JSON lines")
      if (wrapped) pre.scrollLeft = 0
    }
    article.addEventListener("click", onClick)

    // Silent clips play once they come near the viewport instead of
    // downloading in full on page load.
    const videos = Array.from(article.querySelectorAll<HTMLVideoElement>("video[data-play-on-approach]"))
    const play = (video: HTMLVideoElement) => {
      video.muted = true
      video.play().catch(() => {})
    }
    let observer: IntersectionObserver | null = null
    if (!("IntersectionObserver" in window)) {
      videos.forEach(play)
    } else if (videos.length) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            play(entry.target as HTMLVideoElement)
            observer?.unobserve(entry.target)
          }
        },
        { rootMargin: "800px 0px" },
      )
      videos.forEach((video) => observer?.observe(video))
    }

    return () => {
      article.removeEventListener("click", onClick)
      observer?.disconnect()
    }
  })
</script>

<div data-blog-page data-blog-article class="relative flex min-h-screen flex-col bg-background">
  <main class="flex flex-1 flex-col items-center gap-6 overflow-x-clip px-6 pb-0 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 lg:gap-12 lg:px-10 lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] xl:overflow-visible xl:px-12">
    <div class="blog-article-column relative w-full max-w-[90rem] py-8 lg:py-14 xl:grid xl:grid-cols-[minmax(14rem,1fr)_minmax(0,44rem)_minmax(14rem,1fr)] xl:gap-x-10">
      <div class="mx-auto w-full max-w-[44rem] overflow-x-clip xl:col-start-2 xl:row-start-1 xl:mx-0 xl:max-w-none xl:overflow-visible">
        <div data-blog-print-masthead class="mb-0 hidden print:flex print:items-center print:gap-2.5" aria-hidden="true">
          <!-- Plain img keeps print/PDF output reliable across browsers. -->
          <img src="/lighticon.png" alt="" width="48" height="48" class="h-8 w-8 print:h-11 print:w-11" />
          <span class="text-[1.15rem] font-semibold tracking-[-0.02em] text-black print:text-[2.35rem] print:leading-none">Tiles</span>
        </div>

        <a
          href="/blog"
          class="blog-print-screen-only group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-black/52 transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/60 lg:mb-8 lg:text-[0.95rem] dark:text-white/52 dark:hover:text-white dark:focus-visible:outline-white/60"
        >
          <ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
          Back to blog
        </a>

        <div data-blog-print-header class="mb-8 lg:mb-12">
          <h1 class="mb-4 lg:mb-4 {marketingPageArticleTitleClass}">{title}</h1>
          <p
            data-blog-print-subtitle
            class="mb-4 text-[0.98rem] leading-[1.65] text-black/56 dark:text-white/56 lg:mb-4 lg:text-[1.06rem]"
          >
            {description}
          </p>
          <div data-blog-print-meta class="flex flex-col gap-2">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p class="text-sm text-black/42 dark:text-white/42 lg:text-[0.95rem]">{date}</p>
              <span class="text-black/20 dark:text-white/20" aria-hidden="true">·</span>
              <ReadingTime {content} className="text-sm text-black/42 dark:text-white/42 lg:text-[0.95rem]" />
            </div>
            {#if author}
              <div class="mt-0.5 flex items-center gap-1.5">
                <div class="flex min-w-0 items-center gap-1.5">
                  <PersonAvatar name={author.name} links={author.links} variant="blog" loading="eager" className="inline-flex shrink-0" />
                  <BlogAuthorDisplayName
                    fullName={author.name}
                    className="whitespace-nowrap text-sm text-black/58 dark:text-white/58 lg:text-[0.95rem]"
                    handleClassName="text-black/44 dark:text-white/44"
                  />
                </div>
                <SocialLinks
                  name={author.name}
                  links={author.links}
                  className="blog-print-screen-only flex shrink-0 items-center gap-0"
                  linkClassName="inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-md text-black/40 transition-colors hover:bg-black/5 hover:text-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60 dark:text-white/40 dark:hover:bg-white/8 dark:hover:text-white/70 dark:focus-visible:outline-white/60"
                  iconClassName="h-3.5 w-3.5 lg:h-4 lg:w-4"
                />
              </div>
            {/if}
          </div>
        </div>

        {#if printCover && !coverInArticleBody}
          <div data-blog-print-cover class="hidden" aria-hidden="true">
            <img src={printCover} alt={coverAlt ?? title} width={coverImageWidth} height={coverImageHeight} />
          </div>
        {/if}

        {#if showTableOfContents}
          <BlogTableOfContents mode="print" items={tocItems} />
        {/if}

        {#if coverImage}
          <div class="blog-print-screen-only mb-8 lg:mb-16">
            <!-- The cover is the LCP element, so it never lazy-loads. -->
            {#if coverImageDark}
              <img src={coverImage} alt={coverAlt ?? title} width={coverImageWidth} height={coverImageHeight} fetchpriority="high" loading="eager" decoding="async" class="w-full h-auto rounded-lg dark:hidden" />
              <img src={coverImageDark} alt={coverAlt ?? title} width={coverImageWidth} height={coverImageHeight} fetchpriority="high" loading="eager" decoding="async" class="hidden w-full h-auto rounded-lg dark:block" />
            {:else}
              <img src={coverImage} alt={coverAlt ?? title} width={coverImageWidth} height={coverImageHeight} fetchpriority="high" loading="eager" decoding="async" class="w-full h-auto rounded-lg" />
            {/if}
          </div>
        {/if}

        {#if showTableOfContents}
          <div class="blog-print-screen-only mb-8 lg:mb-16 xl:hidden">
            <BlogTableOfContents mode="mobile" items={tocItems} />
          </div>
        {/if}
      </div>

      {#if showTableOfContents}
        <aside class="blog-print-screen-only hidden xl:col-start-1 xl:row-start-2 xl:block xl:min-h-0 xl:self-stretch">
          <BlogTableOfContents items={tocItems} />
        </aside>
      {/if}

      <article
        bind:this={article}
        class="blog-article-container relative mx-auto w-full max-w-[44rem] xl:col-start-2 xl:row-start-2 xl:mx-0 xl:max-w-none"
      >
        <div class="blog-reference-container hidden xl:block absolute left-0 top-0 w-full h-full pointer-events-none"></div>

        <div class={blogArticleProseClass}>
          {@render children()}
        </div>
        <div class="blog-print-screen-only mt-10 space-y-2 text-xs text-black/60 dark:text-white/60 lg:mt-12 lg:text-sm">
          <p>
            <span class="block">{outroLine}</span>
            <span class="block">{TILES_PRODUCT_TECHNOLOGY_LINE}</span>
          </p>
          <p>
            There are <a href="/blog" class="text-black underline hover:text-black/80 dark:text-white dark:hover:text-white/80">more posts</a>.
          </p>
          <p>Keep on Tiling!</p>
        </div>
        {#if blueskyPostUri}
          <BlogDiscussion {blueskyPostUri} />
        {/if}
        {#if standardSiteDocumentUri}
          <div
            class="blog-print-screen-only text-xs leading-6 text-black/54 dark:text-white/54 lg:text-sm {blueskyPostUri
              ? 'mt-6'
              : 'mt-10 border-t border-black/8 pt-5 dark:border-white/10'}"
          >
            <span>Published on ATproto: </span>
            {#if standardSiteDocumentUrl}
              <a
                href={standardSiteDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="break-all text-black underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/80 hover:decoration-black/40 dark:text-white dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/40"
              >{standardSiteDocumentUri}</a>
            {:else}
              <span class="break-all">{standardSiteDocumentUri}</span>
            {/if}
            <span>.</span>
          </div>
        {/if}
      </article>

      <div class="hidden xl:col-start-3 xl:row-start-2 xl:block" aria-hidden="true"></div>

      <div class="mx-auto w-full max-w-[44rem] xl:col-start-2 xl:row-start-3 xl:mx-0 xl:max-w-none">
        <div data-blog-article-footer>
          <ArticleShareAndNewsletter {title} moreLinkHref="/blog" moreLinkLabel="more posts" showIntro={false} />
        </div>

        <div data-blog-print-footer class="mt-0 hidden print:block">
          <p>© 2026 Tiles Privacy Technologies Pvt. Ltd.</p>
          <p>WeWork Prestige Atlanta, 80 Feet Rd</p>
          <p>Koramangala</p>
          <p>Bengaluru 560024</p>
          <p>India</p>
        </div>
      </div>
    </div>
  </main>

  <BlogReadingProgress />

  <SiteFooter />
</div>
