'use client'

import Script from "next/script"
import { createElement } from "react"

interface BlueskyDiscussionProps {
  postUrl: string
}

export function BlueskyDiscussion({ postUrl }: BlueskyDiscussionProps) {
  return (
    <section
      data-blog-discussion
      aria-labelledby="discussion"
      className="blog-print-screen-only"
    >
      <Script
        id="bsky-conversation-component"
        src="/bsky-conversation.js"
        type="module"
        strategy="afterInteractive"
      />
      <h2
        id="discussion"
        className="mb-4 mt-14 text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.02em] text-black dark:text-white lg:text-2xl"
      >
        Discussion
      </h2>
      {createElement(
        "bsky-conversation",
        { uri: postUrl, "max-depth": "3", className: "block" },
        <p>
          <a href={postUrl} target="_blank" rel="noopener noreferrer">
            View the discussion on Bluesky
          </a>
          .
        </p>,
      )}
    </section>
  )
}
