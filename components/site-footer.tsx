'use client'

import Link from "next/link"
import { Download } from "lucide-react"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss, FaRedditAlien } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from "@/components/theme-switcher"
import NewsletterForm from "@/components/newsletter-form"
import { FooterLanguageSelector } from "@/components/footer-language-selector"
import { TangledIcon } from "@/components/tangled-icon"
import { Button } from "@/components/ui/button"
import {
  downloadButtonIconMotionClasses,
  downloadButtonLabelMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"

interface SiteFooterProps {
  showTryTilesCta?: boolean
}

export function SiteFooter({ showTryTilesCta = true }: SiteFooterProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkFooter = !mounted || resolvedTheme === 'dark'

  // Footer always matches the page surface in both themes.
  const footerBg = 'bg-background'
  const borderColor = isDarkFooter ? 'border-white/18' : 'border-black/8'
  const textColor = isDarkFooter ? 'text-[#e7e7ed]' : 'text-[#1d1d1f]'
  const textColorHover = isDarkFooter ? 'hover:text-[#c6c6cf]' : 'hover:text-[#1d1d1f]/65'
  const iconHoverTwitter = isDarkFooter ? 'group-hover:text-[#c6c6cf]' : 'group-hover:text-[#1d1d1f]/70'
  const iconHoverGithub = isDarkFooter ? 'group-hover:text-[#c6c6cf]' : 'group-hover:text-[#1d1d1f]/70'

  const themeSwitcherVariant = isDarkFooter ? 'dark' : 'light'
  const newsletterDescriptionColor = isDarkFooter ? 'text-[#b0b0ba]' : 'text-[#1d1d1f]/74'
  const newsletterHeadingColor = isDarkFooter ? '!text-[#e7e7ed]' : '!text-[#1d1d1f]'
  const licenseTextColor = isDarkFooter ? 'text-[#8d8d98]' : 'text-[#1d1d1f]/72'
  const alphaPillClass =
    "inline-flex items-center rounded-full border border-black/15 bg-black/[0.03] px-1.5 py-0.5 text-[0.62rem] tracking-[0.12em] text-black/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-[#B9B9B9] sm:text-[0.66rem]"

  return (
    <>
      {showTryTilesCta && (
        <section className="bg-background px-4 sm:px-6 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <section className="border-t border-black/10 pb-16 pt-12 text-center dark:border-white/10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
              <div className="mx-auto flex max-w-2xl flex-col items-center">
                <h2 className="text-5xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-[4.2rem]">
                  Try Tiles now.
                </h2>
                <Button
                  asChild
                  variant="ghost"
                  className={`mt-7 h-10 rounded-sm ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses} px-5 text-sm font-medium sm:mt-8 sm:h-11 sm:px-6 sm:text-base`}
                >
                  <Link href="/download" className="group flex items-center gap-1.5 sm:gap-2">
                    <span className={downloadButtonLabelMotionClasses}>
                      Download for macOS
                    </span>
                    <Download
                      className={`h-3.5 w-3.5 ${downloadButtonIconMotionClasses} sm:h-4 sm:w-4`}
                      aria-hidden
                    />
                  </Link>
                </Button>
                <p className="mt-2 inline-flex w-fit items-center gap-1.5 whitespace-nowrap text-[0.65rem] font-medium text-black/62 dark:text-[#9A9A9A] sm:text-[0.68rem]">
                  <span>Currently available as a CLI in</span>
                  <span className={alphaPillClass}>ALPHA</span>
                </p>
                <Link
                  href="/linux"
                  className="mt-2 text-[0.72rem] font-medium text-black/58 underline decoration-black/25 underline-offset-4 transition-colors hover:text-black/78 hover:decoration-black/45 dark:text-[#A4A4A4] dark:decoration-white/25 dark:hover:text-white/85 dark:hover:decoration-white/45 sm:text-[0.76rem]"
                >
                  Get notified for Linux
                </Link>
              </div>
            </section>
          </div>
        </section>
      )}

      <footer className={`relative z-10 border-t ${borderColor} ${footerBg} px-6 lg:px-12 py-10 lg:py-12`}>
        <div className="mx-auto max-w-6xl flex flex-col gap-10 lg:gap-12">
        <section className={`grid gap-8 border-b pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(330px,420px)] lg:items-end lg:gap-x-12 lg:gap-y-0 lg:pb-12 ${borderColor}`}>
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2.5">
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
                <FaRss className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
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

        {/* Main content grouped by priority: navigation first, then community links */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
          <div>
            <nav aria-label="Footer links" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm md:gap-x-6">
              <Link href="/sub-processors" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
                Subprocessors
              </Link>
              <Link href="/terms" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
                Terms
              </Link>
              <Link href="/privacy" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
                Privacy
              </Link>
              <Link href="/brand" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>
                Brand
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
          </div>

          <div className="lg:text-right">
            <div className="flex flex-wrap items-center gap-4 sm:gap-4 lg:justify-end lg:gap-5">
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
                <FaBluesky className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${textColorHover}`} />
              </a>
              <a
                href="https://www.instagram.com/tilesprivacy"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center p-1.5 -m-1.5"
                aria-label="Instagram"
              >
                <FaInstagram className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${textColorHover}`} />
              </a>
              <a
                href="https://go.tiles.run/discord"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center p-1.5 -m-1.5"
                aria-label="Discord"
              >
                <FaDiscord className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${textColorHover}`} />
              </a>
              <a
                href="https://www.reddit.com/r/tilesprivacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center p-1.5 -m-1.5"
                aria-label="Reddit"
              >
                <FaRedditAlien className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${textColorHover}`} />
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
                href="https://tangled.org/tiles.run"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center p-1.5 -m-1.5"
                aria-label="Tangled"
              >
                <TangledIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${textColorHover}`} />
              </a>
              <a
                href="https://huggingface.co/tilesprivacy"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center p-1.5 -m-1.5"
                aria-label="Hugging Face"
              >
                <SiHuggingface className={`h-4 w-4 sm:h-5 sm:w-5 ${textColor} transition-colors ${textColorHover}`} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section - controls and legal details */}
        <div className={`border-t ${borderColor} pt-9 sm:pt-10 space-y-7 sm:space-y-6`}>
          <div className={`flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6 text-[10px] sm:text-xs ${textColor}`}>
            <div className="flex min-w-0 flex-col gap-4 sm:gap-3">
              <p className="whitespace-nowrap leading-snug sm:leading-normal">© 2026 Tiles Privacy & Contributors.</p>
              <div className="flex flex-col items-start gap-y-3 sm:gap-y-2">
                {/*
                <p className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5 leading-snug sm:leading-normal">
                  <span>Built on</span>
                  <a
                    href="https://atproto.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="the Atmosphere"
                    className={`${textColor} transition-colors ${textColorHover}`}
                  >
                    the ATmosphere
                  </a>
                </p>
                */}
                <p className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 leading-snug sm:leading-normal">
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
              </div>
            </div>

            {/* Preferences stay close to legal/meta info so they are easy to find */}
            <div className="shrink-0 self-start sm:self-start sm:pt-0.5 flex items-center gap-2.5">
              <FooterLanguageSelector variant={themeSwitcherVariant} />
              <ThemeSwitcher variant={themeSwitcherVariant} size="sm" />
            </div>
          </div>

          <div className={`text-[10px] leading-relaxed sm:text-xs space-y-2.5 sm:space-y-1.5 ${licenseTextColor}`}>
            <p>
              Disclosure: The Tiles AI assistant runs natively as a CLI, not a web app. All code for the Tiles AI
              assistant is handwritten and reviewed by humans, with readability and security as baseline requirements.
              Design assets and the Tiles CLI codebase are human-created, with the exception of test cases developed
              with AI assistance. The Tiles Privacy website surfaces are AI-generated presentation only and contain no
              business logic. All assistant functionality resides in the native application, and the site stores no
              user data and includes no authentication, account modification, or other interactive features prone to
              attack.
            </p>
            <p>This work is dual-licensed under the MIT and Apache 2.0 licenses.</p>
            <p>
              To view a copy of this license, visit{" "}
              <a
                href="https://download.tiles.run/LICENSE.txt"
                target="_blank"
                rel="noopener noreferrer"
                data-skip-mobile-download-prompt="true"
                className="underline underline-offset-2 transition-opacity hover:opacity-100"
              >
                https://download.tiles.run/LICENSE.txt
              </a>
            </p>
          </div>
        </div>
        </div>
      </footer>
    </>
  )
}
