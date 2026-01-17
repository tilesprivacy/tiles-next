'use client'

import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ReactNode } from 'react'
import NewsletterForm from "@/components/newsletter-form"
import { BlogReference } from "@/components/blog-reference"
import { ReadingTime } from "@/components/reading-time"

interface BlogPostContentProps {
  title: string
  description: string
  date: string
  coverImage: string
  coverAlt: string
  content: string
  children: ReactNode
}

export function BlogPostContent({ 
  title, 
  description, 
  date, 
  coverImage, 
  coverAlt, 
  content,
  children 
}: BlogPostContentProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <SiteHeader themeAware />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-16 pb-20 lg:px-6 lg:pt-24 lg:pb-24 gap-6 lg:gap-12 overflow-x-hidden">
        {/* Bottom Card - Blog Post Content */}
        <div className="w-full max-w-2xl px-4 py-6 lg:px-16 lg:py-16 relative">
          {/* Blog Title */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl font-semibold text-black dark:text-white mb-4 lg:text-6xl lg:mb-5 tracking-tight">
              {title}
            </h1>
            <p className="text-base text-black/50 dark:text-white/50 lg:text-xl mb-3 lg:mb-4">
              {description}
            </p>
            <div className="flex items-center gap-3 lg:gap-4">
              <p className="text-sm text-black/40 dark:text-white/40 lg:text-lg">{date}</p>
              <span className="text-black/20 dark:text-white/20">·</span>
              <ReadingTime 
                content={content} 
                className="text-sm text-black/40 dark:text-white/40 lg:text-lg"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="mb-8 lg:mb-16">
            <Image
              src={coverImage}
              alt={coverAlt}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Blog Content */}
          <article className="blog-article-container relative">
            {/* Container for side references on desktop */}
            <div className="blog-reference-container hidden lg:block absolute left-0 top-0 w-full h-full pointer-events-none" />

            <div className="space-y-6 text-base leading-relaxed text-black/70 dark:text-white/70 lg:space-y-10 lg:text-xl lg:leading-relaxed relative z-10 
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black dark:[&_h2]:text-white [&_h2]:mb-6 lg:[&_h2]:text-4xl lg:[&_h2]:mb-8 [&_h2]:tracking-tight
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black dark:[&_h3]:text-white [&_h3]:mb-4 lg:[&_h3]:text-2xl lg:[&_h3]:mb-6
              [&_hr]:border-black/10 dark:[&_hr]:border-white/10 [&_hr]:my-10 lg:[&_hr]:my-12
              [&_strong]:font-semibold [&_strong]:text-black dark:[&_strong]:text-white
              [&_a]:text-black dark:[&_a]:text-white [&_a]:hover:text-black/80 dark:[&_a]:hover:text-white/80 [&_a]:underline
              [&_code]:rounded [&_code]:bg-black/5 dark:[&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-black dark:[&_code]:text-white
              [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-5 lg:[&_ol]:space-y-7 [&_ol]:ml-4
              [&_ul]:list-disc [&_ul]:space-y-4 [&_ul]:pl-6
              [&_li]:mb-6 lg:[&_li]:mb-8
            ">
              {children}
            </div>
          </article>

          {/* Blog Footer Text */}
          <div className="mt-16 lg:mt-20">
            <div className="space-y-2 text-xs text-black/60 dark:text-white/60 lg:space-y-3 lg:text-sm mb-8 lg:mb-10">
              <p>
                You're reading the{" "}
                <a
                  href="https://tiles.run"
                  className="text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 underline"
                >
                  Tiles
                </a>{" "}
                blog.
              </p>
              <p>
              Tiles is a private AI assistant for everyday use.
              </p>
              <p>
                There are{" "}
                <Link href="/blog" className="text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 underline">
                  more posts
                </Link>
                .
              </p>
              <p>
                When you're done, you can{" "}
                <Link href="/download" className="text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 underline">
                  install Tiles
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Newsletter Subscription Form */}
          <div className="pt-12 lg:pt-16 border-t border-black/10 dark:border-white/10">
            <div className="space-y-4 lg:space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2 lg:text-xl lg:mb-3">Stay updated</h3>
                <p className="text-sm text-black/60 dark:text-white/60 lg:text-base">
                  Get notified when we publish new posts about privacy and personalization.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
