"use client"

import Image from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"

export function MinimalTopbar({ hideBrand = false }: { hideBrand?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === "/book"
      ? pathname === "/book" || pathname.startsWith("/book/")
      : href === "/plugins"
        ? pathname === "/plugins" || pathname.startsWith("/plugins/")
        : href === "/blog"
          ? pathname === "/blog" || pathname.startsWith("/blog/")
          : href === "/releases"
            ? pathname === "/releases" || pathname.startsWith("/releases/")
            : href === "/help"
              ? pathname === "/help" || pathname.startsWith("/help/")
              : pathname === href

  const centerLinks = [
    ["/book", "Book"],
    ["/plugins", "Plugins"],
    ["/blog", "Blog"],
    ["/releases", "Releases"],
    ["/help", "Help"],
    ["/sponsor", "Sponsor"],
  ] as const

  return (
    <header className="minimal-topbar max-[767px]:gap-1">
      <div className="minimal-topbar-left flex min-w-0 items-center gap-3 max-[520px]:gap-2">
        {hideBrand ? <span aria-hidden /> : (
          <Link href="/" className="minimal-topbar-brand" aria-label="Tiles home">
            <span className="minimal-theme-logo">
              <Image src="/lighticon.png" alt="" width={36} height={36} className="dark:hidden" priority />
              <Image src="/grey.png" alt="" width={36} height={36} className="hidden dark:block" priority />
            </span>
            <span className="minimal-topbar-wordmark">
              <span>Tiles</span>
              <span className="minimal-topbar-alpha max-[360px]:hidden">alpha</span>
            </span>
          </Link>
        )}
      </div>
      <nav className="minimal-topbar-center-nav" aria-label="Primary navigation">
        {centerLinks.map(([href, label]) => (
          <Link key={href} href={href} className={isActive(href) ? "minimal-topbar-center-link is-active" : "minimal-topbar-center-link"} aria-current={isActive(href) ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      <nav className="minimal-topbar-actions max-[767px]:gap-1.5" aria-label="Site actions">
        <div className="minimal-topbar-theme inline-flex h-9 w-9 shrink-0 items-center justify-center max-[767px]:h-8 max-[767px]:w-8">
          <ThemeSwitcher variant="auto" size="md" mode="toggle" tone="quiet" touchFriendly />
        </div>
        {!hideBrand ? (
          <Link
            href="/download"
            className={`minimal-topbar-download inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[0.8125rem] font-medium leading-none !no-underline shadow-sm transition-colors max-[520px]:h-[34px] max-[520px]:px-2.5 max-[520px]:text-xs ${themeAwareHeaderPrimaryCtaClasses}`}
          >
            <Download className="size-3.5 shrink-0" aria-hidden />
            <span>Download</span>
          </Link>
        ) : null}
        <button
          className="minimal-topbar-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="minimal-topbar-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <span className="minimal-topbar-close-glyph" aria-hidden>
              <span />
              <span />
            </span>
          ) : (
            <span className="minimal-topbar-menu-glyph" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          )}
        </button>
      </nav>
      {menuOpen ? (
        <div id="minimal-topbar-menu" className="minimal-topbar-menu">
          <nav aria-label="Mobile navigation">
            {centerLinks.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
