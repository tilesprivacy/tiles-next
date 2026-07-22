import type { ReactNode } from 'react'
import { BlogTableOfContents } from '@/components/blog-table-of-contents'
import { PersonAvatar } from '@/components/person-avatar'
import { SocialLinks } from '@/components/social-links'
import { blogArticleProseClass } from '@/lib/blog-article-prose-classes'
import { getResearchAuthors } from '@/lib/research-authors'
import { splitPersonDisplayName } from '@/lib/people'
import {
  formatResearchLogMonthLabel,
  type ResearchExplorationBadge,
  type ResearchLogEntry,
} from '@/lib/research-log'
import { ArticleShareAndNewsletter } from '@/components/article-share-and-newsletter'
import { SiteFooter } from '@/components/site-footer'
import { marketingPageArticleTitleClass } from '@/lib/marketing-page-title-classes'

const badgeClassName: Record<ResearchExplorationBadge, string> = {
  'napkin-sketch':
    'bg-[#DDEBFF] text-[#1F5FA8] dark:bg-[#243B5A] dark:text-[#BFD8FF]',
  'experimental-prototype':
    'bg-[#E8D5F2] text-[#6B2E99] dark:bg-[#3A2A4A] dark:text-[#D4C5E8]',
  wip: 'bg-black/[0.06] text-black/62 dark:bg-white/[0.1] dark:text-white/72',
}

const badgeLabel: Record<ResearchExplorationBadge, string> = {
  'napkin-sketch': 'NAPKIN SKETCH',
  'experimental-prototype': 'EXPERIMENTAL PROTOTYPE',
  wip: 'WIP',
}

export function ResearchExplorationContent({
  entry,
  children,
}: {
  entry: ResearchLogEntry
  children: ReactNode
}) {
  const monthLabel = formatResearchLogMonthLabel(entry.logMonth)
  const authors = getResearchAuthors(entry)

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col items-center gap-6 overflow-x-clip px-6 pb-20 pt-[calc(7rem+env(safe-area-inset-top,0px))] sm:px-8 lg:gap-12 lg:px-10 lg:pb-24 lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] xl:px-12">
        <div className="relative w-full max-w-[90rem] py-8 lg:py-14">
          <div className="mx-auto mb-12 flex max-w-[44rem] flex-col gap-6 lg:mb-16 lg:gap-7">
            <h1 className={`max-w-[15ch] sm:max-w-[18ch] lg:max-w-[20ch] ${marketingPageArticleTitleClass}`}>
              {entry.title}
            </h1>
            <p className="max-w-[39rem] text-[0.98rem] leading-[1.75] text-black/52 dark:text-white/52 lg:text-[1.02rem]">
              {entry.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-[0.78rem] tabular-nums text-black/52 dark:text-white/52 sm:text-[0.84rem]">
                {monthLabel}
              </span>
              {entry.badge ? (
                <span
                  className={`inline-flex rounded px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${badgeClassName[entry.badge]}`}
                >
                  {badgeLabel[entry.badge]}
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {authors.map((author) => {
                  const { nameWithoutHandle, handle } = splitPersonDisplayName(author.name)

                  return (
                    <span key={author.id} className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <PersonAvatar
                        name={author.name}
                        links={author.links}
                        variant="blog"
                        className="inline-flex shrink-0"
                      />
                      <span className="whitespace-nowrap text-[0.84rem] text-black/56 dark:text-white/56 lg:text-[0.92rem]">
                        {nameWithoutHandle}
                        {handle ? (
                          <span className="text-black/40 dark:text-white/40"> {handle}</span>
                        ) : null}
                      </span>
                      <SocialLinks
                        name={author.name}
                        links={author.links}
                        className="-my-1 flex shrink-0 items-center gap-0"
                        linkClassName="inline-flex h-8 w-8 touch-manipulation items-center justify-center rounded-md text-black/34 transition-colors hover:bg-black/5 hover:text-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60 dark:text-white/34 dark:hover:bg-white/8 dark:hover:text-white/65 dark:focus-visible:outline-white/60"
                        iconClassName="h-3.5 w-3.5"
                      />
                    </span>
                  )
                })}
            </div>
          </div>

          <div className="mx-auto mb-8 max-w-[44rem] lg:mb-16 xl:hidden">
            <BlogTableOfContents mode="mobile" />
          </div>

          <div className="xl:grid xl:grid-cols-[minmax(14rem,1fr)_minmax(0,44rem)_minmax(14rem,1fr)] xl:gap-x-10">
            <aside className="hidden xl:block">
              <BlogTableOfContents />
            </aside>

            <article className="blog-article-container relative mx-auto max-w-[44rem] xl:mx-0 xl:max-w-none">
              <div
                className={`research-exploration-article ${blogArticleProseClass} research-memory-mdx`}
              >
                {children}
              </div>
            </article>

            <div className="hidden xl:block" aria-hidden="true" />
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
  )
}
