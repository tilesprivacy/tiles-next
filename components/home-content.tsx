'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface HomeContentProps {
  latestVersion: string
}

export function HomeContent({ latestVersion }: HomeContentProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Use grey logo on dark background, cream/light logo on light background
  const logoSrc = isDark ? '/grey.png' : '/cream.png'
  // Apple logo: black for white button (dark mode), white for black button (light mode)
  const appleLogoSrc = isDark ? '/apple-logo.svg' : '/apple-logo-white.svg'

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader themeAware />

      {/* Main Content - flows naturally from top */}
      <main className="px-6 pt-28 pb-24 lg:px-12 lg:pt-36 lg:pb-32">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col gap-8 mb-16 lg:mb-20">
            {/* Logo with Version badge */}
            <div className="relative w-fit">
              <div className="relative flex items-center justify-center rounded-3xl bg-[#F8F8F8] dark:bg-[#151515] shadow-sm ring-1 ring-black/5 dark:ring-white/10 h-20 w-20 lg:h-24 lg:w-24">
                <Image
                  src={logoSrc}
                  alt="Tiles Logo"
                  width={112}
                  height={112}
                  className="h-12 w-12 lg:h-14 lg:w-14"
                />
              </div>
              <span className="absolute -right-2 -top-2 rounded-full bg-white dark:bg-[#121212] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground shadow-sm ring-1 ring-black/10 dark:ring-white/10 lg:-right-3 lg:-top-3 lg:px-2.5 lg:py-1 lg:text-xs">
                {latestVersion}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-4 lg:space-y-5">
              <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                Tiles
              </h1>
              <p className="text-lg text-black/60 dark:text-white/60 lg:text-xl max-w-xl">
                Your private AI assistant for everyday use
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-start gap-3">
              <Button
                asChild
                variant="ghost"
                className="group rounded-full bg-black dark:bg-white px-6 py-5 text-sm font-medium text-white dark:text-black transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90 lg:px-8 lg:py-6 lg:text-base"
              >
                <Link href="/download" className="flex items-center gap-2.5">
                  <Image
                    src={appleLogoSrc}
                    alt="Apple"
                    width={16}
                    height={20}
                    className="h-4 w-auto lg:h-5"
                  />
                  <span>Download for Mac</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 lg:h-5 lg:w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </Button>
              <p className="text-xs text-black/40 dark:text-white/40">
                for macOS 14+ with Apple Silicon (M1+).
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-8 lg:space-y-10">
            <h2 className="text-sm font-medium uppercase tracking-wider text-black/40 dark:text-white/40">
              Features
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Feature 1 */}
              <div className="space-y-2">
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Built for Your Machine</h3>
                <p className="text-sm lg:text-base text-black/60 dark:text-white/60 leading-relaxed">
                  An opinionated package of prompt, tools, and on-device models optimized for your hardware.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-2">
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Code Interpreter</h3>
                <p className="text-sm lg:text-base text-black/60 dark:text-white/60 leading-relaxed">
                  Execute Python code and analyze data in real-time conversations.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base lg:text-lg font-semibold text-foreground">AI Memory</h3>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] lg:text-[10px] font-medium uppercase tracking-wide text-black/50 dark:text-white/50 ring-1 ring-black/10 dark:ring-white/10 bg-transparent font-mono">
                    INSIDERS
                  </span>
                </div>
                <p className="text-sm lg:text-base text-black/60 dark:text-white/60 leading-relaxed">
                  Personalized assistance that learns and remembers your preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
