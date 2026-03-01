'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { memo, useCallback, useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa6"
import { MobileMenu } from "./mobile-menu"
import { triggerHapticFeedback } from "@/lib/haptic"

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
}: {
  themeAware: boolean
  isBannerVisible: boolean
  onDismissBanner: () => void
  onOpenMenu: () => void
}) {
  // Theme-aware class names - use Tailwind dark: utilities for CSS-based switching
  const headerBg = themeAware ? "bg-background" : "bg-white"
  const textColor = themeAware ? "text-foreground" : "text-black"
  const textColorHover = themeAware ? "hover:text-foreground/70" : "hover:text-black/70"
  // Buttons: black bg in light mode, white bg in dark mode (using dark: utilities for themeAware)
  const buttonBg = themeAware ? "bg-black dark:bg-white" : "bg-black"
  const buttonText = themeAware ? "text-white dark:text-black" : "text-white"
  const buttonHover = themeAware ? "hover:bg-black/90 dark:hover:bg-white/90" : "hover:bg-black/90"
  const hamburgerColor = themeAware ? "bg-foreground" : "bg-black"
  const sourceButtonClasses = themeAware
    ? "bg-black/5 text-black hover:bg-black/10 dark:bg-white/10 dark:text-[#E6E6E6] dark:hover:bg-white/20"
    : "bg-black/5 text-black hover:bg-black/10"

  return (
    <>
      {isBannerVisible && (
        <div
          className={`fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-center px-4 text-[11px] shadow-sm ring-1 ring-black/5 lg:h-9 lg:text-xs dark:ring-white/5 ${
            themeAware ? "bg-background text-foreground" : "bg-white text-black"
          }`}
        >
          <div className="flex w-full max-w-7xl items-center justify-between px-2">
            <div className="w-5" aria-hidden="true" />
            <Link
              href="/blog/introducing-tiles-public-alpha"
              className="inline-flex items-center gap-2 text-black/70 dark:text-[#B3B3B3] transition-colors hover:text-black/90 dark:hover:text-[#E6E6E6]"
            >
              <span>Introducing Tiles Public Alpha</span>
              <span aria-hidden="true" className="text-[12px] leading-none">
                →
              </span>
            </Link>
            <button
              type="button"
              onClick={onDismissBanner}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-black/50 transition-colors hover:text-black/80 dark:text-[#8A8A8A] dark:hover:text-[#E6E6E6]"
              aria-label="Dismiss banner"
            >
              <span aria-hidden="true" className="text-[12px] leading-none">
                ×
              </span>
            </button>
          </div>
        </div>
      )}

      <header
        className={`fixed inset-x-0 ${isBannerVisible ? "top-8 lg:top-9" : "top-0"} z-40 flex items-center justify-between px-3 pb-2.5 pt-3 sm:px-4 sm:pb-3 sm:pt-4 lg:px-6 lg:pb-4 lg:pt-6 ${headerBg}`}
      >
        {/* Left side: Logo and Desktop Nav Links */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="transition-colors hover:opacity-70">
            {themeAware ? (
              <>
                {/* Light mode logo */}
                <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 dark:hidden" />
                {/* Dark mode logo */}
                <Image src="/grey.png" alt="Tiles" width={48} height={48} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 hidden dark:block" />
              </>
            ) : (
              <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/changelog" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Changelog
            </Link>
            <Link href="/blog" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Blog
            </Link>
            <Link href="/book" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Book
            </Link>
            <a
              href="https://github.com/tilesprivacy/tiles"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Star on GitHub"
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${sourceButtonClasses}`}
            >
              <FaGithub className="h-4 w-4 shrink-0" aria-hidden />
              <span>Star</span>
            </a>
          </nav>
        </div>

        {/* Right side: Buttons and Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap lg:gap-3 shrink-0">
          {/* Buttons */}
          <Button
            asChild
            variant="ghost"
            className={`h-7 rounded-full ${buttonBg} ${buttonText} px-2.5 text-[11px] font-medium ${buttonHover} sm:h-8 sm:px-3 sm:text-xs lg:h-10 lg:px-4 lg:text-sm`}
          >
            <Link href="/download" onClick={() => triggerHapticFeedback("medium")} className="group flex items-center gap-1.5 lg:gap-2">
              {themeAware ? (
                <>
                  {/* Light mode: white Apple logo (on black button) */}
                  <Image
                    src="/apple-logo-white.svg"
                    alt="Apple"
                    width={16}
                    height={20}
                    className="h-3 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-3.5 lg:h-4 dark:hidden"
                  />
                  {/* Dark mode: black Apple logo (on white button) */}
                  <Image
                    src="/apple-logo.svg"
                    alt="Apple"
                    width={16}
                    height={20}
                    className="h-3 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-3.5 lg:h-4 hidden dark:block"
                  />
                </>
              ) : (
                <Image
                  src="/apple-logo-white.svg"
                  alt="Apple"
                  width={16}
                  height={20}
                  className="h-3 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-3.5 lg:h-4"
                />
              )}
              <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
                Download
              </span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={`h-7 rounded-full ${buttonBg} ${buttonText} px-2 text-[11px] font-medium ${buttonHover} sm:h-8 sm:px-3 sm:text-xs lg:h-10 lg:px-4 lg:text-sm`}
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 lg:gap-2"
              onClick={() => triggerHapticFeedback("medium")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3 w-3 fill-current transition-all duration-300 will-change-transform backface-hidden group-hover:scale-110 group-active:scale-110 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="hidden min-[360px]:inline transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
                Sponsor
              </span>
            </a>
          </Button>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={onOpenMenu}
            className="lg:hidden ml-2 flex flex-col justify-center items-center w-5 h-5 touch-manipulation outline-none border-none bg-transparent p-0 shadow-none focus:outline-none focus:ring-0 active:outline-none"
            aria-label="Open navigation menu"
            type="button"
          >
            <span className={`block w-5 h-0.5 ${hamburgerColor} transition-all duration-300`} />
            <span className={`block w-5 h-0.5 ${hamburgerColor} transition-all duration-300 my-1`} />
            <span className={`block w-5 h-0.5 ${hamburgerColor} transition-all duration-300`} />
          </button>
        </div>
      </header>
    </>
  )
})

function SiteHeaderContent({ themeAware = true }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(false)

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

  return (
    <>
      <SiteHeaderChrome
        themeAware={themeAware}
        isBannerVisible={isBannerVisible}
        onDismissBanner={handleDismissBanner}
        onOpenMenu={openMenu}
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
