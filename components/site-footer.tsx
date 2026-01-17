'use client'

import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss, FaRedditAlien } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from "@/components/theme-switcher"

export function SiteFooter() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reversed theme: dark footer when light mode, light footer when dark mode
  const isDarkFooter = !mounted || resolvedTheme === 'light'

  // Footer colors - reversed from page theme
  const footerBg = isDarkFooter ? 'bg-black' : 'bg-white'
  const borderColor = isDarkFooter ? 'border-white/5' : 'border-black/10'
  const textColor = isDarkFooter ? 'text-white' : 'text-black'
  const textColorHover = isDarkFooter ? 'hover:text-white/60' : 'hover:text-black/60'
  const iconHoverTwitter = isDarkFooter ? 'group-hover:text-white/70' : 'group-hover:text-black/70'
  const iconHoverGithub = isDarkFooter ? 'group-hover:text-white/70' : 'group-hover:text-black/70'

  // Theme switcher variant - opposite of page theme since footer is reversed
  const themeSwitcherVariant = isDarkFooter ? 'dark' : 'light'

  return (
    <footer className={`relative z-20 shrink-0 h-[14dvh] border-t ${borderColor} ${footerBg} px-4 sm:px-6 overflow-hidden`}>
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-2 sm:gap-3 lg:gap-4">
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

        {/* Bottom section - copyright, theme switcher, and status */}
        <div className={`flex flex-row items-center justify-between gap-2 ${isDarkFooter ? `border-t ${borderColor}` : ''} pt-1.5 sm:pt-2 text-[10px] sm:text-xs ${textColor}`}>
          <p className="whitespace-nowrap">© 2026 Tiles Privacy</p>
          
          {/* Theme Switcher - Desktop only */}
          <div className="hidden lg:block">
            <ThemeSwitcher variant={themeSwitcherVariant} size="sm" />
          </div>
          
          <a
            href="https://status.tiles.run/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 transition-colors ${textColorHover} whitespace-nowrap`}
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
