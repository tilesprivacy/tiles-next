'use client'

import Link from 'next/link'
import { PersonAvatar } from '@/components/person-avatar'
import { getResearchAuthors } from '@/lib/research-authors'
import { splitPersonDisplayName } from '@/lib/people'
import {
  formatResearchListingMonthYear,
  type ResearchExplorationBadge,
  type ResearchLogEntry,
} from '@/lib/research-log'

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

export function ResearchProjectsCarousel({ entries }: { entries: ResearchLogEntry[] }) {
  if (entries.length === 0) return null

  return (
    <>
      {entries.map((entry) => (
        <ResearchProjectEntry key={entry.id} entry={entry} />
      ))}
    </>
  )
}

function ResearchProjectEntry({ entry }: { entry: ResearchLogEntry }) {
  const authors = getResearchAuthors(entry)
  const monthYear = formatResearchListingMonthYear(entry.logMonth)

  return (
    <Link href={`/research/${entry.id}`} className="group block">
      <article className="py-6 sm:py-9">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mb-5">
          <span className="font-mono text-[0.78rem] tabular-nums text-black/52 dark:text-white/52 sm:text-[0.84rem]">
            {monthYear}
          </span>
          {entry.badge ? (
            <span
              className={`inline-flex rounded px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${badgeClassName[entry.badge]}`}
            >
              {badgeLabel[entry.badge]}
            </span>
          ) : null}
        </div>

        <h3 className="text-[1.375rem] font-normal leading-[1.25] tracking-[-0.0125em] text-black/90 transition-colors group-hover:text-black/72 dark:text-white/90 dark:group-hover:text-white/76 lg:text-[1.625rem]">
          {entry.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-[0.92rem] leading-6 text-black/60 dark:text-white/60 sm:line-clamp-2 sm:text-[0.98rem] sm:leading-7">
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

        <p className="pt-4 text-xs font-medium text-black/68 transition-colors group-hover:text-black dark:text-white/68 dark:group-hover:text-white sm:pt-5 lg:text-sm">
          Read research →
        </p>
      </article>
    </Link>
  )
}
