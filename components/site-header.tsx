'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { memo, useCallback, useEffect, useState } from "react"
import { Download } from "lucide-react"
import { MobileMenu } from "./mobile-menu"
import { triggerHaptic } from "@/lib/haptics"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"
import { usePathname } from "next/navigation"

/** Set to true to show the top banner (e.g. for announcements). */
const BANNER_ENABLED = false

interface SiteHeaderProps {
  themeAware?: boolean
}

const SiteHeaderChrome = memo(function SiteHeaderChrome({
  themeAware,
  isBannerVisible,
  onDismissBanner,
  onOpenMenu,
  onDownloadClick,
  onHomeClick,
}: {
  themeAware: boolean
  isBannerVisible: boolean
  onDismissBanner: () => void
  onOpenMenu: () => void
  onDownloadClick: () => void
  onHomeClick: (event: { preventDefault: () => void }) => void
}) {
  const headerChrome = themeAware
    ? "bg-background border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
    : "bg-white border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
  const textColor = themeAware ? "text-foreground" : "text-black"
  const textColorHover = themeAware ? "hover:text-foreground/65" : "hover:text-black/65"
  // Buttons: black bg in light mode, white bg in dark mode (using dark: utilities for themeAware)
  const buttonBg = themeAware ? "bg-foreground" : "bg-black"
  const buttonText = themeAware ? "text-background" : "text-white"
  const buttonHover = themeAware ? "hover:bg-foreground/90" : "hover:bg-black/90"
  const headerCtaPalette = themeAware
    ? themeAwareHeaderPrimaryCtaClasses
    : `${buttonBg} ${buttonText} ${buttonHover}`
  const hamburgerColor = themeAware ? "bg-foreground" : "bg-black"
  const headerCtaLabelClass = "transition-opacity duration-200 group-hover:opacity-90"
  const headerCtaIconClass = "flex h-3 w-3 items-center justify-center text-[0.95em] font-medium leading-none transition-opacity duration-200 group-hover:opacity-85 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
  const mobileHeaderControlSize = "h-7 sm:h-8.5"
  const mobileMenuButtonSize = "h-8 w-8 sm:h-9 sm:w-9"
  const alphaBadgeClass = themeAware
    ? "border border-black/10 bg-black/[0.04] text-black/65 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/70"
    : "border border-black/10 bg-black/[0.04] text-black/65"
  return (
    <>
      {isBannerVisible && (
        <div
          className={`fixed inset-x-0 top-0 z-50 flex flex-col pt-[env(safe-area-inset-top,0px)] text-[11px] shadow-sm ring-1 ring-black/5 lg:text-xs dark:ring-white/5 ${
            themeAware ? "bg-background text-foreground" : "bg-white text-black"
          }`}
        >
          <div className="flex h-8 w-full shrink-0 items-center justify-center px-4 lg:h-9">
            <div className="flex w-full max-w-7xl items-center justify-between px-2">
              <div className="w-5" aria-hidden="true" />
              <Link
                href="/blog/introducing-tiles-public-alpha"
                className="inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground/90"
              >
                <span>Introducing Tiles Public Alpha</span>
                <span aria-hidden="true" className="text-[12px] leading-none">
                  →
                </span>
              </Link>
              <button
                type="button"
                onClick={onDismissBanner}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-foreground/50 transition-colors hover:text-foreground/80"
                aria-label="Dismiss banner"
              >
                <span aria-hidden="true" className="text-[12px] leading-none">
                  ×
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        className={`site-header-chrome sticky top-0 z-40 flex w-full max-w-none items-center justify-between pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-3 sm:pl-[max(1rem,env(safe-area-inset-left,0px))] sm:pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pb-3.5 lg:pl-[max(1.5rem,env(safe-area-inset-left,0px))] lg:pr-[max(1.5rem,env(safe-area-inset-right,0px))] lg:pb-5 ${
          isBannerVisible
            ? "top-[calc(2rem+env(safe-area-inset-top,0px))] lg:top-[calc(2.25rem+env(safe-area-inset-top,0px))]"
            : "top-0"
        } ${
          isBannerVisible
            ? "pt-4 sm:pt-5 lg:pt-7"
            : "pt-[calc(0.875rem+env(safe-area-inset-top,0px))] sm:pt-[calc(1rem+env(safe-area-inset-top,0px))] lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]"
        } ${headerChrome} relative`}
      >
        {/* Left side: Logo and Wordmark */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            onClick={onHomeClick}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-75 sm:gap-3"
          >
            {themeAware ? (
              <>
                {/* Light mode logo */}
                <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 dark:hidden" />
                {/* Dark mode logo */}
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 hidden dark:block" />
              </>
            ) : (
              <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11" />
            )}
            <span
              className={`notranslate text-lg font-semibold leading-none tracking-[-0.02em] sm:text-xl lg:text-[1.6rem] ${textColor}`}
              translate="no"
              lang="en"
            >
              Tiles
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.58rem] font-medium uppercase tracking-[0.14em] sm:text-[0.62rem] ${alphaBadgeClass}`}
            >
              Alpha
            </span>
          </Link>
        </div>

        {/* Centered Desktop Navigation Links */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex">
          <Link href="/about" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            About
          </Link>
          <Link href="/changelog" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Changelog
          </Link>
          <Link href="/blog" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Blog
          </Link>
          <Link href="/pricing" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Pricing
          </Link>
          <Link href="/book" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Book
          </Link>
        </nav>

        {/* Right side: Download CTA and mobile menu */}
        <div className="flex items-center gap-1 whitespace-nowrap sm:gap-1.5 lg:gap-2 shrink-0">
          <Button
            asChild
            variant="ghost"
            className={`${mobileHeaderControlSize} rounded-sm ${headerCtaPalette} px-2.5 text-xs font-medium sm:px-3.5 sm:text-sm lg:h-9 lg:px-4 lg:text-sm`}
          >
            <Link
              href="/download"
              className="group flex items-center gap-1 sm:gap-1.5 lg:gap-2"
              onClick={onDownloadClick}
            >
              <span className={headerCtaLabelClass}>
                Download
              </span>
              <Download className={headerCtaIconClass} aria-hidden />
            </Link>
          </Button>
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={onOpenMenu}
            className={`lg:hidden inline-flex ${mobileMenuButtonSize} shrink-0 touch-manipulation items-center justify-center border-0 bg-transparent p-0 transition-opacity duration-200 hover:opacity-75 focus-visible:ring-0 active:opacity-60`}
            aria-label="Open navigation menu"
            type="button"
          >
            <span className="flex flex-col items-center justify-center gap-1.5">
              <span className={`block h-px w-5 rounded-full ${hamburgerColor} transition-all duration-300`} />
              <span className={`block h-px w-5 rounded-full ${hamburgerColor} transition-all duration-300`} />
              <span className={`block h-px w-5 rounded-full ${hamburgerColor} transition-all duration-300`} />
            </span>
          </button>
        </div>
      </header>
    </>
  )
})

function SiteHeaderContent({ themeAware = true }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    if (typeof window === "undefined" || !BANNER_ENABLED) return
    const dismissed = window.localStorage.getItem("tilesBannerDismissed")
    setIsBannerVisible(dismissed !== "true")
  }, [])

  const handleDismissBanner = useCallback(() => {
    setIsBannerVisible(false)
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tilesBannerDismissed", "true")
    }
  }, [])

  const openMenu = useCallback(() => setIsMenuOpen(true), [])
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const handleDownloadClick = useCallback(() => {
    triggerHaptic()
  }, [])
  const handleHomeClick = useCallback(
    (event: { preventDefault: () => void }) => {
      triggerHaptic()
      if (pathname !== "/") {
        return
      }

      event.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [pathname],
  )

  return (
    <>
      <SiteHeaderChrome
        themeAware={themeAware}
        isBannerVisible={isBannerVisible}
        onDismissBanner={handleDismissBanner}
        onOpenMenu={openMenu}
        onDownloadClick={handleDownloadClick}
        onHomeClick={handleHomeClick}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        themeAware={themeAware}
        hasBanner={isBannerVisible}
      />
    </>
  )
}

export function SiteHeader(props: SiteHeaderProps) {
  return <SiteHeaderContent {...props} />
}
