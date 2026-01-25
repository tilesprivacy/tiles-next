'use client'

import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function BookFooter() {
  // Inverted footer colors: default dark footer, light footer in dark mode
  const footerClasses =
    "relative z-20 shrink-0 h-[14dvh] border-t border-white/5 bg-black px-4 sm:px-6 overflow-hidden dark:border-black/5 dark:bg-white"
  const linkClasses =
    "text-white transition-colors hover:text-white/70 dark:text-black dark:hover:text-black/70"
  const iconClasses =
    "h-4 w-4 text-white transition-colors dark:text-black"
  const copyrightClasses =
    "text-xs text-white dark:text-black"
  const statusLinkClasses =
    "text-xs text-white transition-colors hover:text-white/70 dark:text-black dark:hover:text-black/70"
  const iconHoverClasses = {
    twitter: "group-hover:text-white/70 dark:group-hover:text-black/70",
    bluesky: "group-hover:text-[#0085FF]",
    instagram: "group-hover:text-[#E4405F]",
    discord: "group-hover:text-[#5865F2]",
    github: "group-hover:text-white/70 dark:group-hover:text-black/70",
    huggingface: "group-hover:text-[#FFD21E]",
    rss: "group-hover:text-orange-500",
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
              <FaXTwitter className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconClasses} ${iconHoverClasses.twitter}`} />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconClasses} ${iconHoverClasses.bluesky}`} />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconClasses} ${iconHoverClasses.instagram}`} />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconClasses} ${iconHoverClasses.discord}`} />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconClasses} ${iconHoverClasses.github}`} />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconClasses} ${iconHoverClasses.huggingface}`} />
            </a>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="RSS Feed"
            >
              <FaRss className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${iconClasses} ${iconHoverClasses.rss}`} />
            </a>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between gap-2 pt-1.5 sm:pt-2 text-[10px] sm:text-xs">
          <p className={`${copyrightClasses} whitespace-nowrap`}>© 2026 Tiles Privacy</p>
          
          {/* Theme Switcher */}
          <div className="block dark:hidden">
            <ThemeSwitcher variant="dark" size="sm" />
          </div>
          <div className="hidden dark:block">
            <ThemeSwitcher variant="light" size="sm" />
          </div>
          
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
    </footer>
  )
}
