'use client'

import Link from "next/link"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { FaBluesky, FaLinkedinIn, FaMastodon, FaXTwitter, FaLink } from "react-icons/fa6"
import { BlogReference } from "@/components/blog-reference"
import { BlogTableOfContents } from "@/components/blog-table-of-contents"
import { ReadingTime } from "@/components/reading-time"
import { getPersonById } from "@/lib/people"
import { SocialLinks } from "@/components/social-links"

interface BlogPostContentProps {
  title: string
  description: string
  date: string
  /** Person ID from `lib/people.ts` */
  authorId?: string
  coverImage: string
  coverAlt: string
  content: string
  children: ReactNode
}

export function BlogPostContent({ 
  title, 
  description, 
  date, 
  authorId,
  coverImage, 
  coverAlt, 
  content,
  children 
}: BlogPostContentProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const author = authorId ? getPersonById(authorId) : null

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  const shareText = useMemo(() => {
    if (!shareUrl) return ''
    return encodeURIComponent(`${title}: ${shareUrl}`)
  }, [title, shareUrl])

  const shareUrlEncoded = useMemo(() => {
    if (!shareUrl) return ''
    return encodeURIComponent(shareUrl)
  }, [shareUrl])

  const shareIconClass = "h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5"
  const copyIconClass = "h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5"
  const copyLabelClass = "text-[11px] text-black/50 dark:text-white/50 lg:text-xs"

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-6 pt-16 pb-20 sm:px-8 lg:px-10 lg:pt-24 lg:pb-24 xl:px-12 gap-6 lg:gap-12 overflow-x-clip">
        {/* Bottom Card - Blog Post Content */}
        <div className="w-full max-w-[90rem] py-8 lg:py-14 relative">
          {/* Blog Title */}
          <div className="mb-8 lg:mb-12 lg:max-w-[44rem] lg:mx-auto">
            <h1 className="text-3xl font-semibold text-black dark:text-white mb-4 lg:text-5xl lg:mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-base text-black/50 dark:text-white/50 lg:text-lg mb-3 lg:mb-3">
              {description}
            </p>
            <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm text-black/40 dark:text-white/40 lg:text-base">{date}</p>
                <span className="text-black/20 dark:text-white/20">·</span>
                <ReadingTime 
                  content={content} 
                  className="text-sm text-black/40 dark:text-white/40 lg:text-base"
                />
              </div>
              {author && (
                <div className="flex items-center gap-2">
                  <span className="hidden text-black/20 dark:text-white/20 lg:inline">·</span>
                  <span className="text-sm text-black/40 dark:text-white/40 lg:text-base">
                    By <span className="text-black/60 dark:text-white/60">{author.name.replace(/\s@[^ ]+$/, "")}</span>
                  </span>
                  <SocialLinks
                    name={author.name}
                    links={author.links}
                    className="flex items-center gap-1.5"
                    linkClassName="text-black/40 hover:text-black/65 dark:text-white/40 dark:hover:text-white/70 transition-colors"
                    iconClassName="h-3.5 w-3.5 lg:h-4 lg:w-4"
                  />
                </div>
              )}
            </div>
            {shareUrl && (
              <div className="mt-5 flex items-center gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="inline-flex items-center justify-center"
                >
                  <FaXTwitter className={shareIconClass} />
                </a>
                <a
                  href={`https://bsky.app/intent/compose?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Bluesky"
                  className="inline-flex items-center justify-center"
                >
                  <FaBluesky className={shareIconClass} />
                </a>
                <a
                  href={`https://mastodon.social/share?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Mastodon"
                  className="inline-flex items-center justify-center"
                >
                  <FaMastodon className={shareIconClass} />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="inline-flex items-center justify-center"
                >
                  <FaLinkedinIn className={shareIconClass} />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (!shareUrl) return
                    if (navigator?.clipboard?.writeText) {
                      navigator.clipboard.writeText(shareUrl)
                      setCopied(true)
                      window.setTimeout(() => setCopied(false), 1400)
                      return
                    }
                    window.open(shareUrl, '_blank', 'noopener,noreferrer')
                  }}
                  aria-label="Copy link"
                  className="inline-flex items-center justify-center"
                >
                  <FaLink className={copyIconClass} />
                </button>
                <span className={copyLabelClass}>
                  {copied ? 'Copied' : 'Copy link'}
                </span>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="mb-8 lg:mb-16 lg:max-w-[44rem] lg:mx-auto">
            <Image
              src={coverImage}
              alt={coverAlt}
              width={1200}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Blog Content + TOC + References lanes */}
          <div className="xl:grid xl:grid-cols-[minmax(14rem,1fr)_minmax(0,44rem)_minmax(14rem,1fr)] xl:gap-x-10">
            <aside className="hidden xl:block">
              <BlogTableOfContents />
            </aside>

            <article className="blog-article-container relative mx-auto max-w-[44rem] xl:mx-0 xl:max-w-none">
              {/* Container for side references on desktop */}
              <div className="blog-reference-container hidden xl:block absolute left-0 top-0 w-full h-full pointer-events-none" />

              <div className="blog-article-content space-y-4 text-base leading-7 text-black/70 dark:text-white/70 lg:space-y-6 lg:text-[1.03rem] lg:leading-7 relative z-10
                [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-black dark:[&_h2]:text-white [&_h2]:mb-4 lg:[&_h2]:text-2xl lg:[&_h2]:mb-5 [&_h2]:tracking-tight
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-black dark:[&_h3]:text-white [&_h3]:mb-3 lg:[&_h3]:text-xl lg:[&_h3]:mb-4
                [&_hr]:border-black/10 dark:[&_hr]:border-white/10 [&_hr]:my-8 lg:[&_hr]:my-10
                [&_strong]:font-semibold [&_strong]:text-black dark:[&_strong]:text-white
                [&_a]:text-black dark:[&_a]:text-white [&_a]:hover:text-black/80 dark:[&_a]:hover:text-white/80 [&_a]:underline
                [&_code]:rounded [&_code]:bg-black/5 dark:[&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-black dark:[&_code]:text-white
                [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:rounded-lg [&_pre]:bg-black/5 dark:[&_pre]:bg-white/5 [&_pre]:p-4
                [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-all [&_pre_code]:bg-transparent [&_pre_code]:p-0
                [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-3 lg:[&_ol]:space-y-4 [&_ol]:ml-4
                [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-6
                [&_li]:mb-3 lg:[&_li]:mb-4
              ">
                {children}
              </div>
            </article>

            <div className="hidden xl:block" aria-hidden="true" />
          </div>

          {/* Blog Footer Text */}
          <div className="mt-16 lg:mt-20 lg:max-w-[44rem] lg:mx-auto">
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
              Tiles is a private and secure AI assistant for everyday use.
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

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
