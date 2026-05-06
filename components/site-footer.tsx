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

interface SiteFooterProps {
  showNewsletterCta?: boolean
  showDownloadCta?: boolean
}

export function SiteFooter({ showNewsletterCta = false, showDownloadCta = true }: SiteFooterProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkFooter = !mounted || resolvedTheme === 'dark'

  // Footer always matches the page surface in both themes.
  const footerBg = 'bg-background'
  const borderColor = isDarkFooter ? 'border-white/12' : 'border-black/8'
  const textColor = isDarkFooter ? 'text-[#e7e7ed]' : 'text-[#1d1d1f]'
  const textColorHover = isDarkFooter ? 'hover:text-[#c6c6cf]' : 'hover:text-[#1d1d1f]/65'
  const iconHoverTwitter = isDarkFooter ? 'group-hover:text-[#c6c6cf]' : 'group-hover:text-[#1d1d1f]/70'
  const iconHoverGithub = isDarkFooter ? 'group-hover:text-[#c6c6cf]' : 'group-hover:text-[#1d1d1f]/70'

  const themeSwitcherVariant = isDarkFooter ? 'dark' : 'light'
  const newsletterDescriptionColor = isDarkFooter ? 'text-[#b8b8c2]' : 'text-[#1d1d1f]/70'
  const newsletterHeadingColor = isDarkFooter ? '!text-[#e7e7ed]' : '!text-[#1d1d1f]'
  const licenseTextColor = isDarkFooter ? 'text-[#8d8d98]' : 'text-[#1d1d1f]/72'
  const alphaPillClass =
    "inline-flex items-center rounded-full border border-black/15 bg-black/[0.03] px-1.5 py-0.5 text-[0.62rem] tracking-[0.12em] text-black/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-[#B9B9B9] sm:text-[0.66rem]"

  return (
    <footer className="relative z-10 bg-transparent px-4 py-5 sm:px-6 lg:px-12 lg:py-6">
      <div className="mx-auto w-full max-w-6xl">
        {showDownloadCta && (
          <section className="mb-8 text-center sm:mb-9 lg:mb-11">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <h2 className="text-[1.15rem] font-medium tracking-tight text-foreground sm:text-[1.3rem] lg:text-[1.35rem]">
                Try Tiles now.
              </h2>
              <Button
                asChild
                variant="ghost"
                className="mt-3 h-9 rounded-sm bg-black px-4 text-[0.82rem] font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-[#F2F2F2] sm:h-9.5 sm:px-4.5 sm:text-[0.84rem]"
              >
                <Link href="/download" className="group flex items-center gap-1.5 sm:gap-2">
                  <span>Download for macOS</span>
                  <Download
                    className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5"
                    aria-hidden
                  />
                </Link>
              </Button>
              <p className="mt-1.5 inline-flex w-fit items-center gap-1.5 whitespace-nowrap text-[0.62rem] font-medium text-black/58 dark:text-[#9A9A9A] sm:text-[0.66rem]">
                <span>Currently available as a CLI in</span>
                <span className={alphaPillClass}>ALPHA</span>
              </p>
              <Link
                href="/linux"
                className="mt-1.5 text-[0.68rem] font-medium text-black/54 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black/72 hover:decoration-black/35 dark:text-[#A4A4A4] dark:decoration-white/20 dark:hover:text-white/82 dark:hover:decoration-white/35 sm:text-[0.72rem]"
              >
                Get notified for Linux
              </Link>
            </div>
          </section>
        )}

        {showNewsletterCta && (
          <section className="mb-6 lg:mb-7">
            <div className="mx-auto w-full max-w-3xl">
              <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-7">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-[0.95rem] font-medium tracking-tight ${newsletterHeadingColor}`}>Stay updated</h3>
                    <a
                      href="/api/rss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center ${textColor} transition-colors ${textColorHover}`}
                      aria-label="RSS Feed for blog posts"
                    >
                      <FaRss className="h-4 w-4" />
                    </a>
                  </div>
                  <p className={`text-[0.84rem] leading-6 ${newsletterDescriptionColor}`}>
                    Get updates on releases, privacy research, and performance engineering.
                  </p>
                </div>
                <NewsletterForm surface={isDarkFooter ? "dark" : "light"} className="w-full lg:max-w-[24rem]" />
              </div>
            </div>
          </section>
        )}

        <div className="mt-1 flex flex-col gap-4 text-center lg:hidden">
          <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 text-xs">
            <Link href="/sub-processors" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Subprocessors</Link>
            <Link href="/terms" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Terms</Link>
            <Link href="/privacy" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Privacy</Link>
            <Link href="/brand" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Brand</Link>
            <a
              href="https://status.tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap inline-flex items-center gap-1`}
            >
              Status
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a href="https://x.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="X (Twitter)">
              <FaXTwitter className={`h-4 w-4 ${textColor} transition-colors ${iconHoverTwitter}`} />
            </a>
            <a href="https://bsky.app/profile/tiles.run" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Bluesky">
              <FaBluesky className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
            </a>
            <a href="https://go.tiles.run/discord" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Discord">
              <FaDiscord className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
            </a>
            <a href="https://github.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="GitHub">
              <FaGithub className={`h-4 w-4 ${textColor} transition-colors ${iconHoverGithub}`} />
            </a>
            <a href="https://tangled.org/tiles.run" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Tangled">
              <TangledIcon className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
            </a>
            <a href="https://huggingface.co/tilesprivacy" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Hugging Face">
              <SiHuggingface className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
            </a>
          </div>

          <div className="flex items-center justify-center gap-2">
            <FooterLanguageSelector variant={themeSwitcherVariant} compact />
            <ThemeSwitcher variant={themeSwitcherVariant} size="sm" mode="toggle" />
          </div>

          <p className={`text-xs leading-5 ${licenseTextColor} whitespace-nowrap`}>© 2026 Tiles Privacy & Contributors.</p>
        </div>

        <div className="mt-1 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-x-6 lg:text-left">
          <div className="flex flex-col items-start gap-2">
            <p className={`pt-0.5 text-xs leading-5 ${licenseTextColor} whitespace-nowrap`}>© 2026 Tiles Privacy & Contributors.</p>
            <div className="flex items-center justify-center gap-2">
              <FooterLanguageSelector variant={themeSwitcherVariant} compact />
              <ThemeSwitcher variant={themeSwitcherVariant} size="sm" mode="toggle" />
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-end gap-3 justify-self-end">
              <nav aria-label="Footer links" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs leading-5">
                <Link href="/sub-processors" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Subprocessors</Link>
                <Link href="/terms" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Terms</Link>
                <Link href="/privacy" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Privacy</Link>
                <Link href="/brand" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Brand</Link>
                <a
                  href="https://status.tiles.run"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap inline-flex items-center gap-1`}
                >
                  Status
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </nav>

              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <a href="https://x.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="X (Twitter)">
                  <FaXTwitter className={`h-4 w-4 ${textColor} transition-colors ${iconHoverTwitter}`} />
                </a>
                <a href="https://bsky.app/profile/tiles.run" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Bluesky">
                  <FaBluesky className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
                </a>
                <a href="https://go.tiles.run/discord" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Discord">
                  <FaDiscord className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
                </a>
                <a href="https://github.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="GitHub">
                  <FaGithub className={`h-4 w-4 ${textColor} transition-colors ${iconHoverGithub}`} />
                </a>
                <a href="https://tangled.org/tiles.run" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Tangled">
                  <TangledIcon className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
                </a>
                <a href="https://huggingface.co/tilesprivacy" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center p-1.5 -m-1.5" aria-label="Hugging Face">
                  <SiHuggingface className={`h-4 w-4 ${textColor} transition-colors ${textColorHover}`} />
                </a>
              </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
