'use client'

import Link from "next/link"
import { Heart } from "lucide-react"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRedditAlien } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { ThemeSwitcher } from "@/components/theme-switcher"
import { NewsletterCta } from "@/components/newsletter-cta"
import { FooterLanguageSelector } from "@/components/footer-language-selector"
import { TangledIcon } from "@/components/tangled-icon"
import { DownloadPlatformSubtext } from "@/components/download-platform-subtext"
import { DownloadTilesCta } from "@/components/download-tiles-cta"

interface SiteFooterProps {
  showNewsletterCta?: boolean
  /** Landing pages use the same minimal newsletter row with slightly more footer spacing. */
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

  const textColor = isDarkFooter ? 'text-[#e7e7ed]' : 'text-[#1d1d1f]'
  const textColorHover = isDarkFooter ? 'hover:text-[#c6c6cf]' : 'hover:text-[#1d1d1f]/65'
  const iconHoverTwitter = isDarkFooter ? 'group-hover:text-[#c6c6cf]' : 'group-hover:text-[#1d1d1f]/70'
  const iconHoverGithub = isDarkFooter ? 'group-hover:text-[#c6c6cf]' : 'group-hover:text-[#1d1d1f]/70'

  const themeSwitcherVariant = isDarkFooter ? 'dark' : 'light'
  const licenseTextColor = isDarkFooter ? 'text-[#8d8d98]' : 'text-[#1d1d1f]/72'
  const trustLineColor = 'text-[#CB30E0]'
  const footerSocialLinkClass =
    'group inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-sm transition-colors'
  const footerSocialIconClass = 'h-4 w-4 transition-colors'
  const footerTrustLineClass = `flex items-center gap-1.5 text-[13px] leading-5 ${trustLineColor}`

  return (
    <footer className="relative z-10 bg-transparent px-4 py-7 sm:px-6 lg:px-12 lg:py-9">
      <div className="mx-auto w-full max-w-6xl">
        {showNewsletterCta && newsletterCtaLayout === 'landing' ? (
          <section className="mb-8 lg:mb-10">
            <NewsletterCta surface={isDarkFooter ? 'dark' : 'light'} formClassName="lg:shrink-0" />
          </section>
        ) : null}

        {showNewsletterCta && newsletterCtaLayout === 'default' ? (
          <section className="mb-6 lg:mb-7">
            <div className="mx-auto w-full max-w-3xl">
              <NewsletterCta surface={isDarkFooter ? 'dark' : 'light'} />
            </div>
          </section>
        ) : null}

        {showDownloadCta && (
          <section className="mb-11 flex flex-col items-center gap-4 text-center lg:mb-14 lg:gap-5">
            <h2 className="text-balance text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground sm:text-[2.4rem]">
              Try Tiles now.
            </h2>
            <div className="inline-flex w-fit flex-col items-center gap-3">
              <DownloadTilesCta size="footer" />
              <DownloadPlatformSubtext size="footer" />
            </div>
          </section>
        )}

        <div className="mt-1 flex flex-col items-center gap-3.5 text-center lg:hidden">
          <div className="flex flex-col items-center gap-2">
            <p className={`${footerTrustLineClass} justify-center text-center`}>
              <Heart className="h-[0.95em] w-[0.95em] shrink-0 fill-current stroke-none" aria-hidden="true" />
              <span>Built by an independent team committed to privacy.</span>
            </p>
            <p data-footer-copyright className={`text-xs leading-5 ${licenseTextColor}`}>© 2026 Tiles Privacy & Contributors.</p>
          </div>

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

        <div className="mt-1 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-x-6 lg:gap-y-2.5 lg:text-left">
          <p className={`${footerTrustLineClass} col-span-2`}>
            <Heart className="h-[0.95em] w-[0.95em] shrink-0 fill-current stroke-none" aria-hidden="true" />
            <span>Built by an independent team committed to privacy.</span>
          </p>

          <div className="flex flex-col items-start gap-2.5">
            <p data-footer-copyright className={`pt-0.5 text-xs leading-5 ${licenseTextColor} whitespace-nowrap`}>© 2026 Tiles Privacy & Contributors.</p>
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
