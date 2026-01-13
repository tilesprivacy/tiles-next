'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { MobileMenu } from "./mobile-menu"
import { HeaderSearch, SearchFocusProvider, useSearchFocus } from "./book-search"

interface SiteHeaderProps {
  themeAware?: boolean
}

function SiteHeaderContent({ themeAware = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isBookPage = pathname?.startsWith('/book')
  const { isFocused: isSearchFocused } = useSearchFocus()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only use theme detection if themeAware is true
  const currentTheme = themeAware ? (resolvedTheme || (theme === 'system' ? systemTheme : theme)) : 'light'
  const isDark = themeAware && currentTheme === 'dark'

  // Always use the dark mode logo
  const logoSrc = '/dark.jpeg'

  // Use appropriate apple logo based on theme
  const appleLogoSrc = (mounted && isDark) ? '/apple-logo.svg' : '/apple-logo-white.svg'

  // Theme-aware class names
  const headerBg = themeAware ? 'bg-background' : 'bg-white'
  const textColor = themeAware ? 'text-foreground' : 'text-black'
  const textColorHover = themeAware ? 'hover:text-foreground/70' : 'hover:text-black/70'
  const buttonBg = themeAware ? 'bg-foreground' : 'bg-black'
  const buttonText = themeAware ? 'text-background' : 'text-white'
  const buttonHover = themeAware ? 'hover:bg-foreground/90' : 'hover:bg-black/90'
  const hamburgerColor = themeAware ? 'bg-foreground' : 'bg-black'

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-6 ${headerBg}`}>
        {/* Left side: Logo and Desktop Nav Links */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="transition-colors hover:opacity-70">
            <Image src={logoSrc} alt="Tiles" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/mission" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Mission
            </Link>
            <a
              href="https://github.com/orgs/tilesprivacy/projects/4"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-base font-medium ${textColor} transition-colors ${textColorHover} inline-flex items-center gap-0.5`}
            >
              Roadmap
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-2.5 w-2.5 inline-block ml-0.5 align-baseline"
                style={{ verticalAlign: 'baseline' }}
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

        {/* Center: Search - Book pages only (mobile) */}
        {isBookPage && (
          <div className="flex-1 px-3 sm:hidden">
            <HeaderSearch />
          </div>
        )}

        {/* Right side: Buttons and Hamburger */}
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3 shrink-0">
          {/* Search - Book pages only (tablet/desktop) */}
          {isBookPage && <div className="hidden sm:block"><HeaderSearch /></div>}
          
          {/* Buttons - hidden on mobile when search is focused on book pages */}
          <Button
            asChild
            className={`h-8 rounded-full ${buttonBg} px-3 text-xs font-medium ${buttonText} ${buttonHover} lg:h-10 lg:px-4 lg:text-sm ${isBookPage && isSearchFocused ? 'hidden sm:flex' : ''}`}
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              <Image
                src={appleLogoSrc}
                alt="Apple"
                width={16}
                height={20}
                className="h-3.5 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-4"
              />
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Download</span>
            </Link>
          </Button>
          <Button
            asChild
            className={`h-8 rounded-full ${buttonBg} px-3 text-xs font-medium ${buttonText} ${buttonHover} lg:h-10 lg:px-4 lg:text-sm ${isBookPage && isSearchFocused ? 'hidden sm:flex' : ''}`}
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
                className={`h-3.5 w-3.5 ${themeAware ? 'fill-background' : 'fill-white'} transition-all duration-300 group-hover:scale-110 ${themeAware ? 'group-hover:fill-background/70' : 'group-hover:fill-white/70'} group-active:scale-110 lg:h-4 lg:w-4`}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>

          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsMenuOpen(true)}
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

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} themeAware={themeAware} />
    </>
  )
}

export function SiteHeader(props: SiteHeaderProps) {
  return (
    <SearchFocusProvider>
      <SiteHeaderContent {...props} />
    </SearchFocusProvider>
  )
}
