import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import type { Metadata } from "next"
import { blogPosts } from "@/lib/blog-posts"
import NewsletterForm from "@/components/newsletter-form"

export const metadata: Metadata = {
  title: "The Tiles Blog",
  description: "We're building open source privacy technology for personalized software experiences.",
  openGraph: {
    title: "The Tiles Blog",
    description: "We're building open source privacy technology for personalized software experiences.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "The Tiles Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Tiles Blog",
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
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 lg:fixed lg:px-6 lg:py-6">
        <Link href="/" className="text-sm text-black/60 transition-colors hover:text-black lg:text-base">
          ← Back
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 overflow-hidden rounded-full bg-black p-0 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:text-sm"
          >
            <a
              href="https://github.com/tilesprivacy/tiles"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <div className="flex items-center justify-center px-3 lg:px-4">
                <FaGithub className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </div>
              <div className="h-full w-px bg-white/20"></div>
              <div className="flex items-center justify-center px-3 lg:px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 lg:h-4 lg:w-4"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </a>
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
                className="h-3.5 w-3.5 fill-[#ff8fb6] transition-all duration-300 group-hover:scale-110 group-hover:fill-[#ffc2dd] group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-2 lg:px-6 lg:pt-20 lg:pb-16 gap-3 lg:gap-4 xl:min-h-0 xl:overflow-hidden">
        {/* Top Card - Logo and Title */}
        <div className="w-full max-w-2xl px-4 pt-10 pb-3 lg:px-12 lg:py-4">
          {/* Logo */}
          <div className="flex justify-center mb-3 lg:mb-4">
            <Image src="/lighticon.png" alt="Tiles Logo" width={64} height={64} className="h-12 w-12 lg:h-20 lg:w-20" />
          </div>

          {/* Blog Title */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2 lg:mb-3">
              <h1 className="text-3xl font-semibold text-black lg:text-6xl tracking-tight">The Tiles Blog</h1>
              <a
                href="/api/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center"
                aria-label="RSS Feed"
              >
                <FaRss className="h-5 w-5 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500 group-active:text-orange-500 lg:h-7 lg:w-7" />
              </a>
            </div>
            <p className="text-base text-black/50 lg:text-xl">Privacy technology for everyone!</p>
          </div>
        </div>

        {/* Bottom Card - Blog Posts List and Carousel */}
        <div className="w-full max-w-2xl px-4 pt-14 pb-2 lg:px-12 lg:pt-24 lg:pb-3 flex-1 space-y-6 lg:space-y-10 overflow-y-auto">
          <div className="space-y-4 lg:space-y-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-xl font-semibold text-blue-600 mb-1 group-hover:text-blue-700 transition-colors lg:text-3xl lg:mb-2 tracking-tight">
                  {post.title}
                </h2>
                <p className="text-base text-black/70 mb-1 lg:text-xl lg:mb-2 leading-relaxed">{post.description}</p>
                <p className="text-sm text-black/40 lg:text-lg">{formatDate(post.date)}</p>
              </Link>
            ))}
          </div>

          {/* Newsletter Subscription Section */}
          <div className="pt-8 lg:pt-12 border-t border-black/10">
            <div className="space-y-3 lg:space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-black mb-1 lg:text-xl">Stay updated</h3>
                <p className="text-sm text-black/60 lg:text-base">
                  Get notified when we publish new posts about privacy and personalization.
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 flex shrink-0 flex-col gap-3 bg-white px-4 pb-3 pt-4 text-xs text-black/60 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:px-6 lg:py-4 lg:text-sm">
        <a
          href="https://book.tiles.run"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-black/60 transition-colors hover:text-black"
        >
          Book
        </a>
        <Link href="/blog" className="font-medium text-black/60 transition-colors hover:text-black">
          Blog
        </Link>
        <Link href="/about" className="font-medium text-black/60 transition-colors hover:text-black">
          About
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-black/60">© 2026 Tiles Privacy</span>
          <div className="flex items-center gap-2.5 lg:gap-4">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#000000] group-active:text-[#000000] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0085FF] group-active:text-[#0085FF] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#E4405F] group-active:text-[#E4405F] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#5865F2] group-active:text-[#5865F2] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://www.reddit.com/r/tilesprivacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Reddit"
            >
              <FaReddit className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF4500] group-active:text-[#FF4500] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#181717] group-active:text-[#181717] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FFD21E] group-active:text-[#FFD21E] lg:h-5 lg:w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
