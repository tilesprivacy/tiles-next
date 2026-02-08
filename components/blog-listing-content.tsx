'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

interface BlogPost {
  slug: string
  title: string
  description: string
  date: Date
  coverImage?: string
  coverAlt?: string
}

interface BlogListingContentProps {
  posts: BlogPost[]
}

function formatDate(date: Date): string {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return `Published ${diffDays} days ago (${dateStr})`
}

function getPostImage(post: BlogPost): { src: string; alt: string } {
  return {
    src: post.coverImage || "/og-image.jpg",
    alt: post.coverAlt || post.title,
  }
}

function BlogPostEntry({ post }: { post: BlogPost }) {
  const image = getPostImage(post)
  const [imageSrc, setImageSrc] = useState(image.src)

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-6 sm:py-9 lg:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs text-black/45 dark:text-white/45 lg:text-sm">{formatDate(post.date)}</p>

          <h2 className="text-xl font-semibold tracking-tight text-black transition-colors group-hover:text-black/75 dark:text-white dark:group-hover:text-white/80 sm:text-2xl lg:text-3xl">
            {post.title}
          </h2>

          <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
            {post.description}
          </p>

          <p className="pt-1 text-xs font-medium text-black/70 transition-colors group-hover:text-black dark:text-white/70 dark:group-hover:text-white lg:text-sm">
            Read post
          </p>
        </div>

        <div>
          <div className="relative aspect-square overflow-hidden rounded-sm border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]">
            <Image
              src={imageSrc}
              alt={image.alt}
              width={900}
              height={900}
              sizes="(max-width: 640px) 6.5rem, (max-width: 1024px) 9.5rem, 11rem"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImageSrc("/og-image.jpg")}
            />
          </div>
        </div>
      </article>
    </Link>
  )
}

export function BlogListingContent({ posts }: BlogListingContentProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center gap-12 px-6 pb-28 pt-16 sm:px-8 lg:gap-20 lg:px-10 lg:pb-24 lg:pt-28 xl:px-12">
        {/* Top Card - Logo and Title */}
        <div className="w-full max-w-[48rem] pt-20 pb-8 lg:pt-24 lg:pb-12">
          {/* Blog Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white lg:text-6xl tracking-tight mb-5 lg:mb-7">The Tiles Blog</h1>
            <p className="text-base text-black/50 dark:text-white/50 lg:text-xl">Privacy technology for everyone!</p>
          </div>
        </div>

        {/* Bottom Card - Blog Posts */}
        <div className="w-full max-w-[48rem] flex-1 space-y-12 pt-10 pb-4 lg:space-y-16 lg:pt-16 lg:pb-10">
          <div className="border-y border-black/10 dark:border-white/10 divide-y divide-black/10 dark:divide-white/10">
            {posts.map((post) => (
              <BlogPostEntry key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
