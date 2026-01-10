'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Full screen overlay - higher z-index than header */}
      <div
        className="fixed inset-0 bg-white z-[50] lg:hidden"
      >
        {/* Header section with logo and buttons */}
        <div className="fixed inset-x-0 top-0 z-[51] flex items-center justify-between px-4 pb-3 pt-4 bg-white">
          {/* Logo */}
          <Link href="/" onClick={onClose} className="transition-colors hover:opacity-70">
            <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-10 w-10" />
          </Link>

          {/* Right side: Buttons and Close button */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            {/* Download Button */}
            <Button
              asChild
              className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90"
            >
              <Link href="/download" onClick={onClose} className="group flex items-center gap-1.5">
                <Image
                  src="/apple-logo-white.svg"
                  alt="Apple"
                  width={16}
                  height={20}
                  className="h-3.5 w-auto transition-transform duration-300 group-hover:scale-110"
                />
                <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Download</span>
              </Link>
            </Button>

            {/* Sponsor Button */}
            <Button
              asChild
              className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90"
            >
              <a
                href="https://github.com/sponsors/tilesprivacy"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-white/70 group-active:scale-110"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
              </a>
            </Button>

            {/* Close Button - Animated Hamburger */}
            <button
              onClick={onClose}
              className="ml-2 flex flex-col justify-center items-center w-5 h-5 touch-manipulation outline-none border-none bg-transparent p-0 shadow-none focus:outline-none focus:ring-0 active:outline-none relative"
              aria-label="Close navigation menu"
              type="button"
            >
              <span className="block w-5 h-0.5 bg-black absolute top-1/2 left-0 transition-all duration-300 rotate-45" />
              <span className="block w-5 h-0.5 bg-black absolute top-1/2 left-0 transition-all duration-300 opacity-0" />
              <span className="block w-5 h-0.5 bg-black absolute top-1/2 left-0 transition-all duration-300 -rotate-45" />
            </button>
          </div>
        </div>

        {/* Navigation Links - positioned below header */}
        <nav className="flex flex-col pt-20">
          <Link
            href="/book"
            onClick={onClose}
            className="text-2xl font-medium text-black py-4 px-4 transition-colors hover:text-black/70"
          >
            Book
          </Link>
          <Link
            href="/blog"
            onClick={onClose}
            className="text-2xl font-medium text-black py-4 px-4 transition-colors hover:text-black/70"
          >
            Blog
          </Link>
          <Link
            href="/manifesto"
            onClick={onClose}
            className="text-2xl font-medium text-black py-4 px-4 transition-colors hover:text-black/70"
          >
            Manifesto
          </Link>
          <a
            href="https://github.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-medium text-black py-4 px-4 transition-colors hover:text-black/70"
          >
            Github
          </a>
          <a
            href="https://go.tiles.run/discord"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-medium text-black py-4 px-4 transition-colors hover:text-black/70"
          >
            Discord
          </a>
        </nav>
      </div>
    </>
  )
}
