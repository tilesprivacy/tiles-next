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
  onDismissBanner,
  onHomeClick,
  pathname,
}: {
  themeAware: boolean
  isSharePage: boolean
  isBannerVisible: boolean
  onDismissBanner: () => void
  onHomeClick: (event: { preventDefault: () => void }) => void
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
  const baseLinkClass = `inline-flex ${navItemHeightClass} shrink-0 items-center px-1 ${navTextMetricsClass} transition-colors ${textColor} ${textColorHover}`

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
        <div className="w-full overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-5 px-[max(0.8rem,env(safe-area-inset-left,0px))] py-[max(0.65rem,env(safe-area-inset-top,0px))] pr-[max(0.8rem,env(safe-area-inset-right,0px))] sm:gap-6 sm:px-[max(1rem,env(safe-area-inset-left,0px))] sm:py-[max(0.7rem,env(safe-area-inset-top,0px))] sm:pr-[max(1rem,env(safe-area-inset-right,0px))] lg:gap-7 lg:px-[max(1.3rem,env(safe-area-inset-left,0px))] lg:py-[max(0.75rem,env(safe-area-inset-top,0px))] lg:pr-[max(1.3rem,env(safe-area-inset-right,0px))]">
            <Link
              href="/"
              onClick={onHomeClick}
              className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-75 sm:gap-2.5"
            >
              {isSharePage ? (
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
              ) : themeAware ? (
                <>
                  <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 dark:hidden" />
                  <Image src="/grey.png" alt="Tiles" width={56} height={56} className="hidden h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 dark:block" />
                </>
              ) : (
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9" />
              )}
              <span
                className={`inline-flex ${navItemHeightClass} shrink-0 -translate-y-px items-center px-1 ${wordmarkTextMetricsClass} ${textColor}`}
              >
                Tiles
              </span>
            </Link>

            <nav className="flex min-w-max items-center gap-5 sm:gap-6 lg:gap-7">
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
    </>
  )
})

function SiteHeaderContent({ themeAware = true }: SiteHeaderProps) {
  const [isBannerVisible, setIsBannerVisible] = useState(false)
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
        onHomeClick={handleHomeClick}
        pathname={pathname ?? ""}
      />
    </>
  )
}

export function SiteHeader(props: SiteHeaderProps) {
  return <SiteHeaderContent {...props} />
}

export default SiteHeader
