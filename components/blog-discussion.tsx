'use client'

import { useEffect } from 'react'
import { blueskyPostWebUrl } from '@/lib/bluesky-discussion'

interface BlogDiscussionProps {
  /** at:// URI of the Bluesky post whose replies act as comments. */
  blueskyPostUri: string
}

/**
 * Blog discussion section backed by the vendored bsky-conversation web
 * component (lib/vendor/bsky-conversation.js), which fetches and renders the
 * announcement post's replies, quote posts, and repost summary from Bluesky's
 * public AppView. Brand colors are applied via the component's --bsky-* CSS
 * custom properties in globals.css.
 */
export function BlogDiscussion({ blueskyPostUri }: BlogDiscussionProps) {
  const postUrl = blueskyPostWebUrl(blueskyPostUri)

  useEffect(() => {
    // The component extends HTMLElement, so it can only be evaluated in the
    // browser; the import registers the <bsky-conversation> custom element.
    import('@/lib/vendor/bsky-conversation.js')
  }, [])

  if (!postUrl) return null

  return (
    <section
      data-blog-discussion
      className="blog-print-screen-only mt-10 w-full border-t border-black/8 pt-5 text-xs leading-6 text-black/54 dark:border-white/10 dark:text-white/54 lg:mt-12 lg:text-sm"
      aria-label="Discussion"
    >
      <h2 className="mb-3 text-sm font-semibold text-black dark:text-white lg:text-base">
        Discussion
      </h2>
      <bsky-conversation uri={postUrl} max-depth="3" />
    </section>
  )
}
