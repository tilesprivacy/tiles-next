"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { blogPosts } from "@/lib/blog-posts"

export default function BlogCarousel() {
  const [api, setApi] = useState<any>(null)
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    if (!api) return

    const checkCanScroll = () => {
      setCanScroll(api.canScrollNext() || api.canScrollPrev())
    }

    checkCanScroll()
    api.on("select", checkCanScroll)
    api.on("reInit", checkCanScroll)

    return () => {
      api.off("select", checkCanScroll)
      api.off("reInit", checkCanScroll)
    }
  }, [api])

  if (blogPosts.length === 0) return null

  return (
    <div className="w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-2 lg:-ml-3">
          {blogPosts.map((post) => (
            <CarouselItem key={post.slug} className="basis-full pl-2 lg:basis-1/2 lg:pl-3">
              <Link href={`/blog/${post.slug}`} className="block group h-full">
                <div className="space-y-3 rounded-lg border border-black/5 bg-white p-5 transition-all duration-300 hover:border-black/10 hover:shadow-sm lg:p-7 lg:space-y-4">
                  <h3 className="text-lg font-semibold text-black group-hover:text-black/80 transition-colors underline lg:text-2xl tracking-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-black/60 line-clamp-2 lg:text-base">{post.description}</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScroll && (
          <>
            <CarouselPrevious className="left-0 lg:-left-14" />
            <CarouselNext className="right-0 lg:-right-14" />
          </>
        )}
      </Carousel>
    </div>
  )
}
