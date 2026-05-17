'use client'

import { useMemo } from 'react'
import { ContentCarousel } from '@/components/content-carousel'
import { blogPosts } from '@/lib/blog-posts'

function extractFirstImageSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

export default function BlogCarousel() {
  const items = useMemo(
    () =>
      [...blogPosts]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((post) => {
          const imageSrc = post.coverImage || extractFirstImageSrc(post.content) || '/og-image.jpg'
          const imageSrcDark = post.coverImageDark || imageSrc

          return {
            id: post.slug,
            href: `/blog/${post.slug}`,
            title: post.title,
            description: post.description,
            imageSrc,
            imageSrcDark,
            imageAlt: post.coverAlt || post.title,
          }
        }),
    [],
  )

  return (
    <ContentCarousel
      items={items}
      scrollLeftAriaLabel="Scroll blog cards left"
      scrollRightAriaLabel="Scroll blog cards right"
    />
  )
}
