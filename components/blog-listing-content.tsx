'use client'

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
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
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Theme-aware colors
  const bgColor = 'bg-background'
  const textColor = 'text-foreground'
  const textColorMuted = isDark ? 'text-white/50' : 'text-black/50'
  const textColorBody = isDark ? 'text-white/70' : 'text-black/70'
  const textColorSubtle = isDark ? 'text-white/40' : 'text-black/40'
  const textColorHover = isDark ? 'group-hover:text-white/80' : 'group-hover:text-black/80'
  const borderColor = isDark ? 'border-white/10' : 'border-black/10'

  return (
    <div className={`relative flex min-h-screen flex-col ${bgColor} lg:overflow-visible`}>
      <SiteHeader themeAware />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-20 lg:px-6 lg:pt-20 lg:pb-16 gap-8 lg:gap-16">
        {/* Top Card - Logo and Title */}
        <div className="w-full max-w-2xl px-4 pt-16 pb-6 lg:px-12 lg:pt-16 lg:pb-8">
          {/* Blog Title */}
          <div className="text-center">
            <h1 className={`text-3xl font-semibold ${textColor} lg:text-5xl tracking-tight mb-4 lg:mb-5`}>The Tiles Blog</h1>
            <p className={`text-base ${textColorMuted} lg:text-xl`}>Privacy technology for everyone!</p>
          </div>
        </div>

        {/* Bottom Card - Blog Posts List and Carousel */}
        <div className="w-full max-w-2xl px-4 pt-8 pb-2 lg:px-12 lg:pt-12 lg:pb-8 flex-1 space-y-8 lg:space-y-12">
          <div className="space-y-8 lg:space-y-12">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`} 
                className="block group"
              >
                <h2 className={`text-xl font-bold ${textColor} mb-2 ${textColorHover} lg:text-2xl lg:mb-3 tracking-tight`}>
                  {post.title}
                </h2>
                <p className={`text-sm ${textColorBody} mb-2 lg:text-base lg:mb-3 leading-relaxed`}>{post.description}</p>
                <div className="flex items-center gap-3 lg:gap-4">
                  <p className={`text-xs ${textColorSubtle} lg:text-sm`}>{formatDate(post.date)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter Subscription Section */}
          <div className={`pt-12 lg:pt-16 border-t ${borderColor}`}>
            <div className="space-y-4 lg:space-y-5">
              <div>
                <h3 className={`text-base font-semibold ${textColor} mb-2 lg:text-lg lg:mb-3`}>Stay updated</h3>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'} lg:text-base`}>
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
