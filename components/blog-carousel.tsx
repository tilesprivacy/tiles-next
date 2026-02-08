'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { blogPosts } from '@/lib/blog-posts'

function extractFirstImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

export default function BlogCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const posts = useMemo(
    () => [...blogPosts].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [],
  )

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const maxLeft = scroller.scrollWidth - scroller.clientWidth
    setCanScrollPrev(scroller.scrollLeft > 4)
    setCanScrollNext(scroller.scrollLeft < maxLeft - 4)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    updateScrollState()

    scroller.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      scroller.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollByCard = (direction: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const amount = Math.max(scroller.clientWidth * 0.9, 320)
    scroller.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  if (posts.length === 0) return null

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-3"
      >
        {posts.map((post) => {
          // Prefer explicit cover metadata; fall back to first post image.
          const imageSrc = post.coverImage || extractFirstImageSrc(post.content) || '/og-image.jpg'
          const imageAlt = post.coverAlt || post.title

          return (
            <article
              key={post.slug}
              className="w-[92%] shrink-0 snap-start sm:w-[80%] lg:w-[49%]"
            >
              <Link href={`/blog/${post.slug}`} className="block group h-full" prefetch={true}>
                <div className="space-y-3 rounded-lg border border-black/5 bg-white p-5 hover:border-black/10 hover:shadow-sm lg:p-7 lg:space-y-4 dark:bg-[#161616] dark:border-white/10 dark:hover:border-white/20">
                  <div className="relative aspect-video overflow-hidden rounded-md border border-black/5 dark:border-white/10">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 49vw"
                      className="object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-black group-hover:text-black/80 underline lg:text-2xl tracking-tight line-clamp-2 dark:text-white dark:group-hover:text-white/80">
                    {post.title}
                  </h3>
                  <p className="text-sm text-black/60 line-clamp-2 lg:text-base dark:text-white/60">
                    {post.description}
                  </p>
                </div>
              </Link>
            </article>
          )
        })}
      </div>

      {(canScrollPrev || canScrollNext) && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            className="hidden lg:inline-flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-background text-black/80 hover:text-black disabled:opacity-30 dark:border-white/20 dark:text-white/80 dark:hover:text-white"
            aria-label="Scroll blog cards left"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            className="hidden lg:inline-flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-background text-black/80 hover:text-black disabled:opacity-30 dark:border-white/20 dark:text-white/80 dark:hover:text-white"
            aria-label="Scroll blog cards right"
          >
            <span aria-hidden="true">→</span>
          </button>
        </>
      )}
    </div>
  )
}
