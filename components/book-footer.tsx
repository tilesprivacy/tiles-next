'use client'

import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeToggle } from "@/components/theme-toggle"

export function BookFooter() {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use resolvedTheme if available, otherwise determine from theme/systemTheme
  const currentTheme = resolvedTheme || (theme === 'system' ? systemTheme : theme)
  const isDark = currentTheme === 'dark'
  
  // Invert: if book page is light, show dark footer; if dark, show light footer
  const footerIsDark = !isDark

  // Dark footer styles (default)
  const footerClasses = footerIsDark
    ? "relative z-20 shrink-0 h-[14dvh] border-t border-white/5 bg-black px-4 sm:px-6 overflow-hidden"
    : "relative z-20 shrink-0 h-[14dvh] border-t border-black/5 bg-white px-4 sm:px-6 overflow-hidden"

  const linkClasses = footerIsDark
    ? "text-white transition-colors hover:text-white/70"
    : "text-black transition-colors hover:text-black/70"

  const iconClasses = footerIsDark
    ? "h-4 w-4 text-white transition-colors"
    : "h-4 w-4 text-black transition-colors"

  const copyrightClasses = footerIsDark
    ? "text-xs text-white"
    : "text-xs text-black"

  const statusLinkClasses = footerIsDark
    ? "text-xs text-white transition-colors hover:text-white/70"
    : "text-xs text-black transition-colors hover:text-black/70"

  const borderClasses = footerIsDark
    ? "border-white/5"
    : "border-black/5"

  const toggleClasses = footerIsDark
    ? "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white/40 hover:text-white"
    : "inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/20 text-black/70 transition-colors hover:border-black/40 hover:text-black"

  const togglePlaceholder = footerIsDark
    ? "h-8 w-8 rounded-full border border-white/20"
    : "h-8 w-8 rounded-full border border-black/20"

  // Icon hover colors - keep brand colors but adjust base
  const iconHoverClasses = {
    twitter: footerIsDark ? "group-hover:text-white/70" : "group-hover:text-black/70",
    bluesky: "group-hover:text-[#0085FF]",
    instagram: "group-hover:text-[#E4405F]",
    discord: "group-hover:text-[#5865F2]",
    github: footerIsDark ? "group-hover:text-white/70" : "group-hover:text-black/70",
    huggingface: "group-hover:text-[#FFD21E]",
    rss: "group-hover:text-orange-500",
  }

  // Default to dark footer during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <footer className="relative z-20 shrink-0 h-[14dvh] border-t border-white/5 bg-black px-4 sm:px-6 overflow-hidden">
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-2 sm:gap-3 lg:gap-4">
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
            <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm flex-shrink-0">
              <Link href="/sub-processors" className="text-white transition-colors hover:text-white/70 whitespace-nowrap">
                Subprocessors
              </Link>
              <Link href="/terms" className="text-white transition-colors hover:text-white/70 whitespace-nowrap">
                Terms
              </Link>
              <Link href="/privacy" className="text-white transition-colors hover:text-white/70 whitespace-nowrap">
                Privacy
              </Link>
              <a
                href="https://tiles.run/book"
                className="text-white transition-colors hover:text-white/70 whitespace-nowrap"
              >
                Book
              </a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 mt-1 sm:mt-1.5">
              {/* Placeholder for icons */}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-2 border-t border-white/5 pt-1.5 sm:pt-2 text-[10px] sm:text-xs text-white">
            <p className="whitespace-nowrap">© 2026 Tiles Privacy</p>
            <a
              href="https://status.tiles.run/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-white/70 whitespace-nowrap"
            >
              Status
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-2.5 w-2.5"
              >
                <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={footerClasses}>
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-2 sm:gap-3 lg:gap-4">
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm flex-shrink-0">
            <Link href="/sub-processors" className={`${linkClasses} whitespace-nowrap`}>
              Subprocessors
            </Link>
            <Link href="/terms" className={`${linkClasses} whitespace-nowrap`}>
              Terms
            </Link>
            <Link href="/privacy" className={`${linkClasses} whitespace-nowrap`}>
              Privacy
            </Link>
            <a
              href="https://tiles.run/book"
              className={`${linkClasses} whitespace-nowrap`}
            >
              Book
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 mt-1 sm:mt-1.5">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white' : 'text-black'} transition-colors ${iconHoverClasses.twitter}`} />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white' : 'text-black'} transition-colors ${iconHoverClasses.bluesky}`} />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white' : 'text-black'} transition-colors ${iconHoverClasses.instagram}`} />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white' : 'text-black'} transition-colors ${iconHoverClasses.discord}`} />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white' : 'text-black'} transition-colors ${iconHoverClasses.github}`} />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white' : 'text-black'} transition-colors ${iconHoverClasses.huggingface}`} />
            </a>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="RSS Feed"
            >
              <FaRss className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white' : 'text-black'} transition-colors ${iconHoverClasses.rss}`} />
            </a>
          </div>
        </div>

        <div className={`flex flex-row items-center justify-between gap-2 border-t ${borderClasses} pt-1.5 sm:pt-2 text-[10px] sm:text-xs`}>
          <p className={`${copyrightClasses} whitespace-nowrap`}>© 2026 Tiles Privacy</p>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle
              className={toggleClasses}
              placeholderClassName={togglePlaceholder}
            />
            <a
              href="https://status.tiles.run/"
              target="_blank"
              rel="noopener noreferrer"
              className={`${statusLinkClasses} inline-flex items-center gap-1 whitespace-nowrap`}
            >
              Status
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-2.5 w-2.5"
              >
                <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
