'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function BookHeader() {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use resolvedTheme if available, otherwise determine from theme/systemTheme
  const currentTheme = resolvedTheme || (theme === 'system' ? systemTheme : theme)
  const isDark = currentTheme === 'dark'
  
  // Use dark.jpeg for dark theme, lighticon.png for light theme
  // Default to lighticon.png during SSR to avoid hydration mismatch
  const logoSrc = mounted && isDark ? '/dark.jpeg' : '/lighticon.png'

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-background via-background/95 to-transparent px-4 pb-3 pt-4 lg:fixed lg:px-6 lg:pb-4 lg:pt-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-base font-medium text-foreground lg:text-lg">
          <Link href="/" className="transition-colors hover:text-foreground/70">
            <Image src={logoSrc} alt="Tiles" width={20} height={20} className="h-5 w-5" />
          </Link>
          <span className="text-foreground/30">/</span>
          <Link href="/book" className="font-bold transition-colors hover:text-foreground/70">
            Book
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
        <Button
          asChild
          className="h-8 rounded-full bg-foreground px-3 text-xs font-medium text-background hover:bg-foreground/90 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 lg:h-10 lg:px-4 lg:text-sm"
        >
          <Link href="/download" className="flex items-center gap-1.5 lg:gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 lg:h-4 lg:w-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span>Download</span>
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
              className="h-3.5 w-3.5 fill-[#ff8fb6] transition-all duration-300 group-hover:scale-110 group-hover:fill-[#ffc2dd] group-active:scale-110 lg:h-4 lg:w-4"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
          </a>
        </Button>
      </div>
    </header>
  )
}

