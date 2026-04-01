'use client'

import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss, FaRedditAlien } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from "@/components/theme-switcher"
import NewsletterForm from "@/components/newsletter-form"

export function SiteFooter() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reversed theme: dark footer when light mode, light footer when dark mode
  const isDarkFooter = !mounted || resolvedTheme === 'light'

  // Footer colors - reversed from page theme (matching book dark theme colors)
  const footerBg = isDarkFooter ? 'bg-black' : 'bg-white'
  const borderColor = isDarkFooter ? 'border-[#2a2a2a]' : 'border-black/10'
  const textColor = isDarkFooter ? 'text-[#E6E6E6]' : 'text-black'
  const textColorHover = isDarkFooter ? 'hover:text-[#B3B3B3]' : 'hover:text-black/60'
  const iconHoverTwitter = isDarkFooter ? 'group-hover:text-[#B3B3B3]' : 'group-hover:text-black/70'
  const iconHoverGithub = isDarkFooter ? 'group-hover:text-[#B3B3B3]' : 'group-hover:text-black/70'

  // Theme switcher variant - opposite of page theme since footer is reversed
  const themeSwitcherVariant = isDarkFooter ? 'dark' : 'light'
  const newsletterDescriptionColor = isDarkFooter ? 'text-[#B3B3B3]' : 'text-black/60'
  const newsletterHeadingColor = isDarkFooter ? '!text-[#E6E6E6]' : '!text-black'
  const licenseTextColor = isDarkFooter ? 'text-[#8A8A8A]' : 'text-black/50'

  return (
    <footer className={`relative z-20 border-t ${borderColor} ${footerBg} px-6 lg:px-12 py-8 lg:py-10`}>
      <div className="mx-auto max-w-6xl flex flex-col gap-8 lg:gap-10">
        <section className={`grid gap-6 border-b pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(330px,420px)] lg:items-end lg:gap-10 lg:pb-10 ${borderColor}`}>
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-semibold tracking-tight lg:text-xl ${newsletterHeadingColor}`}>
                Stay updated
              </h3>
              <a
                href="/api/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center"
                aria-label="RSS Feed for blog posts"
              >
                <FaRss className={`h-4 w-4 ${textColor} transition-colors group-hover:text-orange-500`} />
              </a>
            </div>
            <p className={`text-sm leading-relaxed lg:text-base ${newsletterDescriptionColor}`}>
              Get updates on product releases, privacy research, and engineering.
            </p>
            <p className={`text-xs ${newsletterDescriptionColor}`}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
          <div className="w-full">
            <NewsletterForm
              surface={isDarkFooter ? "dark" : "light"}
              className="w-full"
            />
          </div>
        </section>

        {/* Main content - consistent layout on mobile and desktop */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Links - left aligned on all screens */}
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:gap-4 sm:text-sm md:gap-6">
            <Link href="/sub-processors" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
              Subprocessors
            </Link>
            <Link href="/terms" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
              Terms
            </Link>
            <Link href="/privacy" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
              Privacy
            </Link>
            <a
              href="https://status.tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap inline-flex items-center gap-1`}
            >
              Status
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-2.5 w-2.5 shrink-0"
                aria-hidden
              >
                <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>

          {/* Social icons - right aligned on all screens */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-5 mt-1 sm:mt-1.5">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${iconHoverTwitter}`} />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="Bluesky"
            >
              <FaBluesky className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors group-hover:text-[#0085FF]`} />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="Instagram"
            >
              <FaInstagram className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors group-hover:text-[#E4405F]`} />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="Discord"
            >
              <FaDiscord className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors group-hover:text-[#5865F2]`} />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="GitHub"
            >
              <FaGithub className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${iconHoverGithub}`} />
            </a>
            <a
              href="https://www.reddit.com/user/sdexca/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="Reddit"
            >
              <FaRedditAlien className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors group-hover:text-[#FF4500]`} />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="Hugging Face"
            >
              <SiHuggingface className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors group-hover:text-[#FFD21E]`} />
            </a>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center p-1.5 -m-1.5"
              aria-label="RSS Feed"
            >
              <FaRss className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors group-hover:text-orange-500`} />
            </a>
          </div>
        </div>

        {/* Bottom section - copyright, network credits, Atmosphere, and theme switcher */}
        <div className={`flex flex-col gap-2 pt-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-2 text-[10px] sm:text-xs ${textColor}`}>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="whitespace-nowrap">© 2026 Tiles Privacy & Contributors.</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <p className="inline-flex items-center gap-1.5 leading-tight">
                <span>A</span>
                <a
                  href="https://userandagents.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="U&A"
                  className="inline-flex items-center"
                >
                  <img
                    src="/ua-logo.svg"
                    alt="U&A"
                    width={40}
                    height={20}
                    className="h-4 sm:h-5 w-auto"
                  />
                </a>
                <span>network project.</span>
              </p>
              <p className="inline-flex items-center gap-0 leading-tight">
                <span>Built on{" "}</span>
                <a
                  href="https://atproto.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="the Atmosphere"
                  className={`${textColor} transition-colors ${textColorHover}`}
                >
                  the Atmosphere
                </a>
              </p>
            </div>
          </div>

          {/* Theme Switcher - visible on all screens */}
          <ThemeSwitcher variant={themeSwitcherVariant} size="sm" />
        </div>

        <div className={`text-[10px] leading-relaxed sm:text-xs ${licenseTextColor}`}>
          <p>This work is dual-licensed under the MIT and Apache 2.0 licenses.</p>
          <p>
            To view a copy of this license, visit{" "}
            <a
              href="https://download.tiles.run/LICENSE.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              https://download.tiles.run/LICENSE.txt
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
