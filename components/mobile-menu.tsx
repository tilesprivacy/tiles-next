'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useTheme } from 'next-themes'
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  themeAware?: boolean
}

export function MobileMenu({ isOpen, onClose, themeAware = false }: MobileMenuProps) {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only use theme detection if themeAware is true
  const currentTheme = themeAware ? (resolvedTheme || (theme === 'system' ? systemTheme : theme)) : 'light'
  const isDark = themeAware && currentTheme === 'dark'

  // Use appropriate logo based on theme
  // Use grey.png for dark theme (same as book page)
  const logoSrc = (mounted && isDark) ? '/grey.png' : '/lighticon.png'

  // Use appropriate apple logo based on theme
  const appleLogoSrc = themeAware
    ? (mounted && isDark ? '/apple-logo.svg' : '/apple-logo-white.svg')
    : '/apple-logo-white.svg'

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
        className={`fixed inset-0 ${menuBg} z-[50] lg:hidden flex flex-col`}
      >
        {/* Header section with logo and buttons */}
        <div className={`flex items-center justify-between px-4 pb-3 pt-4 ${menuBg} shrink-0`}>
          {/* Logo */}
          <Link href="/" onClick={onClose} className="transition-colors hover:opacity-70">
            <Image src={logoSrc} alt="Tiles" width={48} height={48} className="h-10 w-10" />
          </Link>

          {/* Right side: Buttons and Close button */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            {/* Download Button */}
            <Button
              asChild
              variant="ghost"
              className={`h-8 rounded-full ${buttonBg} ${buttonText} px-3 text-xs font-medium ${buttonHover}`}
            >
              <Link
                href="/download"
                onClick={onClose}
                className="group flex items-center gap-1.5"
              >
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
              variant="ghost"
              className={`h-8 rounded-full ${buttonBg} ${buttonText} px-3 text-xs font-medium ${buttonHover}`}
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
                  className="h-3.5 w-3.5 fill-current transition-all duration-300 group-hover:scale-110 group-active:scale-110"
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

        {/* Content area - flex to push social icons to bottom */}
        <div className="flex-1 flex flex-col">
          {/* Navigation Links - positioned below header */}
          <nav className="flex flex-col pt-4">
            <Link
              href="/mission"
              onClick={onClose}
              className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover}`}
            >
              Mission
            </Link>
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

            {/* Resources Expandable Section */}
            <div>
              <button
                onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
                className={`text-2xl font-medium ${textColor} py-4 px-4 transition-colors ${textColorHover} w-full text-left flex items-center justify-between`}
              >
                <span>Resources</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-5 w-5 transition-transform duration-200 ${isResourcesExpanded ? 'rotate-180' : ''}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {isResourcesExpanded && (
                <div className="pl-4">
                  <a
                    href="https://github.com/orgs/tilesprivacy/projects/4"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className={`text-lg font-medium ${textColor} py-3 px-4 transition-colors ${textColorHover} flex items-center justify-between`}
                  >
                    <span className="inline-flex items-center gap-1">
                      Roadmap
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={`h-3.5 w-3.5 ${themeAware ? 'text-foreground/40' : 'text-black/40'} transition-colors group-hover:text-current`}
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/orgs/tilesprivacy/discussions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className={`text-lg font-medium ${textColor} py-3 px-4 transition-colors ${textColorHover} flex items-center justify-between`}
                  >
                    <span className="inline-flex items-center gap-1">
                      RFCs
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={`h-3.5 w-3.5 ${themeAware ? 'text-foreground/40' : 'text-black/40'} transition-colors group-hover:text-current`}
                      >
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <Link
                    href="/book"
                    onClick={onClose}
                    className={`text-lg font-medium ${textColor} py-3 px-4 transition-colors ${textColorHover} flex items-center justify-between`}
                  >
                    <span>Book</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Spacer to push content to bottom half */}
          <div className="flex-1" />

          {/* Theme Switcher - positioned above social icons */}
          <div className="px-4 pb-6">
            <ThemeSwitcher variant={themeAware ? 'auto' : 'light'} size="md" />
          </div>

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
