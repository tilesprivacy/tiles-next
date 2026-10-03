'use client'

import { useMemo } from "react"
import { blogPosts } from "@/lib/blog-posts"
import { BlogPostContent } from "@/components/blog-post-content"

export default function MozillaFoundationFundingPage() {
  const post = blogPosts.find((p) => p.slug === "mozilla-foundation-funding")

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
      coverImage={post.coverImage ?? "/og-image.jpg"}
      coverImageDark={post.coverImageDark ?? post.coverImage ?? "/og-image.jpg"}
      coverAlt={post.coverAlt ?? post.title}
      standardSiteDocumentUri={post.standardSiteDocumentUri}
      blueskyPostUri={post.blueskyPostUri}
      content={post.content}
      showTableOfContents={false}
    >
      <p>Today, we&rsquo;re sharing an important milestone for Tiles.</p>

      <p>
        Mozilla Foundation is supporting Tiles with a <strong>$300,000 non-dilutive anchor grant</strong> as part of its{" "}
        <a
          href="https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Human-Scale AI program
        </a>
        . Tiles has been selected as one of the program&rsquo;s Anchor Grantees, with funding intended to help us
        advance the project according to our own roadmap.
      </p>

      <p>This gives our team something especially valuable: time.</p>

      <p>
        Time to improve the product, strengthen the local-first and decentralized foundations underneath it, make
        collaboration more useful, and continue turning Tiles from an ambitious open-source project into something
        people can depend on every day.
      </p>

      <p>
        Our long-term goal remains the same: build Tiles into a sustainable, independent product funded primarily by
        the people who use it.
      </p>

      <p>Mozilla&rsquo;s support helps us move toward that goal without giving up equity or control.</p>

      <p>
        We&rsquo;ll also be working closely with Mozilla Foundation and the broader Human-Scale AI cohort through
        regular discussions, coaching, feedback, and community engagement.
      </p>

      <p>We&rsquo;re grateful for the support, and excited for what it gives us the chance to build next.</p>
    </BlogPostContent>
  )
}
