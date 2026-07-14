'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getBlogPostBySlug } from "@/lib/blog-posts"
import { BlogPostContent } from "@/components/blog-post-content"
import {
  ownYourAiSlideSrc,
  ownYourAiSlides,
  ownYourAiTalkIntro,
  ownYourAiVideoSrc,
  type OwnYourAiSlide,
} from "@/lib/own-your-ai-talk"

function TalkSlideMedia({
  slide,
  active,
}: {
  slide: OwnYourAiSlide
  active?: boolean
}) {
  const className = `absolute inset-0 h-full w-full rounded-lg border border-black/8 object-contain shadow-[0_18px_48px_rgba(0,0,0,0.12)] transition duration-500 dark:border-white/10 ${
    active ? "opacity-100 scale-100" : "opacity-0 scale-[0.985]"
  }`

  if (slide.media === "video") {
    return <video className={className} controls playsInline preload="metadata" src={ownYourAiVideoSrc()} aria-label="Slide 26 demo video" />
  }

  return (
    <img
      className={className}
      src={ownYourAiSlideSrc(slide.number)}
      alt=""
      loading={slide.number === 1 ? "eager" : "lazy"}
    />
  )
}

function TilesScrollyTalk() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const scrollySlides = useMemo(() => ownYourAiSlides, [])
  const [activeSlide, setActiveSlide] = useState(scrollySlides[0]?.number ?? 1)

  const updateActiveSlide = useCallback(() => {
    const section = sectionRef.current

    if (!section || window.matchMedia("(max-width: 1200px)").matches) {
      return
    }

    const blocks = Array.from(section.querySelectorAll<HTMLElement>("[data-slide]"))
    const viewportTarget = window.innerHeight * 0.52
    let closestSlide = scrollySlides[0]?.number ?? 1
    let closestDistance = Number.POSITIVE_INFINITY

    for (const block of blocks) {
      const rect = block.getBoundingClientRect()
      const blockCenter = rect.top + rect.height / 2
      const distance = Math.abs(blockCenter - viewportTarget)

      if (distance < closestDistance) {
        closestDistance = distance
        closestSlide = Number(block.dataset.slide)
      }
    }

    setActiveSlide((current) => (current === closestSlide ? current : closestSlide))
  }, [scrollySlides])

  useEffect(() => {
    let animationFrame = 0
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateActiveSlide)
    }

    scheduleUpdate()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [updateActiveSlide])

  return (
    <>
      <section
        ref={sectionRef}
        className="relative left-1/2 my-12 grid w-[min(90rem,calc(100vw-3rem))] -translate-x-1/2 grid-cols-1 gap-12 lg:my-20 xl:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)]"
      >
        <div className="sticky top-[calc(5.5rem+env(safe-area-inset-top,0px))] hidden h-[calc(100dvh-7rem)] items-center xl:flex">
          <div className="relative aspect-video w-full">
            {scrollySlides.map((slide) => (
              <TalkSlideMedia key={slide.number} slide={slide} active={activeSlide === slide.number} />
            ))}
          </div>
        </div>

        <div>
          {scrollySlides.map((slide) => (
            <div
              key={slide.number}
              data-slide={slide.number}
              className={`flex flex-col justify-center xl:min-h-[75vh] xl:px-6 ${
                slide.transcript.length === 0 ? "xl:min-h-[55vh]" : ""
              } ${slide.number === scrollySlides[scrollySlides.length - 1]?.number ? "xl:pb-[50vh]" : ""}`}
            >
              {slide.media === "video" ? (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  src={ownYourAiVideoSrc()}
                  aria-label={`Slide ${slide.number} demo video`}
                  className="mb-4 block aspect-video h-auto w-full rounded-lg border border-black/8 object-contain shadow-[0_18px_48px_rgba(0,0,0,0.12)] dark:border-white/10 xl:hidden"
                />
              ) : (
                <img
                  src={ownYourAiSlideSrc(slide.number)}
                  alt={`Slide ${slide.number}`}
                  loading={slide.number === 1 ? "eager" : "lazy"}
                  className="mb-4 block aspect-video h-auto w-full rounded-lg border border-black/8 object-contain shadow-[0_18px_48px_rgba(0,0,0,0.12)] dark:border-white/10 xl:hidden"
                />
              )}

              {slide.transcript.length > 0 ? (
                <div
                  className={`mb-12 space-y-4 text-base leading-7 text-black/76 transition duration-500 dark:text-white/85 lg:text-[1.03rem] xl:translate-y-28 ${
                    activeSlide === slide.number
                      ? "opacity-100"
                      : "xl:text-black/46 xl:opacity-70 xl:dark:text-white/55"
                  }`}
                >
                  {slide.transcript.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <div className="mb-12 xl:hidden" />
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default function OwnYourAiPage() {
  const post = getBlogPostBySlug("own-your-ai")

  const formattedDate = useMemo(() => {
    if (!post) return ""
    return post.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [post])

  if (!post) {
    return null
  }

  return (
    <BlogPostContent
      title={post.title}
      description={post.description}
      date={formattedDate}
      authorId={post.author}
      coverImage={post.coverImage}
      coverAlt={post.coverAlt ?? post.title}
      standardSiteDocumentUri={post.standardSiteDocumentUri}
      content={post.content}
      showTableOfContents={false}
    >
      <div className="space-y-4" dangerouslySetInnerHTML={{ __html: ownYourAiTalkIntro }} />

      <h2 className="relative left-1/2 w-[min(90rem,calc(100vw-3rem))] -translate-x-1/2">
        Slides and Transcript
      </h2>

      <TilesScrollyTalk />
    </BlogPostContent>
  )
}
