import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog-posts"
import NewsletterForm from "@/components/newsletter-form"

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
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-6">
        <div className="flex items-center gap-2 text-base font-medium text-black lg:text-lg">
          <Link href="/" className="transition-colors hover:text-black/70">
            <Image src="/lighticon.png" alt="Tiles" width={32} height={32} className="h-7 w-7 lg:h-8 lg:w-8" />
          </Link>
          <span className="text-black/30">/</span>
          <Link href="/blog" className="font-bold transition-colors hover:text-black/70">
            Blog
          </Link>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              <Image
                src="/apple-logo-white.svg"
                alt="Apple"
                width={16}
                height={20}
                className="h-3.5 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-4"
              />
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Download</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 lg:gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-white/70 group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-20 lg:px-6 lg:pt-20 lg:pb-16 gap-8 lg:gap-16">
        {/* Top Card - Logo and Title */}
        <div className="w-full max-w-2xl px-4 pt-10 pb-6 lg:px-12 lg:py-8">
          {/* Logo */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <Image src="/lighticon.png" alt="Tiles Logo" width={64} height={64} className="h-12 w-12 lg:h-20 lg:w-20" />
          </div>

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
                <p className="text-sm text-black/40 lg:text-lg">{formatDate(post.date)}</p>
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
