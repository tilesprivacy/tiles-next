'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { MobileMenu } from "./mobile-menu"

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-6 bg-white">
        {/* Left side: Logo and Desktop Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="transition-colors hover:opacity-70">
            <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/book" className="text-base font-medium text-black transition-colors hover:text-black/70">
              Book
            </Link>
            <Link href="/blog" className="text-base font-medium text-black transition-colors hover:text-black/70">
              Blog
            </Link>
            <Link href="/manifesto" className="text-base font-medium text-black transition-colors hover:text-black/70">
              Manifesto
            </Link>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-black transition-colors hover:text-black/70"
            >
              Github
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-black transition-colors hover:text-black/70"
            >
              Discord
            </a>
          </nav>
        </div>

        {/* Right side: Buttons and Hamburger */}
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          {/* Buttons - visible on all screen sizes */}
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              <Image
                src="/apple-logo-white.svg"
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
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
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
                className="h-3.5 w-3.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-white/70 group-active:scale-110 lg:h-4 lg:w-4"
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
            <span className="block w-5 h-0.5 bg-black transition-all duration-300" />
            <span className="block w-5 h-0.5 bg-black transition-all duration-300 my-1" />
            <span className="block w-5 h-0.5 bg-black transition-all duration-300" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
