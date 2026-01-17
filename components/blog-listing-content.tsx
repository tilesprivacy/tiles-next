'use client'

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import NewsletterForm from "@/components/newsletter-form"

interface BlogPost {
  slug: string
  title: string
  description: string
  date: Date
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

export function BlogListingContent({ posts }: BlogListingContentProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
      <SiteHeader themeAware />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-16 pb-28 lg:px-6 lg:pt-28 lg:pb-24 gap-12 lg:gap-20">
        {/* Top Card - Logo and Title */}
        <div className="w-full max-w-2xl px-4 pt-20 pb-8 lg:px-12 lg:pt-24 lg:pb-12">
          {/* Blog Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white lg:text-6xl tracking-tight mb-5 lg:mb-7">The Tiles Blog</h1>
            <p className="text-base text-black/50 dark:text-white/50 lg:text-xl">Privacy technology for everyone!</p>
          </div>
        </div>

        {/* Bottom Card - Blog Posts List and Carousel */}
        <div className="w-full max-w-2xl px-4 pt-10 pb-4 lg:px-12 lg:pt-16 lg:pb-10 flex-1 space-y-12 lg:space-y-16">
          <div className="space-y-12 lg:space-y-16">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`} 
                className="block group"
              >
                <h2 className="text-2xl font-bold text-black dark:text-white mb-3 group-hover:text-black/80 dark:group-hover:text-white/80 lg:text-3xl lg:mb-4 tracking-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-black/70 dark:text-white/70 mb-3 lg:text-base lg:mb-4 leading-relaxed">{post.description}</p>
                <div className="flex items-center gap-3 lg:gap-4">
                  <p className="text-xs text-black/40 dark:text-white/40 lg:text-sm">{formatDate(post.date)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter Subscription Section */}
          <div className="pt-16 lg:pt-20 border-t border-black/10 dark:border-white/10">
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4 lg:text-2xl lg:mb-5 tracking-tight">Stay updated</h3>
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
