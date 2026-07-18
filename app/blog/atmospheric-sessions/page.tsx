'use client'

import { useMemo } from "react"
import { BlogPostContent } from "@/components/blog-post-content"
import { getBlogPostBySlug } from "@/lib/blog-posts"

export default function AtmosphericSessionsPage() {
  const post = getBlogPostBySlug("atmospheric-sessions")
  const formattedDate = useMemo(
    () =>
      post?.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) ?? "",
    [post],
  )

  if (!post) return null

  return (
    <BlogPostContent
      title={post.title}
      description={post.description}
      date={formattedDate}
      authorId={post.author}
      coverImage={post.coverImage}
      coverAlt={post.coverAlt}
      content={post.content}
      showTableOfContents
    >
      <div className="atmospheric-sessions-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </BlogPostContent>
  )
}
