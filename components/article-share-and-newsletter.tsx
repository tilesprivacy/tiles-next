'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  FaBluesky,
  FaLinkedinIn,
  FaLink,
  FaMastodon,
  FaRedditAlien,
  FaXTwitter,
} from 'react-icons/fa6'
import { ArticlePrintButton } from '@/components/article-print-button'
import { NewsletterCta } from '@/components/newsletter-cta'
import { TILES_PRODUCT_DESCRIPTION_SHORT } from '@/lib/product-description'

interface ArticleShareAndNewsletterProps {
  title: string
  moreLinkHref: string
  moreLinkLabel: string
}

export function ArticleShareAndNewsletter({
  title,
  moreLinkHref,
  moreLinkLabel,
}: ArticleShareAndNewsletterProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  const shareTitleEncoded = useMemo(() => encodeURIComponent(title), [title])

  const handleCopyLink = () => {
    if (!shareUrl) return
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
      return
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }

  const shareIconClass =
    'h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5'
  const copyIconClass =
    'h-4 w-4 text-black/60 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white lg:h-5 lg:w-5'
  const copyLabelClass =
    'text-[11px] text-black/50 transition-colors hover:text-black/70 dark:text-white/50 dark:hover:text-white/70 lg:text-xs'
  const shareLabelClass = 'text-xs text-black/45 dark:text-white/45'

  const shareActions = (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
      {shareUrl ? (
        <>
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
          <a
            href={`https://www.reddit.com/submit?url=${shareUrlEncoded}&title=${shareTitleEncoded}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Reddit"
            className="inline-flex items-center justify-center"
          >
            <FaRedditAlien className={shareIconClass} />
          </a>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy link"
            className="inline-flex items-center justify-center"
          >
            <FaLink className={copyIconClass} />
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={copied ? 'Copied link' : 'Copy link'}
            className={copyLabelClass}
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </>
      ) : null}
    </div>
  )

  return (
    <>
      <div className="mx-auto mt-16 w-full max-w-[44rem] lg:mt-20">
        <div className="mb-8 space-y-2 text-xs text-black/60 dark:text-white/60 lg:mb-10 lg:space-y-3 lg:text-sm">
          <p>{TILES_PRODUCT_DESCRIPTION_SHORT}</p>
          <p>
            There are{' '}
            <Link
              href={moreLinkHref}
              className="text-black underline hover:text-black/80 dark:text-white dark:hover:text-white/80"
            >
              {moreLinkLabel}
            </Link>
            .
          </p>
          <p>Keep on Tiling!</p>
        </div>
      </div>

      <div className="mx-auto mt-14 w-full max-w-[44rem] lg:mt-20">
        <ArticlePrintButton />
        <p className={`${shareLabelClass} mt-6`}>Share this:</p>
        {shareActions}
      </div>

      <section data-blog-newsletter className="mx-auto mt-12 w-full max-w-[44rem] border-y border-black/8 py-6 dark:border-white/12 lg:mt-16 lg:py-7">
        <NewsletterCta />
      </section>
    </>
  )
}
