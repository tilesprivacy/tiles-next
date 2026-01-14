'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useTheme } from 'next-themes'
import { MobileMenu } from "./mobile-menu"

interface SiteHeaderProps {
  themeAware?: boolean
}

function SiteHeaderContent({ themeAware = false }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isResourcesOpen) setIsResourcesOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isResourcesOpen])

  // Only use theme detection if themeAware is true
  const currentTheme = themeAware ? (resolvedTheme || (theme === 'system' ? systemTheme : theme)) : 'light'
  const isDark = themeAware && currentTheme === 'dark'

  // Use appropriate logo based on theme
  const logoSrc = (mounted && isDark) ? '/grey.png' : '/lighticon.png'

  // Use appropriate apple logo based on theme
  const appleLogoSrc = themeAware
    ? (mounted && isDark ? '/apple-logo.svg' : '/apple-logo-white.svg')
    : '/apple-logo-white.svg'

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
            <Link href="/changelog" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Changelog
            </Link>
            <Link href="/blog" className={`text-base font-medium ${textColor} transition-colors ${textColorHover}`}>
              Blog
            </Link>

            {/* Resources Dropdown */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsResourcesOpen(!isResourcesOpen)
              }}
              className={`text-base font-medium ${textColor} transition-colors ${textColorHover} inline-flex items-center gap-1`}
            >
              Resources
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`}
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Right side: Buttons and Hamburger */}
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3 shrink-0">
          {/* Buttons */}
          <Button
            asChild
            className={`h-8 rounded-full ${buttonBg} px-3 text-xs font-medium ${buttonHover} lg:h-10 lg:px-4 lg:text-sm`}
          >
            <Link
              href="/download"
              className={`group flex items-center gap-1.5 lg:gap-2 ${buttonText}`}
            >
              <Image
                src={appleLogoSrc}
                alt="Apple"
                width={16}
                height={20}
                className="h-3.5 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-4"
              />
              <span className={`transition-all duration-300 group-hover:scale-105 group-active:scale-105 ${buttonText}`}>Download</span>
            </Link>
          </Button>
          <Button
            asChild
            className={`h-8 rounded-full ${buttonBg} px-3 text-xs font-medium ${buttonHover} lg:h-10 lg:px-4 lg:text-sm`}
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-1.5 lg:gap-2 ${buttonText}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`h-3.5 w-3.5 fill-current transition-all duration-300 group-hover:scale-110 ${themeAware ? 'group-hover:text-background/70' : 'group-hover:text-white/70'} group-active:scale-110 lg:h-4 lg:w-4`}
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className={`transition-all duration-300 group-hover:scale-105 group-active:scale-105 ${buttonText}`}>Sponsor</span>
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

      {/* Full-width Resources Dropdown */}
      {isResourcesOpen && (
        <div
          className="fixed inset-x-0 top-[72px] lg:top-[88px] z-30 shadow-sm rounded-b-2xl"
          style={themeAware ? { backgroundColor: '#121212' } : { backgroundColor: '#ffffff' }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
              {/* Left side: Heading */}
              <div>
                <h3 className={`text-xl lg:text-2xl font-medium ${themeAware ? 'text-foreground/80' : 'text-black/80'}`}>
                  Everything you need to stay up-to-date and get help
                </h3>
              </div>

              {/* Right side: Links */}
              <div className="space-y-2">
                <a
                  href="https://github.com/orgs/tilesprivacy/projects/4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between py-2.5 text-base font-medium ${themeAware ? 'text-foreground hover:text-foreground/70' : 'text-black hover:text-black/70'} transition-colors group`}
                >
                  <span>Roadmap</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-4 w-4 ${themeAware ? 'text-foreground/40' : 'text-black/40'} transition-all group-hover:opacity-100 group-hover:translate-x-0.5`}
                  >
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="https://github.com/orgs/tilesprivacy/discussions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between py-2.5 text-base font-medium ${themeAware ? 'text-foreground hover:text-foreground/70' : 'text-black hover:text-black/70'} transition-colors group`}
                >
                  <span>RFCs</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-4 w-4 ${themeAware ? 'text-foreground/40' : 'text-black/40'} transition-all group-hover:opacity-100 group-hover:translate-x-0.5`}
                  >
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <Link
                  href="/book"
                  className={`flex items-center justify-between py-2.5 text-base font-medium ${themeAware ? 'text-foreground hover:text-foreground/70' : 'text-black hover:text-black/70'} transition-colors group`}
                >
                  <span>Book</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-4 w-4 ${themeAware ? 'text-foreground/40' : 'text-black/40'} transition-all group-hover:opacity-100 group-hover:translate-x-0.5`}
                  >
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} themeAware={themeAware} />
    </>
  )
}

export function SiteHeader(props: SiteHeaderProps) {
  return <SiteHeaderContent {...props} />
}
