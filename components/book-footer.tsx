'use client'

import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from "@/components/theme-switcher"

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
    ? "text-white dark:text-white transition-colors hover:text-white/70"
    : "!text-black dark:!text-black transition-colors hover:text-black/70"

  const iconClasses = footerIsDark
    ? "h-4 w-4 text-white dark:text-white transition-colors"
    : "h-4 w-4 !text-black dark:!text-black transition-colors"

  const copyrightClasses = footerIsDark
    ? "text-xs text-white dark:text-white"
    : "text-xs !text-black dark:!text-black"

  // Theme switcher variant - based on footer color (not page theme)
  const themeSwitcherVariant = footerIsDark ? 'dark' : 'light'

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
            </nav>
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 mt-1 sm:mt-1.5">
              {/* Placeholder for icons */}
            </div>
          </div>
          <div className="flex flex-row items-center justify-between gap-2 pt-1.5 sm:pt-2 text-[10px] sm:text-xs text-white">
            <p className="whitespace-nowrap">© 2026 Tiles Privacy</p>
            <ThemeSwitcher variant="dark" size="sm" />
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
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 mt-1 sm:mt-1.5">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white dark:text-white' : '!text-black dark:!text-black'} transition-colors ${iconHoverClasses.twitter}`} />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white dark:text-white' : '!text-black dark:!text-black'} transition-colors ${iconHoverClasses.bluesky}`} />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white dark:text-white' : '!text-black dark:!text-black'} transition-colors ${iconHoverClasses.instagram}`} />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white dark:text-white' : '!text-black dark:!text-black'} transition-colors ${iconHoverClasses.discord}`} />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white dark:text-white' : '!text-black dark:!text-black'} transition-colors ${iconHoverClasses.github}`} />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white dark:text-white' : '!text-black dark:!text-black'} transition-colors ${iconHoverClasses.huggingface}`} />
            </a>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="RSS Feed"
            >
              <FaRss className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${footerIsDark ? 'text-white dark:text-white' : '!text-black dark:!text-black'} transition-colors ${iconHoverClasses.rss}`} />
            </a>
          </div>
        </div>

        <div className={`flex flex-row items-center justify-between gap-2 pt-1.5 sm:pt-2 text-[10px] sm:text-xs ${copyrightClasses}`}>
          <p className="whitespace-nowrap">© 2026 Tiles Privacy</p>
          <ThemeSwitcher variant={themeSwitcherVariant} size="sm" />
        </div>
      </div>
    </footer>
  )
}
