"use client"

import Image from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

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
            : href === "/support"
              ? pathname === "/support" || pathname.startsWith("/support/")
              : pathname === href

  const centerLinks = [
    ["/book", "Book"],
    ["/plugins", "Plugins"],
    ["/blog", "Blog"],
    ["/releases", "Releases"],
    ["/support", "Support"],
    ["/sponsor", "Sponsor"],
  ] as const

  return (
    <header className="minimal-topbar">
      <div className="minimal-topbar-left flex min-w-0 items-center gap-3 max-[520px]:gap-2">
        {hideBrand ? <span aria-hidden /> : (
          <Link href="/" className="minimal-topbar-brand" aria-label="Tiles home">
            <Image src="/lighticon.png" alt="" width={36} height={36} priority />
            <span className="minimal-topbar-wordmark">
              <span>Tiles</span>
              <span className="minimal-topbar-alpha">alpha</span>
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
      <nav className="minimal-topbar-actions" aria-label="Site actions">
        {!hideBrand ? (
          <Link
            href="/download"
            className="minimal-topbar-download inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md !bg-[#0b7df0] px-3 text-[0.8125rem] font-medium leading-none !text-white !no-underline shadow-sm transition-colors hover:!bg-[#076fd7] max-[520px]:h-[34px] max-[520px]:px-2.5 max-[520px]:text-xs"
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
            <Link href="/book/manual" onClick={() => setMenuOpen(false)}>Manual</Link>
            {centerLinks.map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
