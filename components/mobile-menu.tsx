'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { triggerHaptic } from "@/lib/haptics"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"

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
  const buttonBg = themeAware ? 'bg-foreground' : 'bg-black'
  const buttonText = themeAware ? 'text-background' : 'text-white'
  const buttonHover = themeAware ? 'hover:bg-foreground/90' : 'hover:bg-black/90'
  const headerCtaPalette = themeAware
    ? themeAwareHeaderPrimaryCtaClasses
    : `${buttonBg} ${buttonText} ${buttonHover}`

  // Social icon colors - theme-aware using dark: utilities
  const iconBaseColor = themeAware ? 'text-foreground/40 dark:text-muted-foreground' : 'text-black/40'
  const monochromeIconHover = themeAware
    ? 'group-hover:text-foreground/70 dark:group-hover:text-foreground'
    : 'group-hover:text-black/70'
  const iconHoverColors = {
    twitter: monochromeIconHover,
    bluesky: monochromeIconHover,
    instagram: monochromeIconHover,
    discord: monochromeIconHover,
    github: monochromeIconHover,
    huggingface: monochromeIconHover,
    rss: monochromeIconHover,
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

  const topOffsetClass = hasBanner
    ? "top-[calc(2rem+env(safe-area-inset-top,0px))]"
    : "top-0"

  const menuHeaderPadding = hasBanner
    ? "pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-3 pt-4 sm:pl-[max(1rem,env(safe-area-inset-left,0px))] sm:pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pb-3.5 sm:pt-5"
    : "pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pb-3 pt-[calc(0.875rem+env(safe-area-inset-top,0px))] sm:pl-[max(1rem,env(safe-area-inset-left,0px))] sm:pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pb-3.5 sm:pt-[calc(1rem+env(safe-area-inset-top,0px))]"

  return (
    <>
      {/* Full screen overlay - higher z-index than header */}
      <div
        className={`fixed inset-x-0 bottom-0 left-0 right-0 z-[60] w-full max-w-none flex-col overscroll-contain lg:hidden ${isOpen ? "flex" : "hidden"} ${topOffsetClass} ${menuBg}`}
        aria-hidden={!isOpen}
      >
        {/* Header section with logo and buttons */}
        <div className={`flex items-center justify-between ${menuHeaderPadding} ${menuBg} shrink-0`}>
          {/* Logo */}
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 transition-colors hover:opacity-70 sm:gap-3">
            {themeAware ? (
              <>
                {/* Light mode logo */}
                <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 dark:hidden" />
                {/* Dark mode logo */}
                <Image src="/grey.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10 hidden dark:block" />
              </>
            ) : (
              <Image src="/lighticon.png" alt="Tiles" width={56} height={56} className="h-9 w-9 sm:h-10 sm:w-10" />
            )}
            <span className={`text-lg font-semibold leading-none tracking-tight sm:text-xl ${textColor}`}>
              Tiles
            </span>
          </Link>

          {/* Right side: Buttons and Close button */}
          <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
            {/* Download Button */}
            <Button
              asChild
              variant="ghost"
              className={`h-8 rounded-full ${headerCtaPalette} px-3 text-xs font-medium sm:h-8.5 sm:px-3.5 sm:text-sm`}
            >
              <Link
                href="/download"
                onClick={(e) => {
                  triggerHaptic()
                  onClose()
                }}
                className="group flex items-center gap-1.5 lg:gap-2"
              >
                <Download className="h-3.5 w-3.5 transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-4 sm:w-4" aria-hidden />
                <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">Download</span>
              </Link>
            </Button>

            {/* Buy Button */}
            <Button
              asChild
              variant="ghost"
              className={`h-8 rounded-full ${headerCtaPalette} px-3 text-xs font-medium sm:h-8.5 sm:px-3.5 sm:text-sm`}
            >
              <Link
                href="/pricing"
                onClick={() => {
                  triggerHaptic()
                  onClose()
                }}
                className="group flex items-center"
              >
                <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
                  Buy $50
                </span>
              </Link>
            </Button>

            {/* Close Button - Animated Hamburger */}
            <button
              onClick={onClose}
              className="ml-2 flex flex-col justify-center items-center w-6 h-6 touch-manipulation outline-none border-none bg-transparent p-0 shadow-none focus:outline-none focus:ring-0 active:outline-none relative"
              aria-label="Close navigation menu"
              type="button"
            >
              <span className={`block w-6 h-0.5 ${themeAware ? 'bg-foreground' : 'bg-black'} absolute top-1/2 left-0 transition-all duration-300 rotate-45`} />
              <span className={`block w-6 h-0.5 ${themeAware ? 'bg-foreground' : 'bg-black'} absolute top-1/2 left-0 transition-all duration-300 opacity-0`} />
              <span className={`block w-6 h-0.5 ${themeAware ? 'bg-foreground' : 'bg-black'} absolute top-1/2 left-0 transition-all duration-300 -rotate-45`} />
            </button>
          </div>
        </div>

        {/* Content area - flex to push social icons to bottom */}
        <div className="flex-1 flex flex-col">
          {/* Navigation Links - positioned below header */}
          <nav className="flex flex-col pt-4">
            <Link
              href="/about"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] transition-colors ${textColorHover}`}
            >
              About
            </Link>
            <Link
              href="/changelog"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] transition-colors ${textColorHover}`}
            >
              Changelog
            </Link>
            <Link
              href="/blog"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] transition-colors ${textColorHover}`}
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] transition-colors ${textColorHover}`}
            >
              Pricing
            </Link>
            <Link
              href="/book"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] transition-colors ${textColorHover}`}
            >
              Book
            </Link>
          </nav>

          {/* Spacer to push content to bottom half */}
          <div className="flex-1" />

          {/* Social Icons - positioned in bottom half */}
          <div className="flex items-center gap-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
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
