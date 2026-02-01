'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { memo, useCallback, useEffect, useState } from "react"
import { MobileMenu } from "./mobile-menu"

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
        className={`fixed inset-x-0 ${isBannerVisible ? "top-8 lg:top-9" : "top-0"} z-40 flex items-center justify-between px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-6 ${headerBg}`}
      >
        {/* Left side: Logo and Desktop Nav Links */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="transition-colors hover:opacity-70">
            {themeAware ? (
              <>
                {/* Light mode logo */}
                <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 dark:hidden" />
                {/* Dark mode logo */}
                <Image src="/grey.png" alt="Tiles" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 hidden dark:block" />
              </>
            ) : (
              <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12" />
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              href="https://github.com/orgs/tilesprivacy/projects/4"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-base font-medium ${textColor} transition-colors ${textColorHover} inline-flex items-center gap-1`}
            >
              Roadmap
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-3 w-3 shrink-0"
                aria-hidden
              >
                <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <Link href="/changelog" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Changelog
            </Link>
            <Link href="/blog" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Blog
            </Link>
            <Link href="/book" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Book
            </Link>
          </nav>
        </div>

        {/* Right side: Buttons and Hamburger */}
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3 shrink-0">
          {/* Buttons */}
          <Button
            asChild
            variant="ghost"
            className={`h-8 rounded-full ${buttonBg} ${buttonText} px-3 text-xs font-medium ${buttonHover} lg:h-10 lg:px-4 lg:text-sm`}
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              {themeAware ? (
                <>
                  {/* Light mode: white Apple logo (on black button) */}
                  <Image
                    src="/apple-logo-white.svg"
                    alt="Apple"
                    width={16}
                    height={20}
                    className="h-3.5 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 lg:h-4 dark:hidden"
                  />
                  {/* Dark mode: black Apple logo (on white button) */}
                  <Image
                    src="/apple-logo.svg"
                    alt="Apple"
                    width={16}
                    height={20}
                    className="h-3.5 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 lg:h-4 hidden dark:block"
                  />
                </>
              ) : (
                <Image
                  src="/apple-logo-white.svg"
                  alt="Apple"
                  width={16}
                  height={20}
                  className="h-3.5 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 lg:h-4"
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
            className={`h-8 rounded-full ${buttonBg} ${buttonText} px-3 text-xs font-medium ${buttonHover} lg:h-10 lg:px-4 lg:text-sm`}
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 lg:gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current transition-all duration-300 will-change-transform backface-hidden group-hover:scale-110 group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
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
