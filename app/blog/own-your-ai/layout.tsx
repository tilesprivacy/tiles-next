import { notFound } from "next/navigation"
import { StandardSiteLinkTags } from "@/components/standard-site-link-tags"
import { getBlogPostBySlug, isBlogPostVisible } from "@/lib/blog-posts"

export default function OwnYourAiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const post = getBlogPostBySlug("own-your-ai")

  if (!post || !isBlogPostVisible(post)) {
    notFound()
  }

  return (
    <>
      <StandardSiteLinkTags documentSlug="own-your-ai" includePublication={false} />
      {children}
    </>
  )
}
