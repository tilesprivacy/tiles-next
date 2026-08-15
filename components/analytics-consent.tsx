'use client'

import Link from 'next/link'
import { Analytics } from '@vercel/analytics/next'
import { useEffect, useRef, useState } from 'react'
import {
  hasAnalyticsConsent,
  OPEN_ANALYTICS_CONSENT_EVENT,
  readAnalyticsConsent,
  storeAnalyticsConsent,
  type AnalyticsConsentChoice,
} from '@/lib/analytics-consent'

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<AnalyticsConsentChoice | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const dialogRef = useRef<HTMLElement | null>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const storedChoice = readAnalyticsConsent()
    setChoice(storedChoice)
    setIsOpen(storedChoice === null)
    setIsReady(true)

    const openConsent = () => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setIsOpen(true)
      requestAnimationFrame(() => dialogRef.current?.focus())
    }

    window.addEventListener(OPEN_ANALYTICS_CONSENT_EVENT, openConsent)
    return () => window.removeEventListener(OPEN_ANALYTICS_CONSENT_EVENT, openConsent)
  }, [])

  const finishChoice = (nextChoice: AnalyticsConsentChoice) => {
    storeAnalyticsConsent(nextChoice)
    setChoice(nextChoice)
    setIsOpen(false)
    requestAnimationFrame(() => returnFocusRef.current?.focus())
  }

  const closeExistingChoice = () => {
    if (choice === null) return
    setIsOpen(false)
    requestAnimationFrame(() => returnFocusRef.current?.focus())
  }

  return (
    <>
      {isReady && isOpen ? (
        <section
          ref={dialogRef}
          role="dialog"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description analytics-consent-details"
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeExistingChoice()
          }}
          className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-[110] max-h-[calc(100dvh-2rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] overflow-y-auto rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-[0_24px_80px_rgba(0,0,0,0.24)] outline-none animate-in fade-in slide-in-from-bottom-3 duration-300 motion-reduce:animate-none sm:inset-x-auto sm:right-[calc(1.5rem+env(safe-area-inset-right,0px))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:w-[min(36rem,calc(100vw-3rem))] sm:p-7 dark:shadow-[0_24px_80px_rgba(0,0,0,0.58)]"
          data-pagefind-ignore="all"
        >
          <div className="space-y-4 text-[0.95rem] leading-7 sm:text-base">
            <p id="analytics-consent-title" className="m-0">
              <strong className="font-semibold">Hi, it&apos;s us, Tiles.</strong>{' '}
              We hate these things as much as anyone, but the marketing gods demand conversion metrics.
            </p>
            <p id="analytics-consent-description" className="m-0">
              With your permission, we use privacy-friendly analytics to measure traffic and improve our marketing,
              book, and blog pages. This only covers visits to this website, never what you do in the Tiles app.
            </p>
            <p id="analytics-consent-details" className="m-0">
              Vercel Web Analytics does not use cookies and stores anonymous, aggregated data. Read all about it in
              our{' '}
              <Link href="/privacy" className="underline decoration-current/50 underline-offset-4 hover:decoration-current">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => finishChoice('rejected')}
              className="inline-flex min-h-11 min-w-28 items-center justify-center rounded-md border border-border bg-muted px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => finishChoice('accepted')}
              className="inline-flex min-h-11 min-w-28 items-center justify-center rounded-md border border-foreground bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
            >
              Accept
            </button>
          </div>
        </section>
      ) : null}
      {isReady && choice === 'accepted' ? (
        <Analytics beforeSend={(event) => (hasAnalyticsConsent() ? event : null)} />
      ) : null}
    </>
  )
}
