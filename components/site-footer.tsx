"use client"

import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss, FaRedditAlien } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function SiteFooter() {
  // Footer colors - reversed from page theme (matching book dark theme colors)
  const footerBg = 'bg-black dark:bg-white'
  const borderColor = 'border-[#2a2a2a] dark:border-black/10'
  const textColor = 'text-[#E6E6E6] dark:text-black'
  const textColorHover = 'hover:text-[#B3B3B3] dark:hover:text-black/60'
  const iconHoverTwitter = 'group-hover:text-[#B3B3B3] dark:group-hover:text-black/70'
  const iconHoverGithub = 'group-hover:text-[#B3B3B3] dark:group-hover:text-black/70'

  return (
    <footer className={`relative z-20 border-t ${borderColor} ${footerBg} px-4 sm:px-6 py-6 sm:py-8 lg:py-10`}>
      <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:gap-5 lg:gap-6">
        {/* Main content - consistent layout on mobile and desktop */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Links - left aligned on all screens */}
          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm flex-shrink-0">
            <Link href="/sub-processors" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
              Subprocessors
            </Link>
            <Link href="/terms" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
              Terms
            </Link>
            <Link href="/privacy" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
              Privacy
            </Link>
          </nav>

          {/* Social icons - right aligned on all screens */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 mt-1 sm:mt-1.5">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors ${iconHoverTwitter}`} />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors group-hover:text-[#0085FF]`} />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors group-hover:text-[#E4405F]`} />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors group-hover:text-[#5865F2]`} />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors ${iconHoverGithub}`} />
            </a>
            <a
              href="https://www.reddit.com/user/sdexca/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Reddit"
            >
              <FaRedditAlien className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors group-hover:text-[#FF4500]`} />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors group-hover:text-[#FFD21E]`} />
            </a>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="RSS Feed"
            >
              <FaRss className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${textColor} transition-colors group-hover:text-orange-500`} />
            </a>
          </div>
        </div>

        {/* Bottom section - copyright and theme switcher */}
        <div className={`flex flex-row items-center justify-between gap-2 pt-1.5 sm:pt-2 text-[10px] sm:text-xs ${textColor}`}>
          <p className="whitespace-nowrap">© 2026 Tiles Privacy</p>
          
          {/* Theme Switcher - visible on all screens */}
          <div className="block dark:hidden">
            <ThemeSwitcher variant="dark" size="sm" />
          </div>
          <div className="hidden dark:block">
            <ThemeSwitcher variant="light" size="sm" />
          </div>
        </div>
      </div>
    </footer>
  )
}
