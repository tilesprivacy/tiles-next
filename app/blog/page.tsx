import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog-posts"
import NewsletterForm from "@/components/newsletter-form"
import { ReadingTime } from "@/components/reading-time"

export const metadata: Metadata = {
  title: "Tiles Blog: Privacy technology for everyone!",
  description: "We're building open source privacy technology for personalized software experiences.",
  openGraph: {
    title: "Tiles Blog: Privacy technology for everyone!",
    description: "We're building open source privacy technology for personalized software experiences.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Blog: Privacy technology for everyone!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Blog: Privacy technology for everyone!",
    description: "We're building open source privacy technology for personalized software experiences.",
    images: ["/api/og"],
  },
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

export default function BlogPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      <SiteHeader />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-20 lg:px-6 lg:pt-20 lg:pb-16 gap-8 lg:gap-16">
        {/* Top Card - Logo and Title */}
        <div className="w-full max-w-2xl px-4 pt-16 pb-6 lg:px-12 lg:pt-16 lg:pb-8">
          {/* Blog Title */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-black lg:text-6xl tracking-tight mb-4 lg:mb-5">The Tiles Blog</h1>
            <p className="text-base text-black/50 lg:text-xl">Privacy technology for everyone!</p>
          </div>
        </div>

        {/* Bottom Card - Blog Posts List and Carousel */}
        <div className="w-full max-w-2xl px-4 pt-8 pb-2 lg:px-12 lg:pt-12 lg:pb-8 flex-1 space-y-8 lg:space-y-12">
          <div className="space-y-8 lg:space-y-12">
            {blogPosts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`} 
                className="block group"
              >
                <h2 className="text-xl font-bold text-black mb-2 group-hover:text-black/80 lg:text-3xl lg:mb-3 tracking-tight">
                  {post.title}
                </h2>
                <p className="text-base text-black/70 mb-2 lg:text-xl lg:mb-3 leading-relaxed">{post.description}</p>
                <div className="flex items-center gap-3 lg:gap-4">
                  <p className="text-sm text-black/40 lg:text-lg">{formatDate(post.date)}</p>
                  <span className="text-black/20">·</span>
                  <ReadingTime 
                    content={post.content} 
                    className="text-sm text-black/40 lg:text-lg"
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter Subscription Section */}
          <div className="pt-12 lg:pt-16 border-t border-black/10">
            <div className="space-y-4 lg:space-y-5">
              <div>
                <h3 className="text-lg font-semibold text-black mb-2 lg:text-xl lg:mb-3">Stay updated</h3>
                <p className="text-sm text-black/60 lg:text-base">
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
