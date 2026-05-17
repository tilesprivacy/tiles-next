'use client'

import Link from 'next/link'
import { PersonAvatar } from '@/components/person-avatar'
import { getResearchAuthors } from '@/lib/research-authors'
import { splitPersonDisplayName } from '@/lib/people'
import {
  formatResearchLogMonthLabel,
  type ResearchExplorationBadge,
  type ResearchLogEntry,
} from '@/lib/research-log'

const badgeClassName: Record<ResearchExplorationBadge, string> = {
  'napkin-sketch':
    'bg-[#DDEBFF] text-[#1F5FA8] dark:bg-[#243B5A] dark:text-[#BFD8FF]',
  'experimental-prototype':
    'bg-[#E8D5F2] text-[#6B2E99] dark:bg-[#3A2A4A] dark:text-[#D4C5E8]',
}

const badgeLabel: Record<ResearchExplorationBadge, string> = {
  'napkin-sketch': 'NAPKIN SKETCH',
  'experimental-prototype': 'EXPERIMENTAL PROTOTYPE',
}

export function ResearchProjectsCarousel({ entries }: { entries: ResearchLogEntry[] }) {
  if (entries.length === 0) return null

  return (
    <div className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
      {entries.map((entry) => (
        <ResearchProjectEntry key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

function ResearchProjectEntry({ entry }: { entry: ResearchLogEntry }) {
  const authors = getResearchAuthors(entry)

  return (
    <Link href={`/research/${entry.id}`} className="group block">
      <article className="py-6 sm:py-9">
        <div className="mb-5 flex items-start justify-between gap-5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-black/40 dark:text-white/40 sm:mb-6">
          {entry.badge ? (
            <span
              className={`rounded px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${badgeClassName[entry.badge]}`}
            >
              {badgeLabel[entry.badge]}
            </span>
          ) : (
            <span />
          )}
          <span className="shrink-0 pt-1 text-right">{formatResearchLogMonthLabel(entry.logMonth)}</span>
        </div>

        <div className="max-w-full sm:max-w-[74%]">
          <h3 className="text-[1.18rem] font-medium leading-tight tracking-[-0.02em] text-black/90 transition-colors group-hover:text-black/72 dark:text-white/90 dark:group-hover:text-white/76 sm:text-[1.36rem] lg:text-[1.82rem]">
            {entry.title}
          </h3>
        </div>

        <p className="mt-3 max-w-[42rem] line-clamp-3 text-[0.92rem] leading-6 text-black/60 dark:text-white/60 sm:max-w-[78%] sm:line-clamp-2 sm:text-[0.98rem] sm:leading-7">
          {entry.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-5 text-xs text-black/45 dark:text-white/45 sm:pt-6 sm:text-[0.82rem]">
          {authors.map((author) => {
            const { nameWithoutHandle, handle } = splitPersonDisplayName(author.name)

            return (
              <span key={author.id} className="inline-flex items-center gap-1.5">
                <PersonAvatar
                  name={author.name}
                  links={author.links}
                  variant="blog"
                  className="inline-flex shrink-0"
                />
                <span>
                  {nameWithoutHandle}
                  {handle ? (
                    <span className="text-black/38 dark:text-white/38"> {handle}</span>
                  ) : null}
                </span>
              </span>
            )
          })}
        </div>

        <p className="pt-2.5 text-xs font-medium text-black/68 transition-colors group-hover:text-black dark:text-white/68 dark:group-hover:text-white lg:text-sm">
          Read research →
        </p>
      </article>
    </Link>
  )
}
