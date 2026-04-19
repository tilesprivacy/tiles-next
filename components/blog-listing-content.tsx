'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { BlogAuthorDisplayName } from "@/components/blog-author-display-name"
import { PersonAvatar } from "@/components/person-avatar"
import {
  marketingPageBodyClass,
  marketingPageMetaClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import { getPersonById } from "@/lib/people"

interface BlogPost {
  slug: string
  title: string
  description: string
  date: Date
  author?: string
  coverImage?: string
  coverImageDark?: string
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

function getPostImage(post: BlogPost): { src: string; srcDark: string; alt: string } {
  const src = post.coverImage || "/og-image.jpg"
  return {
    src,
    srcDark: post.coverImageDark || src,
    alt: post.coverAlt || post.title,
  }
}

function BlogPostEntry({ post }: { post: BlogPost }) {
  const image = getPostImage(post)
  const [imageSrc, setImageSrc] = useState(image.src)
  const [imageSrcDark, setImageSrcDark] = useState(image.srcDark)
  const author = post.author ? getPersonById(post.author) : null

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="grid grid-cols-[minmax(0,1fr)_6.5rem] items-start gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-6 sm:py-9 lg:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="space-y-3 sm:space-y-4">
          <div className={`flex flex-col gap-2 sm:gap-2.5 ${marketingPageMetaClass}`}>
            <span>{formatDate(post.date)}</span>
            {author && (
              <span className="inline-flex items-center gap-1.5">
                <span>By</span>
                <PersonAvatar
                  name={author.name}
                  links={author.links}
                  variant="blog"
                  className="inline-flex shrink-0"
                />
                <BlogAuthorDisplayName
                  fullName={author.name}
                  className="text-black/60 dark:text-white/60"
                  handleClassName="text-black/45 dark:text-white/45"
                />
              </span>
            )}
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-black transition-colors group-hover:text-black/75 dark:text-white dark:group-hover:text-white/80 sm:text-2xl lg:text-3xl">
            {post.title}
          </h2>

          <p className={marketingPageBodyClass}>
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
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:hidden"
              onError={() => setImageSrc("/og-image.jpg")}
            />
            <Image
              src={imageSrcDark}
              alt={image.alt}
              width={900}
              height={900}
              sizes="(max-width: 640px) 6.5rem, (max-width: 1024px) 9.5rem, 11rem"
              className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:block"
              onError={() => setImageSrcDark("/og-image.jpg")}
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
      <main className="flex flex-1 flex-col px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-10 lg:mb-12">
            <h1 className={`mb-4 ${marketingPageTitleClass}`}>
              Blog
            </h1>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl flex-1 pb-4 lg:pb-10">
          <div className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
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
