'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  themeAware?: boolean
  hasBanner?: boolean
}

export function MobileMenu({ isOpen, onClose, themeAware = false, hasBanner = false }: MobileMenuProps) {

  // Theme-aware class names - use Tailwind dark: utilities for CSS-based switching
  const menuBg = themeAware ? 'bg-background' : 'bg-white'
  const textColor = themeAware ? 'text-foreground' : 'text-black'
  const textColorHover = themeAware ? 'hover:text-foreground/70' : 'hover:text-black/70'
  // Buttons: black bg in light mode, white bg in dark mode (using dark: utilities for themeAware)
  const buttonBg = themeAware ? 'bg-black dark:bg-white' : 'bg-black'
  const buttonText = themeAware ? 'text-white dark:text-black' : 'text-white'
  const buttonHover = themeAware ? 'hover:bg-black/90 dark:hover:bg-white/90' : 'hover:bg-black/90'
  
  // Social icon colors - theme-aware using dark: utilities (matching book dark theme)
  const iconBaseColor = themeAware ? 'text-black/40 dark:text-[#B3B3B3]' : 'text-black/40'
  const iconHoverColors = {
    twitter: themeAware ? 'group-hover:text-black/70 dark:group-hover:text-[#E6E6E6]' : 'group-hover:text-black/70',
    bluesky: 'group-hover:text-[#0085FF]',
    instagram: 'group-hover:text-[#E4405F]',
    discord: 'group-hover:text-[#5865F2]',
    github: themeAware ? 'group-hover:text-black/70 dark:group-hover:text-[#E6E6E6]' : 'group-hover:text-black/70',
    huggingface: 'group-hover:text-[#FFD21E]',
    rss: 'group-hover:text-orange-500',
  }

  // Prevent body scroll when menu is open (iOS Safari needs position:fixed to fully lock)
  useEffect(() => {
    if (typeof window === "undefined") return

    const body = document.body
    const html = document.documentElement

    if (!isOpen) return

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
      // Force immediate scroll restoration so close does not animate/jump.
      html.style.scrollBehavior = "auto"
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" })
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prev.htmlScrollBehavior
      })
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

  const topOffsetClass = hasBanner ? "top-8" : "top-0"

  return (
    <>
      {/* Full screen overlay - higher z-index than header */}
      <div
        className={`fixed inset-x-0 bottom-0 ${topOffsetClass} ${menuBg} z-[60] lg:hidden flex flex-col overscroll-contain`}
      >
        {/* Header section with logo and buttons */}
        <div className={`flex items-center justify-between px-3 pb-2.5 pt-3 sm:px-4 sm:pb-3 sm:pt-4 ${menuBg} shrink-0`}>
          {/* Logo */}
          <Link href="/" onClick={onClose} className="transition-colors hover:opacity-70">
            {themeAware ? (
              <>
                {/* Light mode logo */}
                <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-9 w-9 sm:h-10 sm:w-10 dark:hidden" />
                {/* Dark mode logo */}
                <Image src="/grey.png" alt="Tiles" width={48} height={48} className="h-9 w-9 sm:h-10 sm:w-10 hidden dark:block" />
              </>
            ) : (
              <Image src="/lighticon.png" alt="Tiles" width={48} height={48} className="h-9 w-9 sm:h-10 sm:w-10" />
            )}
          </Link>

          {/* Right side: Buttons and Close button */}
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0">
            {/* Download Button */}
            <Button
              asChild
              variant="ghost"
              className={`h-7 rounded-full ${buttonBg} ${buttonText} px-2.5 text-[11px] font-medium ${buttonHover} sm:h-8 sm:px-3 sm:text-xs`}
            >
              <Link
                href="/download"
                onClick={onClose}
                className="group flex items-center gap-1.5 lg:gap-2"
              >
                {themeAware ? (
                  <>
                    {/* Light mode: white Apple logo (on black button) */}
                    <Image
                      src="/apple-logo-white.svg"
                      alt="Apple"
                      width={16}
                      height={20}
                      className="h-3 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-3.5 dark:hidden"
                    />
                    {/* Dark mode: black Apple logo (on white button) */}
                    <Image
                      src="/apple-logo.svg"
                      alt="Apple"
                      width={16}
                      height={20}
                      className="h-3 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-3.5 hidden dark:block"
                    />
                  </>
                ) : (
                  <Image
                    src="/apple-logo-white.svg"
                    alt="Apple"
                    width={16}
                    height={20}
                    className="h-3 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-3.5"
                  />
                )}
                <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">Download</span>
              </Link>
            </Button>

            {/* Sponsor Button */}
            <Button
              asChild
              variant="ghost"
              className={`h-7 rounded-full ${buttonBg} ${buttonText} px-2 text-[11px] font-medium ${buttonHover} sm:h-8 sm:px-3 sm:text-xs`}
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
                  className="h-3 w-3 fill-current transition-all duration-300 will-change-transform backface-hidden group-hover:scale-110 group-active:scale-110 sm:h-3.5 sm:w-3.5"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="hidden min-[360px]:inline transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
                  Sponsor
                </span>
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

        {/* Content area - flex to push social icons to bottom */}
        <div className="flex-1 flex flex-col">
          {/* Navigation Links - positioned below header */}
          <nav className="flex flex-col pt-4">
            <Link
              href="/changelog"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
            >
              Changelog
            </Link>
            <Link
              href="/blog"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
            >
              Blog
            </Link>
            <Link
              href="/book"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
            >
              Book
            </Link>
            <a
              href="https://github.com/tilesprivacy/tiles"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              aria-label="Star on GitHub"
              className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover} inline-flex items-center gap-3`}
            >
              <FaGithub className="h-5 w-5 shrink-0" aria-hidden />
              <span>Star</span>
            </a>
          </nav>

          {/* Spacer to push content to bottom half */}
          <div className="flex-1" />

          {/* Social Icons - positioned in bottom half */}
          <div className="flex items-center gap-4 px-4 pb-8">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className={`h-5 w-5 ${iconBaseColor} transition-colors ${iconHoverColors.twitter}`} />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className={`h-5 w-5 ${iconBaseColor} transition-colors ${iconHoverColors.bluesky}`} />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className={`h-5 w-5 ${iconBaseColor} transition-colors ${iconHoverColors.instagram}`} />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className={`h-5 w-5 ${iconBaseColor} transition-colors ${iconHoverColors.discord}`} />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className={`h-5 w-5 ${iconBaseColor} transition-colors ${iconHoverColors.github}`} />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className={`h-5 w-5 ${iconBaseColor} transition-colors ${iconHoverColors.huggingface}`} />
            </a>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="RSS Feed"
            >
              <FaRss className={`h-5 w-5 ${iconBaseColor} transition-colors ${iconHoverColors.rss}`} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
