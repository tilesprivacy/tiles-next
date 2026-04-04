import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BookFaq({
  children,
  className,
  headingId = 'book-faq-heading',
  title = 'Frequently asked questions',
  omitHeading = false,
}: {
  children: ReactNode
  className?: string
  headingId?: string
  title?: string | null
  /** When true, only the accordion list is rendered (parent supplies title and section). */
  omitHeading?: boolean
}) {
  const list = (
    <div
      className={cn(
        'border-t border-black/10 dark:border-white/10',
        'divide-y divide-black/10 dark:divide-white/10',
      )}
    >
      {children}
    </div>
  )

  if (omitHeading) {
    return <div className={cn('not-prose', className)}>{list}</div>
  }

  return (
    <section
      className={cn('not-prose mt-12 border-t border-border pt-10', className)}
      aria-labelledby={headingId}
    >
      {title ? (
        <h2
          id={headingId}
          className="mb-6 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
        >
          {title}
        </h2>
      ) : null}
      {list}
    </section>
  )
}

export function BookFaqItem({
  question,
  children,
}: {
  question: string
  children: ReactNode
}) {
  return (
    <details className="group">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-start justify-between gap-3 py-4 pr-0.5 text-left',
          'text-sm font-medium text-foreground transition-colors',
          'hover:text-black/80 dark:hover:text-[#E6E6E6]',
          'focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:outline-black/25 dark:focus-visible:outline-white/25',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <span className="min-w-0 flex-1 leading-snug">{question}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 text-black/35 transition-transform dark:text-[#8A8A8A]',
            'group-open:rotate-180',
          )}
        />
      </summary>
      <div
        className={cn(
          'pb-5 text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3]',
          '[&_p]:m-0 [&_p+p]:mt-3',
          '[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:decoration-current [&_a]:underline-offset-2',
          '[&_a]:transition-colors [&_a:hover]:text-black/80 dark:[&_a:hover]:text-[#E6E6E6]',
          '[&_code]:rounded-md [&_code]:bg-black/[0.06] [&_code]:px-1.5 [&_code]:py-px',
          'dark:[&_code]:bg-white/10 [&_code]:font-mono [&_code]:text-[0.8125rem] [&_code]:text-foreground/90',
        )}
      >
        {children}
      </div>
    </details>
  )
}
