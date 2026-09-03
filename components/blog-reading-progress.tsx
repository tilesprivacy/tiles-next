'use client'

import { useEffect, useRef } from 'react'

/**
 * Thin reading-progress bar fixed to the bottom edge of the site topbar on
 * blog posts. The bar fills left-to-right as the reader scrolls, matching
 * the pattern on the Perplexity blog (perplexity.ai/hub/blog).
 */
export function BlogReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement
      const maxScroll = doc.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0

      // Style the fill directly instead of via state so scrolling never
      // re-renders the React tree.
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`
      barRef.current?.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
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

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="blog-reading-progress-bar blog-print-screen-only fixed inset-x-0 top-[calc(var(--site-announcement-offset,0px)+4rem)] z-40 h-[3px] md:top-[calc(var(--site-announcement-offset,0px)+5.5rem)] print:hidden"
    >
      <div
        ref={fillRef}
        aria-hidden="true"
        style={{ transform: 'scaleX(0)' }}
        className="h-full w-full origin-left bg-black dark:bg-[var(--sponsor-yellow,#f7ff61)]"
      />
    </div>
  )
}
