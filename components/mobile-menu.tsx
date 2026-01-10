'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTheme } from 'next-themes'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  themeAware?: boolean
}

export function MobileMenu({ isOpen, onClose, themeAware = false }: MobileMenuProps) {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only use theme detection if themeAware is true
  const currentTheme = themeAware ? (resolvedTheme || (theme === 'system' ? systemTheme : theme)) : 'light'
  const isDark = themeAware && currentTheme === 'dark'

  // Use appropriate logo based on theme
  const logoSrc = (mounted && isDark) ? '/dark.jpeg' : '/lighticon.png'

  // Use appropriate apple logo based on theme
  const appleLogoSrc = (mounted && isDark) ? '/apple-logo.svg' : '/apple-logo-white.svg'

  // Theme-aware class names
  const menuBg = themeAware ? 'bg-background' : 'bg-white'
  const textColor = themeAware ? 'text-foreground' : 'text-black'
  const textColorHover = themeAware ? 'hover:text-foreground/70' : 'hover:text-black/70'
  const buttonBg = themeAware ? 'bg-foreground' : 'bg-black'
  const buttonText = themeAware ? 'text-background' : 'text-white'
  const buttonHover = themeAware ? 'hover:bg-foreground/90' : 'hover:bg-black/90'

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
        className={`fixed inset-0 ${menuBg} z-[50] lg:hidden`}
      >
        {/* Header section with logo and buttons */}
        <div className={`fixed inset-x-0 top-0 z-[51] flex items-center justify-between px-4 pb-3 pt-4 ${menuBg}`}>
          {/* Logo */}
          <Link href="/" onClick={onClose} className="transition-colors hover:opacity-70">
            <Image src={logoSrc} alt="Tiles" width={48} height={48} className="h-10 w-10" />
          </Link>

          {/* Right side: Buttons and Close button */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            {/* Download Button */}
            <Button
              asChild
              className={`h-8 rounded-full ${buttonBg} px-3 text-xs font-medium ${buttonText} ${buttonHover}`}
            >
              <Link href="/download" onClick={onClose} className="group flex items-center gap-1.5">
                <Image
                  src={appleLogoSrc}
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
              className={`h-8 rounded-full ${buttonBg} px-3 text-xs font-medium ${buttonText} ${buttonHover}`}
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
                  className={`h-3.5 w-3.5 ${themeAware ? 'fill-background' : 'fill-white'} transition-all duration-300 group-hover:scale-110 ${themeAware ? 'group-hover:fill-background/70' : 'group-hover:fill-white/70'} group-active:scale-110`}
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
              <span className={`block w-5 h-0.5 ${themeAware ? 'bg-foreground' : 'bg-black'} absolute top-1/2 left-0 transition-all duration-300 rotate-45`} />
              <span className={`block w-5 h-0.5 ${themeAware ? 'bg-foreground' : 'bg-black'} absolute top-1/2 left-0 transition-all duration-300 opacity-0`} />
              <span className={`block w-5 h-0.5 ${themeAware ? 'bg-foreground' : 'bg-black'} absolute top-1/2 left-0 transition-all duration-300 -rotate-45`} />
            </button>
          </div>
        </div>

        {/* Navigation Links - positioned below header */}
        <nav className="flex flex-col pt-20">
          <Link
            href="/book"
            onClick={onClose}
            className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
          >
            Book
          </Link>
          <Link
            href="/blog"
            onClick={onClose}
            className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
          >
            Blog
          </Link>
          <Link
            href="/manifesto"
            onClick={onClose}
            className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
          >
            Manifesto
          </Link>
          <a
            href="https://github.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
          >
            Github
          </a>
          <a
            href="https://go.tiles.run/discord"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
          >
            Discord
          </a>
        </nav>
      </div>
    </>
  )
}
