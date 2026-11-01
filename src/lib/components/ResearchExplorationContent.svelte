<script lang="ts">
  import type { Snippet } from "svelte"
  import { blogArticleProseClass } from "#lib/blog-article-prose-classes"
  import { marketingPageArticleTitleClass } from "#lib/marketing-page-title-classes"
  import { getResearchAuthors } from "#lib/research-authors"
  import { formatResearchLogMonthLabel, type ResearchLogEntry } from "#lib/research-log"
  import type { TocItem } from "#lib/toc"
  import ArticleShareAndNewsletter from "./ArticleShareAndNewsletter.svelte"
  import BlogAuthorDisplayName from "./BlogAuthorDisplayName.svelte"
  import BlogTableOfContents from "./BlogTableOfContents.svelte"
  import PersonAvatar from "./PersonAvatar.svelte"
  import ResearchBadge from "./ResearchBadge.svelte"
  import SiteFooter from "./SiteFooter.svelte"
  import SocialLinks from "./SocialLinks.svelte"

  let {
    entry,
    toc,
    markdown = false,
    children,
  }: {
    entry: ResearchLogEntry
    toc: TocItem[]
    /** True when the body is a content/research markdown page rather than a single paragraph. */
    markdown?: boolean
    children: Snippet
  } = $props()
</script>

<div class="relative flex min-h-screen flex-col bg-background">
  <main class="flex flex-1 flex-col items-center gap-6 overflow-x-clip px-6 pb-20 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 lg:gap-12 lg:px-10 lg:pb-24 lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] xl:px-12">
    <div class="relative w-full max-w-[90rem] py-8 lg:py-14">
      <div class="mx-auto mb-12 flex max-w-[44rem] flex-col gap-6 lg:mb-16 lg:gap-7">
        <h1 class="max-w-[15ch] sm:max-w-[18ch] lg:max-w-[20ch] {marketingPageArticleTitleClass}">{entry.title}</h1>
        <p class="max-w-[39rem] text-[0.98rem] leading-[1.75] text-black/52 dark:text-white/52 lg:text-[1.02rem]">
          {entry.description}
        </p>

        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span class="font-mono text-[0.78rem] tabular-nums text-black/52 dark:text-white/52 sm:text-[0.84rem]">
            {formatResearchLogMonthLabel(entry.logMonth)}
          </span>
          {#if entry.badge}<ResearchBadge badge={entry.badge} />{/if}
        </div>

        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          {#each getResearchAuthors(entry) as author (author.id)}
            <span class="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <PersonAvatar name={author.name} links={author.links} variant="blog" className="inline-flex shrink-0" />
              <BlogAuthorDisplayName
                fullName={author.name}
                className="whitespace-nowrap text-[0.84rem] text-black/56 dark:text-white/56 lg:text-[0.92rem]"
                handleClassName="text-black/40 dark:text-white/40"
              />
              <SocialLinks
                name={author.name}
                links={author.links}
                className="-my-1 flex shrink-0 items-center gap-0"
                linkClassName="inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-md text-black/34 transition-colors hover:bg-black/5 hover:text-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60 dark:text-white/34 dark:hover:bg-white/8 dark:hover:text-white/65 dark:focus-visible:outline-white/60"
                iconClassName="h-3.5 w-3.5"
              />
            </span>
          {/each}
        </div>
      </div>

      <div class="mx-auto mb-8 max-w-[44rem] lg:mb-16 xl:hidden">
        <BlogTableOfContents mode="mobile" items={toc} />
      </div>

      <div class="xl:grid xl:grid-cols-[minmax(14rem,1fr)_minmax(0,44rem)_minmax(14rem,1fr)] xl:gap-x-10">
        <aside class="hidden xl:block">
          <BlogTableOfContents items={toc} />
        </aside>

        <article class="blog-article-container relative mx-auto max-w-[44rem] xl:mx-0 xl:max-w-none">
          <div class="research-exploration-article {blogArticleProseClass} research-memory-mdx" class:research-markdown={markdown}>
            {@render children()}
          </div>
        </article>

        <div class="hidden xl:block" aria-hidden="true"></div>
      </div>

      <ArticleShareAndNewsletter
        title={entry.title}
        moreLinkHref="/book/research"
        moreLinkLabel="more research explorations"
      />
    </div>
  </main>

  <SiteFooter />
</div>

<style>
  /* Markdown research bodies keep the documentation look they were written with. */
  .research-markdown :global {
    p {
      line-height: 1.75rem;
    }
    :is(p, ul, ol, pre):not(:first-child) {
      margin-top: 1.25em;
    }
    li {
      margin-top: 0.5em;
    }
    h2 {
      border-bottom: 1px solid rgb(229 231 235);
      padding-bottom: 0.25rem;
    }
    :not(pre) > code {
      border: 1px solid rgb(0 0 0 / 0.04);
      border-radius: 0.375em;
      background-color: rgb(0 0 0 / 0.03);
      padding: 0.12em 0.25em;
      font-size: 0.9em;
      line-height: calc(1.25 / 0.875);
    }
    .shiki span[style] {
      color: var(--shiki-light);
    }
    .research-figure-caption {
      margin-top: 0.75rem;
      font-size: 0.875rem;
      line-height: 1.4;
      color: #666;
      text-align: center;
      font-style: italic;
    }
  }
  :global(.dark) .research-markdown :global {
    h2 {
      border-color: rgb(38 38 38);
    }
    .shiki span[style] {
      color: var(--shiki-dark);
    }
    :not(pre) > code {
      border-color: rgb(255 255 255 / 0.1);
      background-color: rgb(255 255 255 / 0.1);
    }
  }
</style>
