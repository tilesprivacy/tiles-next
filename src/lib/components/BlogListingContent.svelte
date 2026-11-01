<script lang="ts" module>
  export interface BlogListingPost {
    slug: string
    title: string
    description: string
    date: Date
    author?: string
    coverImage?: string
    coverImageDark?: string
    listingImage?: string
    listingImageDark?: string
    listingImagePosition?: "left" | "center" | "right"
    coverAlt?: string
  }
</script>

<script lang="ts">
  import { onMount } from "svelte"
  import {
    marketingPageBodyClass,
    marketingPageMetaClass,
    marketingPageTitleClass,
  } from "#lib/marketing-page-title-classes"
  import { getPersonById } from "#lib/people"
  import BlogAuthorDisplayName from "./BlogAuthorDisplayName.svelte"
  import NewsletterCta from "./NewsletterCta.svelte"
  import PersonAvatar from "./PersonAvatar.svelte"
  import SiteFooter from "./SiteFooter.svelte"

  let { posts }: { posts: BlogListingPost[] } = $props()

  // "N days ago" depends on today, so it is recomputed in the browser rather
  // than frozen at build time.
  let now = $state(Date.now())
  onMount(() => {
    now = Date.now()
  })

  function formatDate(date: Date): string {
    const diffDays = Math.floor(Math.abs(now - date.getTime()) / (1000 * 60 * 60 * 24))
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
    return `Published ${diffDays} days ago (${dateStr})`
  }

  function postImage(post: BlogListingPost) {
    const src = post.listingImage || post.coverImage || "/og-image.jpg"
    return {
      src,
      srcDark: post.listingImage ? post.listingImageDark || post.listingImage : post.coverImageDark || src,
      alt: post.coverAlt || post.title,
    }
  }

  function positionClass(position: BlogListingPost["listingImagePosition"]) {
    return position === "left" ? "object-left" : position === "right" ? "object-right" : "object-center"
  }

  function fallback(event: Event) {
    const img = event.currentTarget as HTMLImageElement
    if (!img.src.endsWith("/og-image.jpg")) img.src = "/og-image.jpg"
  }

  const linkClass =
    "text-foreground underline decoration-black/25 underline-offset-2 transition-colors hover:text-foreground/80 hover:decoration-black/40 dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/40"
</script>

<div data-blog-page class="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
  <main class="flex flex-1 flex-col px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
    <div class="mx-auto w-full max-w-3xl">
      <div class="mb-10 lg:mb-12">
        <h1 class="mb-4 {marketingPageTitleClass}">Blog</h1>
        <section data-blog-newsletter class="mx-auto w-full max-w-3xl pb-1">
          <NewsletterCta />
        </section>
      </div>
    </div>

    <div class="mx-auto w-full max-w-3xl flex-1 pb-4 lg:pb-10">
      <div class="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
        {#each posts as post (post.slug)}
          {@const image = postImage(post)}
          {@const imageClass = positionClass(post.listingImagePosition)}
          {@const author = post.author ? getPersonById(post.author) : null}
          <a href="/blog/{post.slug}" class="group block">
            <article class="grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-6 sm:py-9 lg:grid-cols-[minmax(0,1fr)_11rem]">
              <div class="space-y-3 sm:space-y-4">
                <div class="flex flex-col gap-2 sm:gap-2.5 {marketingPageMetaClass}">
                  <span>{formatDate(post.date)}</span>
                  {#if author}
                    <span class="inline-flex items-center gap-1.5">
                      <PersonAvatar name={author.name} links={author.links} variant="blog" className="inline-flex shrink-0" />
                      <BlogAuthorDisplayName
                        fullName={author.name}
                        className="text-black/60 dark:text-white/60"
                        handleClassName="text-black/45 dark:text-white/45"
                      />
                    </span>
                  {/if}
                </div>

                <h2 class="text-[1.125rem] font-medium leading-[1.3] tracking-[-0.01em] text-black/90 transition-colors group-hover:text-black/72 dark:text-white/90 dark:group-hover:text-white/76 sm:text-[1.25rem]">
                  {post.title}
                </h2>

                <p class={marketingPageBodyClass}>{post.description}</p>

                <p class="pt-1 text-xs font-medium text-black/70 transition-colors group-hover:text-black dark:text-white/70 dark:group-hover:text-white lg:text-sm">
                  Read post
                </p>
              </div>

              <div>
                <div class="relative aspect-square overflow-hidden rounded-sm border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]">
                  <img
                    src={image.src}
                    alt={image.alt}
                    width="900"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    class="h-full w-full object-cover {imageClass} transition-transform duration-500 group-hover:scale-[1.03] dark:hidden"
                    onerror={fallback}
                  />
                  <img
                    src={image.srcDark}
                    alt={image.alt}
                    width="900"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    class="hidden h-full w-full object-cover {imageClass} transition-transform duration-500 group-hover:scale-[1.03] dark:block"
                    onerror={fallback}
                  />
                </div>
              </div>
            </article>
          </a>
        {/each}
      </div>
    </div>

    <div class="mx-auto w-full max-w-3xl pt-6 lg:pt-8">
      <p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        Posts here use the <a href="https://standard.site" target="_blank" rel="noopener noreferrer" class={linkClass}>Standard.site</a> lexicon for rich presentation in supported ATproto clients and are stored on a PDS hosted by <a href="https://eurosky.tech" target="_blank" rel="noopener noreferrer" class={linkClass}>Eurosky</a>.
      </p>
    </div>
  </main>

  <SiteFooter />
</div>
