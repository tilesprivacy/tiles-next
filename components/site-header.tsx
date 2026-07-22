'use client'

import Link from "next/link"
import Image from "next/image"
import { memo, useCallback, useEffect, useState } from "react"
import { triggerHaptic } from "@/lib/haptics"
import { usePathname } from "next/navigation"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"
import { Download } from "lucide-react"
import { MinimalTopbar } from "@/components/minimal-topbar"

/** Set to true to show the top banner (e.g. for announcements). */
const BANNER_ENABLED = false

interface SiteHeaderProps {
  themeAware?: boolean
}

const SiteHeaderChrome = memo(function SiteHeaderChrome({
  themeAware,
  isBannerVisible,
  isMobileMenuOpen,
  onDismissBanner,
  onHomeClick,
  onOpenMobileMenu,
  onCloseMobileMenu,
  pathname,
  showMobileDownloadCta,
}: {
  themeAware: boolean
  isBannerVisible: boolean
  isMobileMenuOpen: boolean
  onDismissBanner: () => void
  onHomeClick: (event: { preventDefault: () => void }) => void
  onOpenMobileMenu: () => void
  onCloseMobileMenu: () => void
  pathname: string
  showMobileDownloadCta: boolean
}) {
  const isHomePage = pathname === "/"
  const isMinimalPage = isHomePage || pathname === "/download" || pathname === "/sponsor"
  const headerChrome = themeAware
    ? "bg-background text-foreground border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
    : "bg-white text-black border-0 border-transparent shadow-none ring-0 outline-none backdrop-blur-none supports-[backdrop-filter]:backdrop-blur-none"
  const textColor = themeAware ? "text-foreground" : "text-black"
  const desktopLinkTone = themeAware
    ? "text-foreground/68"
    : "text-black/68"
  const textColorHover = themeAware
    ? "hover:text-foreground"
    : "hover:text-black"
  const activeLinkClass = themeAware
    ? "!text-foreground"
    : "!text-black"
  const navItemHeightClass = "h-8"
  const navTextMetricsClass = "text-[0.94rem] font-normal leading-5 tracking-[-0.006em]"
  const baseLinkClass = `inline-flex ${navItemHeightClass} shrink-0 items-center px-0.5 ${navTextMetricsClass} ${desktopLinkTone} transition-colors duration-200 ${textColorHover}`
  const mobileMenuTopOffsetClass = isBannerVisible
    ? "top-[calc(2rem+env(safe-area-inset-top,0px))] lg:top-[calc(2.25rem+env(safe-area-inset-top,0px))]"
    : "top-0"
  const mobileLogoClass = "h-10 w-10"
  const mobileIconButtonClass = `inline-flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center border-0 bg-transparent p-0 transition-opacity duration-200 hover:opacity-75 focus-visible:ring-0 active:opacity-60 ${textColor}`
  const mobileMenuGlyphColorClass = themeAware ? "bg-foreground" : "bg-black"
  const mobileMenuLinkClass = `inline-flex min-h-11 items-center text-[1.7rem] font-normal leading-[1.2] tracking-[-0.015em] ${textColor} transition-colors ${textColorHover}`
  const brandLinkClass = "flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-75"
  const mobileInlinePaddingClass =
    "px-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-[max(1.25rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.25rem,env(safe-area-inset-right,0px))]"

  const isRouteActive = (href: string) => {
    if (href === "/book") return pathname === "/book" || pathname.startsWith("/book/")
    if (href === "/plugins") return pathname === "/plugins" || pathname.startsWith("/plugins/")
    if (href === "/releases") return pathname === "/releases" || pathname.startsWith("/releases/")
    if (href === "/blog") return pathname === "/blog" || pathname.startsWith("/blog/")
    if (href === "/sponsor") return pathname === "/sponsor" || pathname.startsWith("/sponsor/")
    if (href === "/support") return pathname === "/support" || pathname.startsWith("/support/")
    if (href === "/download") return pathname === "/download" || pathname.startsWith("/download/")
    return pathname === href
  }

  if (isMinimalPage) return null

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
        data-tiles-site-header
        className={`site-header-chrome !fixed !inset-x-0 !top-0 !z-50 w-full max-w-none border-0 border-transparent shadow-none ring-0 outline-none ${
          isBannerVisible
            ? "mt-[calc(2rem+env(safe-area-inset-top,0px))] lg:mt-[calc(2.25rem+env(safe-area-inset-top,0px))]"
            : ""
        } ${headerChrome}`}
      >
        <div className="w-full">
          <div className={`relative flex min-h-[3.35rem] items-center pb-1.5 pt-[calc(0.45rem+env(safe-area-inset-top,0px))] sm:pb-1.5 sm:pt-[calc(0.5rem+env(safe-area-inset-top,0px))] lg:min-h-0 lg:gap-8 lg:px-[max(2rem,env(safe-area-inset-left,0px))] lg:py-[max(1.1rem,env(safe-area-inset-top,0px))] lg:pr-[max(2rem,env(safe-area-inset-right,0px))] xl:px-[max(2.6rem,env(safe-area-inset-left,0px))] xl:pr-[max(2.6rem,env(safe-area-inset-right,0px))] ${mobileInlinePaddingClass}`}>
            <Link
              href="/"
              onClick={onHomeClick}
              className={brandLinkClass}
              aria-label="Tiles"
            >
              <span className="relative inline-flex shrink-0">
                {isHomePage ? (
                  themeAware ? (
                    <>
                      <Image src="/lighticon.png" alt="" width={56} height={56} className={`${mobileLogoClass} dark:hidden lg:h-9 lg:w-9`} aria-hidden />
                      <Image src="/grey.png" alt="" width={56} height={56} className={`hidden ${mobileLogoClass} dark:block lg:h-9 lg:w-9`} aria-hidden />
                    </>
                  ) : (
                    <Image src="/grey.png" alt="" width={56} height={56} className={`${mobileLogoClass} lg:h-9 lg:w-9`} aria-hidden />
                  )
                ) : themeAware ? (
                  <>
                    <Image src="/lighticon.png" alt="" width={56} height={56} className={`${mobileLogoClass} dark:hidden lg:h-9 lg:w-9`} aria-hidden />
                    <Image src="/grey.png" alt="" width={56} height={56} className={`hidden ${mobileLogoClass} dark:block lg:h-9 lg:w-9`} aria-hidden />
                  </>
                ) : (
                  <Image src="/grey.png" alt="" width={56} height={56} className={`${mobileLogoClass} lg:h-9 lg:w-9`} aria-hidden />
                )}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="hidden items-center text-xl font-semibold leading-none tracking-[-0.02em] text-foreground lg:inline-flex lg:text-lg">
                  Tiles
                </span>
                <span className="inline-flex self-center translate-y-px rounded-[0.28rem] bg-foreground/10 px-1.5 py-0.5 text-[0.68rem] font-medium leading-none tracking-[-0.01em] text-foreground/75">
                  alpha
                </span>
              </span>
            </Link>

            <div data-mobile-header-actions className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:hidden">
              {showMobileDownloadCta ? (
                <Link
                  href="/download"
                  onClick={() => {
                    triggerHaptic()
                  }}
                  data-mobile-download-cta
                  className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-sm px-3 text-xs font-medium ${themeAwareHeaderPrimaryCtaClasses}`}
                >
                  Download
                  <Download className="download-cta-icon h-3.5 w-3.5 shrink-0" aria-hidden />
                </Link>
              ) : null}
              <button
                onClick={onOpenMobileMenu}
                data-mobile-menu-trigger
                className={mobileIconButtonClass}
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
            </div>

            <nav className="hidden min-w-max items-center gap-8 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2 xl:gap-10">
              <Link href="/book" className={`${baseLinkClass} ${isRouteActive("/book") ? activeLinkClass : ""}`}>Book</Link>
              <Link href="/plugins" className={`${baseLinkClass} ${isRouteActive("/plugins") ? activeLinkClass : ""}`}>Plugins</Link>
              <Link href="/blog" className={`${baseLinkClass} ${isRouteActive("/blog") ? activeLinkClass : ""}`}>Blog</Link>
              <Link href="/releases" className={`${baseLinkClass} ${isRouteActive("/releases") ? activeLinkClass : ""}`}>Releases</Link>
              <Link href="/support" className={`${baseLinkClass} ${isRouteActive("/support") ? activeLinkClass : ""}`}>Support</Link>
              <Link href="/sponsor" className={`${baseLinkClass} ${isRouteActive("/sponsor") ? activeLinkClass : ""}`}>Sponsor</Link>
            </nav>

            <div className="ml-auto hidden items-center lg:flex">
              <Link
                href="/download"
                onClick={() => {
                  triggerHaptic()
                }}
                className={`inline-flex h-9 items-center justify-center gap-2 rounded-full px-[1.15rem] text-[0.88rem] font-medium ${themeAwareHeaderPrimaryCtaClasses}`}
              >
                Download
                <Download className="download-cta-icon h-3.5 w-3.5 shrink-0" aria-hidden />
              </Link>
            </div>
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
            className={brandLinkClass}
            aria-label="Tiles"
          >
            <span className="relative inline-flex shrink-0">
              {themeAware ? (
                <>
                  <Image src="/lighticon.png" alt="" width={56} height={56} className={`${mobileLogoClass} dark:hidden`} aria-hidden />
                  <Image src="/grey.png" alt="" width={56} height={56} className={`hidden ${mobileLogoClass} dark:block`} aria-hidden />
                </>
              ) : (
                <Image src="/grey.png" alt="" width={56} height={56} className={mobileLogoClass} aria-hidden />
              )}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="hidden items-center text-xl font-semibold leading-none tracking-[-0.02em] text-foreground lg:inline-flex">
                Tiles
              </span>
              <span className="inline-flex self-center translate-y-px rounded-[0.28rem] bg-foreground/10 px-1.5 py-0.5 text-[0.68rem] font-medium leading-none tracking-[-0.01em] text-foreground/75">
                alpha
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {showMobileDownloadCta ? (
              <Link
                href="/download"
                onClick={() => {
                  triggerHaptic()
                  onCloseMobileMenu()
                }}
                data-mobile-menu-download-cta
                className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-sm px-3 text-xs font-medium ${themeAwareHeaderPrimaryCtaClasses}`}
              >
                Download
                <Download className="download-cta-icon h-3.5 w-3.5 shrink-0" aria-hidden />
              </Link>
            ) : null}
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
        </div>
        <nav className={`flex flex-col gap-4 pb-[max(1.75rem,env(safe-area-inset-bottom,0px))] pt-4 sm:gap-5 sm:pt-5 ${mobileInlinePaddingClass}`}>
          <Link href="/book" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Book</Link>
          <Link href="/plugins" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Plugins</Link>
          <Link href="/blog" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Blog</Link>
          <Link href="/releases" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Releases</Link>
          <Link href="/support" onClick={onCloseMobileMenu} className={mobileMenuLinkClass}>Support</Link>
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
  const showMobileDownloadCta = true

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

  return (
    <>
      <SiteHeaderChrome
        themeAware={themeAware}
        isBannerVisible={isBannerVisible}
        isMobileMenuOpen={isMobileMenuOpen}
        onDismissBanner={handleDismissBanner}
        onHomeClick={handleHomeClick}
        onOpenMobileMenu={handleOpenMobileMenu}
        onCloseMobileMenu={handleCloseMobileMenu}
        pathname={pathname ?? ""}
        showMobileDownloadCta={showMobileDownloadCta}
      />
    </>
  )
}

export function SiteHeader(_: SiteHeaderProps) {
  const pathname = usePathname()
  const hasPageTopbar = pathname === "/" || pathname === "/download" || pathname === "/sponsor"

  if (hasPageTopbar) return null

  return <MinimalTopbar />
}

export default SiteHeader
