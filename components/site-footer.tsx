'use client'

import Link from "next/link"
import { Download } from "lucide-react"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss, FaRedditAlien } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import NewsletterForm from "@/components/newsletter-form"
import { FooterLanguageSelector } from "@/components/footer-language-selector"
import { TangledIcon } from "@/components/tangled-icon"
import { triggerHaptic } from "@/lib/haptics"
import {
  downloadButtonIconMotionClasses,
  downloadButtonLabelMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"

interface SiteFooterProps {
  showNewsletterCta?: boolean
  /** Landing pages use homepage section typography; default matches blog listing. */
  newsletterCtaLayout?: 'default' | 'landing'
  showDownloadCta?: boolean
}

export function SiteFooter({
  showNewsletterCta = false,
  newsletterCtaLayout = 'default',
  showDownloadCta = true,
}: SiteFooterProps) {
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
  const footerSocialLinkClass =
    'group inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-sm transition-colors'
  const footerSocialIconClass = 'h-4 w-4 transition-colors'

  return (
    <footer className="relative z-10 bg-transparent px-4 py-7 sm:px-6 lg:px-12 lg:py-9">
      <div className="mx-auto w-full max-w-6xl">
        {showNewsletterCta && newsletterCtaLayout === 'landing' ? (
          <section className="mb-11 lg:mb-14">
            <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="max-w-[32rem] space-y-3 sm:space-y-3.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-2.5">
                  <h2 className="max-w-[18ch] text-balance text-[clamp(1.85rem,5.4vw,2.7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                    Stay updated
                  </h2>
                  <a
                    href="/api/rss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-sm ${textColor} transition-colors ${textColorHover}`}
                    aria-label="RSS Feed for blog posts"
                  >
                    <FaRss className="h-[1.35rem] w-[1.35rem] sm:h-7 sm:w-7" aria-hidden />
                  </a>
                </div>
                <p className="text-[1rem] leading-[1.55] text-black/62 dark:text-[#B1B1B1]">
                  Get updates on releases, privacy research, and performance engineering.
                </p>
              </div>
              <NewsletterForm
                surface={isDarkFooter ? 'dark' : 'light'}
                className="w-full lg:max-w-[28rem] lg:shrink-0"
              />
            </div>
          </section>
        ) : null}

        {showNewsletterCta && newsletterCtaLayout === 'default' ? (
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
                <NewsletterForm surface={isDarkFooter ? 'dark' : 'light'} className="w-full lg:max-w-[24rem]" />
              </div>
            </div>
          </section>
        ) : null}

        {showDownloadCta && (
          <section className="mb-11 flex flex-col items-center gap-4 text-center lg:mb-14 lg:gap-5">
            <h2 className="text-balance text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-[2.4rem]">
              Try Tiles now.
            </h2>
            <div className="inline-flex w-fit flex-col items-center gap-3">
              <Button
                asChild
                variant="ghost"
                className={`h-9 w-fit rounded-sm ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses} px-5 text-[0.83rem] font-medium sm:h-10 sm:px-5 sm:text-sm lg:h-10 lg:px-6 lg:text-[0.91rem]`}
              >
                <Link
                  href="/download"
                  onClick={() => {
                    triggerHaptic()
                  }}
                  className="group flex items-center gap-2"
                >
                  <span className={downloadButtonLabelMotionClasses}>Download Tiles</span>
                  <Download
                    className={`h-3.5 w-3.5 ${downloadButtonIconMotionClasses} sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4`}
                    aria-hidden
                  />
                </Link>
              </Button>
              <p className="inline-flex w-fit items-center whitespace-nowrap text-[0.67rem] font-medium text-black/48 dark:text-[#9A9A9A] sm:text-[0.72rem]">
                Alpha • macOS 14+ • Apple Silicon (M1+)
              </p>
              <Link
                href="/linux"
                className="text-[0.74rem] font-medium text-black/58 underline decoration-black/25 underline-offset-4 transition-colors hover:text-black/78 hover:decoration-black/45 dark:text-[#A4A4A4] dark:decoration-white/25 dark:hover:text-white/85 dark:hover:decoration-white/45 sm:text-[0.8rem]"
              >
                Get notified for Linux
              </Link>
            </div>
          </section>
        )}

        <div className="mt-1 flex flex-col items-center gap-3.5 text-center lg:hidden">
          <p className={`text-xs leading-5 ${licenseTextColor}`}>© 2026 Tiles Privacy & Contributors.</p>

          <div className="flex flex-col items-center gap-2.5">
            <nav aria-label="Footer links" className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 text-xs">
              <Link href="/sub-processors" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Subprocessors</Link>
              <Link href="/terms" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Terms</Link>
              <Link href="/privacy" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Privacy</Link>
              <Link href="/brand" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Brand</Link>
              <a
                href="https://status.tiles.run"
                target="_blank"
                rel="noopener noreferrer"
                className={`${textColor} inline-flex items-center gap-1 whitespace-nowrap transition-colors ${textColorHover}`}
              >
                Status
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                  <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </nav>

            <div className="-mx-1.5 flex flex-wrap items-center justify-center overflow-visible py-0.5">
              <a href="https://x.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="X (Twitter)">
                <FaXTwitter className={`${footerSocialIconClass} ${textColor} ${iconHoverTwitter}`} />
              </a>
              <a href="https://bsky.app/profile/tiles.run" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Bluesky">
                <FaBluesky className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
              <a href="https://go.tiles.run/discord" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Discord">
                <FaDiscord className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
              <a href="https://github.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="GitHub">
                <FaGithub className={`${footerSocialIconClass} ${textColor} ${iconHoverGithub}`} />
              </a>
              <a href="https://tangled.org/tiles.run" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Tangled">
                <TangledIcon className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
              <a href="https://huggingface.co/tilesprivacy" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Hugging Face">
                <SiHuggingface className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
            </div>
          </div>

          <div className="-mx-1 flex h-6 items-center justify-center gap-2 overflow-visible">
            <FooterLanguageSelector variant={themeSwitcherVariant} compact tone="quiet" touchFriendly />
            <ThemeSwitcher variant={themeSwitcherVariant} size="sm" mode="toggle" tone="quiet" touchFriendly />
          </div>
        </div>

        <div className="mt-1 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-x-6 lg:text-left">
          <div className="flex flex-col items-start gap-2.5">
            <p className={`pt-0.5 text-xs leading-5 ${licenseTextColor} whitespace-nowrap`}>© 2026 Tiles Privacy & Contributors.</p>
            <div className="-mx-1 flex h-6 items-center justify-start gap-2 overflow-visible">
              <FooterLanguageSelector variant={themeSwitcherVariant} compact tone="quiet" touchFriendly />
              <ThemeSwitcher variant={themeSwitcherVariant} size="sm" mode="toggle" tone="quiet" touchFriendly />
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-end gap-2 justify-self-end pt-0.5">
            <nav aria-label="Footer links" className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs leading-5">
              <Link href="/sub-processors" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Subprocessors</Link>
              <Link href="/terms" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Terms</Link>
              <Link href="/privacy" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Privacy</Link>
              <Link href="/brand" className={`${textColor} transition-colors ${textColorHover} whitespace-nowrap`}>Brand</Link>
              <a
                href="https://status.tiles.run"
                target="_blank"
                rel="noopener noreferrer"
                className={`${textColor} inline-flex items-center gap-1 whitespace-nowrap transition-colors ${textColorHover}`}
              >
                Status
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5 shrink-0" aria-hidden>
                  <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </nav>

            <div className="-mx-1.5 flex flex-wrap items-center justify-end overflow-visible py-0.5">
              <a href="https://x.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="X (Twitter)">
                <FaXTwitter className={`${footerSocialIconClass} ${textColor} ${iconHoverTwitter}`} />
              </a>
              <a href="https://bsky.app/profile/tiles.run" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Bluesky">
                <FaBluesky className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
              <a href="https://go.tiles.run/discord" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Discord">
                <FaDiscord className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
              <a href="https://github.com/tilesprivacy" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="GitHub">
                <FaGithub className={`${footerSocialIconClass} ${textColor} ${iconHoverGithub}`} />
              </a>
              <a href="https://tangled.org/tiles.run" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Tangled">
                <TangledIcon className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
              <a href="https://huggingface.co/tilesprivacy" target="_blank" rel="noopener noreferrer" className={footerSocialLinkClass} aria-label="Hugging Face">
                <SiHuggingface className={`${footerSocialIconClass} ${textColor} ${textColorHover}`} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
