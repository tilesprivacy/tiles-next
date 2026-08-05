'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

const RING_RADIUS = 17
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS
const SHOW_AFTER_SCROLL_PX = 240

/**
 * Circular reading-progress indicator fixed to the bottom-right of blog
 * posts. The ring fills as the reader scrolls and the button returns the
 * page to the top, matching the pattern on blog.cloudflare.com.
 */
export function BlogReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement
      const maxScroll = doc.scrollHeight - window.innerHeight
      const next = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0

      setProgress(next)
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX)
    }

    const requestUpdate = () => {
      if (frameRef.current !== null) return
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        update()
      })
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  const percent = Math.round(progress * 100)

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={`${percent}% read — scroll back to top`}
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? 0 : -1}
      className={`blog-print-screen-only fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-[calc(1.25rem+env(safe-area-inset-right,0px))] z-40 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-black/8 bg-white/85 text-black/60 shadow-[0_4px_16px_rgba(0,0,0,0.10)] backdrop-blur-md transition-all duration-300 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/60 dark:border-white/12 dark:bg-neutral-900/85 dark:text-white/60 dark:shadow-[0_4px_16px_rgba(0,0,0,0.45)] dark:hover:text-white dark:focus-visible:outline-white/60 print:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2.5"
          className="stroke-black/10 dark:stroke-white/12"
        />
        <circle
          cx="20"
          cy="20"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
          className="stroke-black/70 transition-[stroke-dashoffset] duration-150 ease-out dark:stroke-white/80"
        />
      </svg>
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
