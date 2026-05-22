'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

export type ContentCarouselItem = {
  id: string
  href: string
  title: string
  description: string
  imageSrc: string
  imageSrcDark: string
  imageAlt: string
}

type ContentCarouselProps = {
  items: ContentCarouselItem[]
  scrollLeftAriaLabel?: string
  scrollRightAriaLabel?: string
}

export function ContentCarousel({
  items,
  scrollLeftAriaLabel = 'Scroll cards left',
  scrollRightAriaLabel = 'Scroll cards right',
}: ContentCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

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

  if (items.length === 0) return null

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-3"
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="w-[92%] shrink-0 snap-start sm:w-[80%] lg:w-[49%]"
          >
            <Link href={item.href} className="block group h-full" prefetch={true}>
              <div className="space-y-3 rounded-sm border border-black/5 bg-white p-5 hover:border-black/10 hover:shadow-sm lg:p-7 lg:space-y-4 dark:bg-[#161616] dark:border-white/10 dark:hover:border-white/20">
                <div className="relative aspect-video overflow-hidden rounded-sm border border-black/5 dark:border-white/10">
                  <>
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 49vw"
                      className="object-cover dark:hidden"
                    />
                    <Image
                      src={item.imageSrcDark}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 49vw"
                      className="hidden object-cover dark:block"
                    />
                  </>
                </div>

                <h3 className="text-lg font-semibold text-black group-hover:text-black/80 underline lg:text-2xl tracking-tight line-clamp-2 dark:text-white dark:group-hover:text-white/80">
                  {item.title}
                </h3>
                <p className="text-sm text-black/60 line-clamp-2 lg:text-base dark:text-white/60">
                  {item.description}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {(canScrollPrev || canScrollNext) && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            className="hidden lg:inline-flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 h-9 w-9 items-center justify-center rounded-sm border border-black/15 bg-background text-black/80 hover:text-black disabled:opacity-30 dark:border-white/20 dark:text-white/80 dark:hover:text-white"
            aria-label={scrollLeftAriaLabel}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            className="hidden lg:inline-flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 h-9 w-9 items-center justify-center rounded-sm border border-black/15 bg-background text-black/80 hover:text-black disabled:opacity-30 dark:border-white/20 dark:text-white/80 dark:hover:text-white"
            aria-label={scrollRightAriaLabel}
          >
            <span aria-hidden="true">→</span>
          </button>
        </>
      )}
    </div>
  )
}
