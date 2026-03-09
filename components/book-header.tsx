'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { memo, useCallback, useState } from 'react'
import { MobileMenu } from "./mobile-menu"

const BookHeaderBar = memo(function BookHeaderBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-6 bg-background">
      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="transition-colors hover:opacity-70">
          {/* Light mode logo */}
          <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 dark:hidden" />
          {/* Dark mode logo */}
          <Image src="/grey.png" alt="Tiles" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 hidden dark:block" />
        </Link>
      </div>

      {/* Right side: Buttons and Hamburger */}
      <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
        {/* Buttons - visible on all screen sizes */}
        <Button
          asChild
          className="h-8 rounded-full bg-foreground px-3 text-xs font-medium text-background hover:bg-foreground/90 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 lg:h-10 lg:px-4 lg:text-sm"
        >
          <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
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
            <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
              Download for macOS
            </span>
          </Link>
        </Button>
        <Button
          asChild
          className="h-8 rounded-full bg-foreground px-3 text-xs font-medium text-background hover:bg-foreground/90 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 lg:h-10 lg:px-4 lg:text-sm"
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
              className="h-3.5 w-3.5 fill-background transition-all duration-300 will-change-transform backface-hidden group-hover:scale-110 group-hover:fill-background/70 group-active:scale-110 lg:h-4 lg:w-4"
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
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 touch-manipulation outline-none border-none bg-transparent shadow-none focus:outline-none focus:ring-0 active:outline-none h-8 lg:h-10"
          aria-label="Open navigation menu"
          type="button"
        >
          <span className="block w-5 h-0.5 bg-black dark:bg-white" />
          <span className="block w-5 h-0.5 bg-black dark:bg-white" />
          <span className="block w-5 h-0.5 bg-black dark:bg-white" />
        </button>
      </div>
    </header>
  )
})

export function BookHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const openMenu = useCallback(() => setIsMenuOpen(true), [])
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  return (
    <>
      <BookHeaderBar onOpenMenu={openMenu} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} themeAware />
    </>
  )
}

