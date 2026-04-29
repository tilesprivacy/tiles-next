'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { memo, useCallback, useEffect, useState } from "react"
import { Download } from "lucide-react"
import { MobileMenu } from "./mobile-menu"
import { triggerHaptic } from "@/lib/haptics"
import {
  downloadButtonIconMotionClasses,
  downloadButtonLabelMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"
import { useMobileDownloadPrompt } from "@/components/mobile-download-prompt"
import { usePathname } from "next/navigation"

/** Set to true to show the top banner (e.g. for announcements). */
const BANNER_ENABLED = false

interface SiteHeaderProps {
  themeAware?: boolean
}

const SiteHeaderChrome = memo(function SiteHeaderChrome({
  themeAware,
  isSharePage,
  isBannerVisible,
  onDismissBanner,
  onOpenMenu,
  onDownloadClick,
  onHomeClick,
}: {
  themeAware: boolean
  isSharePage: boolean
  isBannerVisible: boolean
  onDismissBanner: () => void
  onOpenMenu: () => void
  onDownloadClick: (event: { preventDefault: () => void }) => void
  onHomeClick: (event: { preventDefault: () => void }) => void
}) {
  const headerChrome = isSharePage
    ? "bg-[#1f1f1f] border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
    : themeAware
      ? "bg-background border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
      : "bg-white border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
  const textColor = isSharePage ? "text-[#EDEDEF]" : themeAware ? "text-foreground" : "text-black"
  const textColorHover = themeAware ? "hover:text-foreground/65" : "hover:text-black/65"
  // Buttons: black bg in light mode, white bg in dark mode (using dark: utilities for themeAware)
  const buttonBg = themeAware ? "bg-foreground" : "bg-black"
  const buttonText = themeAware ? "text-background" : "text-white"
  const buttonHover = themeAware ? "hover:bg-foreground/90" : "hover:bg-black/90"
  const headerCtaPalette = themeAware
    ? themeAwareHeaderPrimaryCtaClasses
    : `${buttonBg} ${buttonText} ${buttonHover}`
  const hamburgerColor = themeAware ? "bg-foreground" : "bg-black"
  const headerCtaLabelClass = downloadButtonLabelMotionClasses
  const headerCtaIconClass = `flex h-3 w-3 items-center justify-center text-[0.95em] font-medium leading-none ${downloadButtonIconMotionClasses} sm:h-4 sm:w-4 lg:h-5 lg:w-5`
  const mobileHeaderControlSize = "h-7 sm:h-8.5"
  const mobileMenuButtonSize = "h-7 w-7 sm:h-8 sm:w-8"
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
                href="/blog"
                className="inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground/90"
              >
                <span>Read the Tiles blog</span>
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
        className={`site-header-chrome sticky top-0 z-50 flex w-full max-w-none items-center justify-between pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-2 sm:pl-[max(1rem,env(safe-area-inset-left,0px))] sm:pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pb-2.5 lg:pl-[max(1.5rem,env(safe-area-inset-left,0px))] lg:pr-[max(1.5rem,env(safe-area-inset-right,0px))] lg:pb-3 ${
          isBannerVisible
            ? "top-[calc(2rem+env(safe-area-inset-top,0px))] lg:top-[calc(2.25rem+env(safe-area-inset-top,0px))]"
            : "top-0"
        } ${
          isBannerVisible
            ? "pt-4 sm:pt-5 lg:pt-7"
            : "pt-[calc(0.875rem+env(safe-area-inset-top,0px))] sm:pt-[calc(1rem+env(safe-area-inset-top,0px))] lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]"
        } ${headerChrome} relative`}
      >
        {/* Left side: Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            onClick={onHomeClick}
            className="flex items-center gap-2 transition-opacity hover:opacity-75 sm:gap-2.5"
          >
            {isSharePage ? (
              <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11" />
            ) : themeAware ? (
              <>
                {/* Light mode logo */}
                <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 dark:hidden" />
                {/* Dark mode logo */}
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 hidden dark:block" />
              </>
            ) : (
              <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11" />
            )}
            {isSharePage ? (
              <span className={`text-base font-semibold tracking-[-0.02em] sm:text-lg ${textColor}`}>
                Tiles
              </span>
            ) : null}
          </Link>
        </div>

        {/* Centered Desktop Navigation Links */}
        <nav
          className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex ${
            isSharePage ? "lg:hidden" : ""
          }`}
        >
          <Link href="/book" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Book
          </Link>
          <Link href="/roadmap" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Roadmap
          </Link>
          <Link href="/changelog" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Changelog
          </Link>
          <Link href="/blog" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Blog
          </Link>
          <Link href="/sponsor" className={`text-sm font-medium tracking-[0.01em] ${textColor} transition-colors ${textColorHover}`}>
            Sponsor
          </Link>
        </nav>

        {/* Right side: Download CTA and mobile menu */}
        <div className="flex items-center gap-1 whitespace-nowrap sm:gap-1 lg:gap-2 shrink-0">
          <Button
            asChild
            variant="ghost"
            className={`${mobileHeaderControlSize} rounded-sm ${headerCtaPalette} ${downloadButtonMotionClasses} px-2.5 text-xs font-medium sm:px-3.5 sm:text-sm lg:h-9 lg:px-4 lg:text-sm`}
          >
            <Link
              href="/download"
              className="group flex items-center gap-1 sm:gap-1 lg:gap-2"
              onClick={onDownloadClick}
            >
              <span className={headerCtaLabelClass}>
                Download
              </span>
              <Download className={headerCtaIconClass} aria-hidden />
            </Link>
          </Button>
          {/* Hamburger Menu Button - Mobile Only */}
          {isSharePage ? null : (
            <button
              onClick={onOpenMenu}
              className={`lg:hidden inline-flex ${mobileMenuButtonSize} shrink-0 touch-manipulation items-center justify-center border-0 bg-transparent p-0 transition-opacity duration-200 hover:opacity-75 focus-visible:ring-0 active:opacity-60`}
              aria-label="Open navigation menu"
              type="button"
            >
              <span className="flex flex-col items-center justify-center gap-1">
                <span className={`block h-px w-4 rounded-full ${hamburgerColor} transition-all duration-300`} />
                <span className={`block h-px w-4 rounded-full ${hamburgerColor} transition-all duration-300`} />
                <span className={`block h-px w-4 rounded-full ${hamburgerColor} transition-all duration-300`} />
              </span>
            </button>
          )}
        </div>
      </header>
    </>
  )
})

function SiteHeaderContent({ themeAware = true }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(false)
  const { openMobileDownloadPrompt, mobileDownloadPrompt } = useMobileDownloadPrompt()
  const pathname = usePathname()
  const isSharePage = pathname?.startsWith("/share") ?? false

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
  const handleDownloadClick = useCallback(
    (event: { preventDefault: () => void }) => {
      if (openMobileDownloadPrompt(event)) {
        return
      }
      triggerHaptic()
    },
    [openMobileDownloadPrompt],
  )
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

  if (isSharePage) {
    return null
  }

  return (
    <>
      <SiteHeaderChrome
        themeAware={themeAware}
        isSharePage={isSharePage}
        isBannerVisible={isBannerVisible}
        onDismissBanner={handleDismissBanner}
        onOpenMenu={openMenu}
        onDownloadClick={handleDownloadClick}
        onHomeClick={handleHomeClick}
      />

      {/* Mobile Menu */}
      {isSharePage ? null : (
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={closeMenu}
          themeAware={themeAware}
          hasBanner={isBannerVisible}
        />
      )}
      {mobileDownloadPrompt}
    </>
  )
}

export function SiteHeader(props: SiteHeaderProps) {
  return <SiteHeaderContent {...props} />
}

export default SiteHeader
