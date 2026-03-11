"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Cpu, Package, Brain, FileCode, KeyRound } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"
import { triggerHaptic } from "@/lib/haptics"

interface DownloadMetadata {
  binarySizeLabel: string
}

interface HomeContentProps {
  initialBinarySizeLabel?: string
}

export function HomeContent({ initialBinarySizeLabel = "Unavailable" }: HomeContentProps) {
  const [download, setDownload] = useState<DownloadMetadata>({
    binarySizeLabel: initialBinarySizeLabel,
  })

  useEffect(() => {
    let isMounted = true

    async function loadDownloadMetadata() {
      try {
        const res = await fetch("/api/download-metadata")
        if (!res.ok) {
          return
        }

        const data = (await res.json()) as DownloadMetadata
        if (!isMounted) {
          return
        }

        setDownload({
          binarySizeLabel: data.binarySizeLabel || "Unavailable",
        })
      } catch {
        // Keep default fallback metadata on network failures.
      }
    }

    void loadDownloadMetadata()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">

      {/* Main Content - progressive spacing so narrow screens keep consistent rhythm */}
      <main className="px-4 pt-20 pb-16 sm:px-6 sm:pb-20 lg:px-12 lg:pt-28 lg:pb-28">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Section - Two Pane Layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-12 sm:mb-14 lg:mb-20 items-stretch lg:items-center">
            {/* Left Pane - Content */}
            <div className="flex flex-col gap-7 sm:gap-10 lg:gap-10">
              {/* Spacer for top whitespace on desktop only; mobile uses main pt-20 for consistency */}
              <div className="h-0 lg:h-6 w-fit" aria-hidden="true" />

              {/* Title & Subtitle */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-6">
                <h1 className="font-sans text-3xl min-[360px]:text-4xl font-bold tracking-tight text-foreground lg:text-6xl leading-[1.08]">
                  Tiles
                </h1>
                <p className="text-sm sm:text-base text-black/60 dark:text-[#B3B3B3] lg:text-xl max-w-xl leading-relaxed">
                  Your private and secure AI assistant for everyday use. Developed as an independent open source project, made possible by wonderful sponsors.
                </p>
              </div>

              {/* Primary Call To Action */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-3 w-full">
                <div className="flex items-center gap-4 sm:gap-6">
                  <Link
                    href="/download"
                    onClick={() => triggerHaptic()}
                    className="group inline-flex h-10 w-fit items-center justify-center gap-2 self-start rounded-full bg-black px-5 text-sm font-medium text-white shadow-sm ring-1 ring-black/5 transition-all duration-300 will-change-transform hover:scale-[1.02] hover:bg-black/90 active:scale-[0.98] dark:bg-white dark:text-black dark:ring-white/10 dark:hover:bg-white/90 sm:h-10 sm:px-5 lg:h-11 lg:px-7 lg:text-base"
                  >
                    <Image
                      src="/apple-logo-white.svg"
                      alt="Apple"
                      width={16}
                      height={20}
                      className="h-3.5 w-auto origin-right transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-4 dark:hidden"
                    />
                    <Image
                      src="/apple-logo.svg"
                      alt="Apple"
                      width={16}
                      height={20}
                      className="hidden h-3.5 w-auto origin-right transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-4 dark:block"
                    />
                    <span className="origin-left transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105">
                      Download for macOS
                    </span>
                  </Link>
                  <span className="text-lg sm:text-xl font-light text-black/60 dark:text-[#B3B3B3] tracking-tight">
                    {download.binarySizeLabel}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-[20rem]">
                  <span className="block">
                    Public Alpha for macOS 14+ on Apple Silicon Macs (M1 or newer). Recommended: 16 GB unified memory or more.
                  </span>
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-[20rem]">
                  Runs fully on-device, with optional peer-to-peer sync.{" "}
                  <Link href="/book/manual#onboarding" className="underline underline-offset-4">
                    View CLI screenshots.
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Pane - Wireframe */}
            <div className="w-full flex items-center justify-center">
              <div className="relative w-full max-w-xl">
                <Image
                  src="/wireframe.webp"
                  alt="Tiles Interface Wireframe"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/lighticon.png"
                    alt="Tiles"
                    width={80}
                    height={80}
                    className="h-16 w-16 lg:h-20 lg:w-20 dark:hidden"
                  />
                  <Image
                    src="/grey.png"
                    alt="Tiles"
                    width={80}
                    height={80}
                    className="hidden h-16 w-16 lg:h-20 lg:w-20 dark:block"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - same width as hero, tighter spacing for continuous flow */}
          <div className="flex flex-col gap-8 sm:gap-10 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 pt-12 sm:pt-14 lg:pt-20">
            {/* Feature 1 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Cpu className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">On-device models</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                An opinionated package of prompt, tools, and models optimized for your hardware.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <KeyRound className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Local-First Identity</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Locally generated DIDs secured by public-key cryptography.
              </p>
            </div>

            {/* Feature 3 - Code Interpreter (commented out for later)
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Code2 className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Code Interpreter</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Execute Python code and analyze data in real-time conversations.
              </p>
            </div>
            */}

            {/* Feature 4 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Package className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Portable Packaging</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Bundled dependencies that run without being installed on your system, for secure and air-gapped installations.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <FileCode className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Tilekit SDK</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Customize local models and agent experiences within Tiles. Built in Rust, based on open-source specifications such as Modelfile and the Open Responses API.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Brain className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h3 className="text-base lg:text-lg font-semibold text-foreground">AI Memory</h3>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] lg:text-[10px] font-medium uppercase tracking-wide text-black/50 dark:text-[#8A8A8A] ring-1 ring-black/10 dark:ring-white/10 bg-transparent font-mono">
                    EXPERIMENTAL
                  </span>
                </div>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Personalized assistance that learns and remembers your preferences.
              </p>
            </div>
          </div>

          <MissionSection title="Get to know Tiles Privacy" compact />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
