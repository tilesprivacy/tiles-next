'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { memo, useCallback, useEffect, useState } from "react"
import { Download } from "lucide-react"
import { MobileMenu } from "./mobile-menu"
import { triggerHaptic } from "@/lib/haptics"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"

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
  const headerChrome =
    "bg-transparent border-0 border-transparent shadow-none ring-0 outline-none"
  const textColor = themeAware ? "text-foreground" : "text-black"
  const textColorHover = themeAware ? "hover:text-foreground/70" : "hover:text-black/70"
  // Buttons: black bg in light mode, white bg in dark mode (using dark: utilities for themeAware)
  const buttonBg = themeAware ? "bg-foreground" : "bg-black"
  const buttonText = themeAware ? "text-background" : "text-white"
  const buttonHover = themeAware ? "hover:bg-foreground/90" : "hover:bg-black/90"
  const headerCtaPalette = themeAware
    ? themeAwareHeaderPrimaryCtaClasses
    : `${buttonBg} ${buttonText} ${buttonHover}`
  const hamburgerColor = themeAware ? "bg-foreground" : "bg-black"
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
        className={`site-header-chrome fixed inset-x-0 left-0 right-0 z-40 flex w-full max-w-none items-center justify-between pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-3 sm:pl-[max(1rem,env(safe-area-inset-left,0px))] sm:pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pb-3.5 lg:pl-[max(1.5rem,env(safe-area-inset-left,0px))] lg:pr-[max(1.5rem,env(safe-area-inset-right,0px))] lg:pb-5 ${
          isBannerVisible
            ? "top-[calc(2rem+env(safe-area-inset-top,0px))] lg:top-[calc(2.25rem+env(safe-area-inset-top,0px))]"
            : "top-0"
        } ${
          isBannerVisible
            ? "pt-4 sm:pt-5 lg:pt-7"
            : "pt-[calc(1rem+env(safe-area-inset-top,0px))] sm:pt-[calc(1.125rem+env(safe-area-inset-top,0px))] lg:pt-[calc(1.75rem+env(safe-area-inset-top,0px))]"
        } ${headerChrome}`}
      >
        {/* Left side: Logo and Desktop Nav Links */}
        <div className="flex items-center gap-9 lg:gap-10 shrink-0">
          <Link href="/" className="transition-colors hover:opacity-70">
            {themeAware ? (
              <>
                {/* Light mode logo */}
                <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 dark:hidden" />
                {/* Dark mode logo */}
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 hidden dark:block" />
              </>
            ) : (
              <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
            )}
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/about" className={`text-lg font-medium ${textColor} transition-colors ${textColorHover}`}>
              About
            </Link>
            <Link href="/changelog" className={`text-lg font-medium ${textColor} transition-colors ${textColorHover}`}>
              Changelog
            </Link>
            <Link href="/blog" className={`text-lg font-medium ${textColor} transition-colors ${textColorHover}`}>
              Blog
            </Link>
            <Link href="/pricing" className={`text-lg font-medium ${textColor} transition-colors ${textColorHover}`}>
              Pricing
            </Link>
            <Link href="/book" className={`text-lg font-medium ${textColor} transition-colors ${textColorHover}`}>
              Book
            </Link>
          </nav>
        </div>

        {/* Right side: Buttons and Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap lg:gap-3 shrink-0">
          {/* Buttons */}
          <Button
            asChild
            variant="ghost"
            className={`h-8 rounded-full ${headerCtaPalette} px-3 text-xs font-medium sm:h-9 sm:px-3.5 sm:text-sm lg:h-11 lg:px-5 lg:text-base`}
          >
            <Link
              href="/download"
              className="group flex items-center gap-1.5 lg:gap-2"
              onClick={() => triggerHaptic()}
            >
              <Download className="h-3.5 w-3.5 transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-4 sm:w-4 lg:h-5 lg:w-5" aria-hidden />
              <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
                Download
              </span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={`h-8 rounded-full ${headerCtaPalette} px-2.5 text-xs font-medium sm:h-9 sm:px-3.5 sm:text-sm lg:h-11 lg:px-5 lg:text-base`}
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 lg:gap-2"
              onClick={() => triggerHaptic()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-current transition-all duration-300 will-change-transform backface-hidden group-hover:scale-110 group-active:scale-110 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
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
            className="lg:hidden ml-2 flex flex-col justify-center items-center w-6 h-6 touch-manipulation outline-none border-none bg-transparent p-0 shadow-none focus:outline-none focus:ring-0 active:outline-none"
            aria-label="Open navigation menu"
            type="button"
          >
            <span className={`block w-6 h-0.5 ${hamburgerColor} transition-all duration-300`} />
            <span className={`block w-6 h-0.5 ${hamburgerColor} transition-all duration-300 my-1`} />
            <span className={`block w-6 h-0.5 ${hamburgerColor} transition-all duration-300`} />
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
