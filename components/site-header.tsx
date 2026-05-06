'use client'

import Link from "next/link"
import Image from "next/image"
import { memo, useCallback, useEffect, useState } from "react"
import { triggerHaptic } from "@/lib/haptics"
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
  isMobileMenuOpen,
  onDismissBanner,
  onHomeClick,
  onOpenMobileMenu,
  onCloseMobileMenu,
  pathname,
}: {
  themeAware: boolean
  isSharePage: boolean
  isBannerVisible: boolean
  isMobileMenuOpen: boolean
  onDismissBanner: () => void
  onHomeClick: (event: { preventDefault: () => void }) => void
  onOpenMobileMenu: () => void
  onCloseMobileMenu: () => void
  pathname: string
}) {
  const headerChrome = isSharePage
    ? "bg-[#1f1f1f] border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
    : themeAware
      ? "bg-background text-foreground border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
      : "bg-white text-black border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
  const textColor = isSharePage ? "text-[#EDEDEF]" : themeAware ? "text-foreground" : "text-black"
  const textColorHover = isSharePage
    ? "hover:text-[#EDEDEF]/70"
    : themeAware
      ? "hover:text-foreground/70"
      : "hover:text-black/70"
  const activeLinkClass = isSharePage
    ? "text-[#64B5F6]"
    : themeAware
      ? "text-[#64B5F6]"
      : "text-[#64B5F6]"
  const navItemHeightClass = "h-8"
  const navTextMetricsClass = "text-[0.92rem] font-medium leading-5 tracking-normal"
  const wordmarkTextMetricsClass = "text-[1.04rem] font-medium leading-5 tracking-[-0.005em]"
  const mobileProminentWordmarkClass =
    "text-[1.22rem] font-semibold leading-6 tracking-[-0.012em] lg:text-[1.04rem] lg:font-medium lg:leading-5 lg:tracking-[-0.005em]"
  const baseLinkClass = `inline-flex ${navItemHeightClass} shrink-0 items-center px-1 ${navTextMetricsClass} transition-colors ${textColor} ${textColorHover}`
  const mobileMenuTopOffsetClass = isBannerVisible
    ? "top-[calc(2rem+env(safe-area-inset-top,0px))] lg:top-[calc(2.25rem+env(safe-area-inset-top,0px))]"
    : "top-0"
  const mobileLogoClass = "h-10 w-10"
  const mobileIconButtonClass = `inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border-0 bg-transparent p-0 transition-opacity duration-200 hover:opacity-75 focus-visible:ring-0 active:opacity-60 ${textColor}`
  const mobileMenuGlyphColorClass = isSharePage ? "bg-[#EDEDEF]" : themeAware ? "bg-foreground" : "bg-black"
  const mobileMenuLinkClass = `inline-flex min-h-11 items-center text-[1.7rem] font-normal leading-[1.2] tracking-[-0.015em] ${textColor} transition-colors ${textColorHover}`
  const mobileInlinePaddingClass =
    "px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-[max(1.25rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.25rem,env(safe-area-inset-right,0px))]"

  const isRouteActive = (href: string) => {
    if (href === "/book") return pathname === "/book" || pathname.startsWith("/book/")
    if (href === "/roadmap") return pathname === "/roadmap" || pathname.startsWith("/roadmap/")
    if (href === "/changelog") return pathname === "/changelog" || pathname.startsWith("/changelog/")
    if (href === "/blog") return pathname === "/blog" || pathname.startsWith("/blog/")
    if (href === "/sponsor") return pathname === "/sponsor" || pathname.startsWith("/sponsor/")
    if (href === "/download") return pathname === "/download" || pathname.startsWith("/download/")
    return pathname === href
  }

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
        className={`site-header-chrome fixed inset-x-0 top-0 z-50 w-full max-w-none border-0 border-transparent shadow-none ring-0 outline-none ${
          isBannerVisible
            ? "mt-[calc(2rem+env(safe-area-inset-top,0px))] lg:mt-[calc(2.25rem+env(safe-area-inset-top,0px))]"
            : ""
        } ${headerChrome}`}
      >
        <div className="w-full">
          <div className={`flex min-h-[3.35rem] items-center pb-1.5 pt-[calc(0.45rem+env(safe-area-inset-top,0px))] sm:pb-1.5 sm:pt-[calc(0.5rem+env(safe-area-inset-top,0px))] lg:min-h-0 lg:gap-7 lg:px-[max(1.3rem,env(safe-area-inset-left,0px))] lg:py-[max(0.75rem,env(safe-area-inset-top,0px))] lg:pr-[max(1.3rem,env(safe-area-inset-right,0px))] ${mobileInlinePaddingClass}`}>
            <Link
              href="/"
              onClick={onHomeClick}
              className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-75 sm:gap-2.5"
            >
              {isSharePage ? (
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
              ) : themeAware ? (
                <>
                  <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className={`${mobileLogoClass} dark:hidden lg:h-9 lg:w-9`} />
                  <Image src="/grey.png" alt="Tiles" width={56} height={56} className={`hidden ${mobileLogoClass} dark:block lg:h-9 lg:w-9`} />
                </>
              ) : (
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className={`${mobileLogoClass} lg:h-9 lg:w-9`} />
              )}
              <span className={`inline-flex ${navItemHeightClass} shrink-0 items-center px-1 ${mobileProminentWordmarkClass} ${textColor}`}>
                Tiles
              </span>
            </Link>

            <button
              onClick={onOpenMobileMenu}
              className={`ml-auto ${mobileIconButtonClass} lg:hidden`}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              <span className="flex flex-col items-center justify-center gap-1.5" aria-hidden>
                <span className={`block h-[2px] w-6 rounded-full ${mobileMenuGlyphColorClass}`} />
                <span className={`block h-[2px] w-6 rounded-full ${mobileMenuGlyphColorClass}`} />
                <span className={`block h-[2px] w-6 rounded-full ${mobileMenuGlyphColorClass}`} />
              </span>
            </button>

            <nav className="hidden min-w-max items-center gap-5 sm:gap-6 lg:flex lg:gap-7">
              <Link href="/download" onClick={triggerHaptic} className={`${baseLinkClass} ${isRouteActive("/download") ? activeLinkClass : ""}`}>Download</Link>
              <Link href="/book" className={`${baseLinkClass} ${isRouteActive("/book") ? activeLinkClass : ""}`}>Book</Link>
              <Link href="/blog" className={`${baseLinkClass} ${isRouteActive("/blog") ? activeLinkClass : ""}`}>Blog</Link>
              <Link href="/roadmap" className={`${baseLinkClass} ${isRouteActive("/roadmap") ? activeLinkClass : ""}`}>Roadmap</Link>
              <Link href="/changelog" className={`${baseLinkClass} ${isRouteActive("/changelog") ? activeLinkClass : ""}`}>Changelog</Link>
              <Link href="/sponsor" className={`${baseLinkClass} ${isRouteActive("/sponsor") ? activeLinkClass : ""}`}>Sponsor</Link>
            </nav>
          </div>
        </div>
      </header>
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] overflow-y-auto lg:hidden ${mobileMenuTopOffsetClass} ${
          isMobileMenuOpen ? "block" : "hidden"
        } ${headerChrome}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className={`flex min-h-[3.35rem] items-center justify-between pb-1.5 pt-[calc(0.45rem+env(safe-area-inset-top,0px))] sm:pb-1.5 sm:pt-[calc(0.5rem+env(safe-area-inset-top,0px))] ${mobileInlinePaddingClass}`}>
          <Link
            href="/"
            onClick={onCloseMobileMenu}
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-75"
          >
            {themeAware ? (
              <>
                <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className={`${mobileLogoClass} dark:hidden`} />
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className={`hidden ${mobileLogoClass} dark:block`} />
              </>
            ) : (
              <Image src="/grey.png" alt="Tiles" width={56} height={56} className={mobileLogoClass} />
            )}
            <span className={`inline-flex ${navItemHeightClass} shrink-0 items-center px-1 ${mobileProminentWordmarkClass} ${textColor}`}>
              Tiles
            </span>
          </Link>
          <button
            onClick={onCloseMobileMenu}
            className={mobileIconButtonClass}
            aria-label="Close navigation menu"
            type="button"
          >
            <span className="relative block h-6 w-6" aria-hidden>
              <span className={`absolute left-1/2 top-1/2 block h-[2px] w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full ${mobileMenuGlyphColorClass}`} />
              <span className={`absolute left-1/2 top-1/2 block h-[2px] w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full ${mobileMenuGlyphColorClass}`} />
            </span>
          </button>
        </div>
        <nav className={`flex flex-col gap-4 pb-[max(1.75rem,env(safe-area-inset-bottom,0px))] pt-4 sm:gap-5 sm:pt-5 ${mobileInlinePaddingClass}`}>
          <Link href="/download" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Download</Link>
          <Link href="/book" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Book</Link>
          <Link href="/blog" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Blog</Link>
          <Link href="/roadmap" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Roadmap</Link>
          <Link href="/changelog" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Changelog</Link>
          <Link href="/sponsor" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Sponsor</Link>
        </nav>
      </div>
    </>
  )
})

function SiteHeaderContent({ themeAware = true }: SiteHeaderProps) {
  const [isBannerVisible, setIsBannerVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  const handleOpenMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true)
  }, [])

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (typeof window === "undefined") return

    const body = document.body
    const html = document.documentElement

    if (!isMobileMenuOpen) return

    const scrollY = window.scrollY || window.pageYOffset
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
      htmlScrollBehavior: html.style.scrollBehavior,
    }

    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"

    return () => {
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      body.style.position = prev.bodyPosition
      body.style.top = prev.bodyTop
      body.style.left = prev.bodyLeft
      body.style.right = prev.bodyRight
      body.style.width = prev.bodyWidth
      html.style.scrollBehavior = "auto"
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" })
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prev.htmlScrollBehavior
      })
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  if (isSharePage) {
    return null
  }

  return (
    <>
      <SiteHeaderChrome
        themeAware={themeAware}
        isSharePage={isSharePage}
        isBannerVisible={isBannerVisible}
        isMobileMenuOpen={isMobileMenuOpen}
        onDismissBanner={handleDismissBanner}
        onHomeClick={handleHomeClick}
        onOpenMobileMenu={handleOpenMobileMenu}
        onCloseMobileMenu={handleCloseMobileMenu}
        pathname={pathname ?? ""}
      />
    </>
  )
}

export function SiteHeader(props: SiteHeaderProps) {
  return <SiteHeaderContent {...props} />
}

export default SiteHeader
