"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Cpu, Package, Brain, FileCode, KeyRound } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"
import { triggerHaptic } from "@/lib/haptics"

const releasesHref =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/changelog#releases"
    : "https://tiles.run/changelog#releases"

export function HomeContent() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText("curl -fsSL https://tiles.run/install.sh | sh")
    triggerHaptic()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
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

              {/* Install Command Block */}
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-3 w-full">
                <div className="flex items-center rounded-xl bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-[#2a2a2a] w-full overflow-hidden">
                  <div className="overflow-x-auto px-2.5 py-2.5 sm:px-3 lg:px-5 lg:py-3.5 flex-1 min-w-0">
                    <code className="font-mono text-xs lg:text-base text-black/80 dark:text-[#E6E6E6] whitespace-nowrap">
                      curl -fsSL https://tiles.run/install.sh | sh
                    </code>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 flex items-center justify-center bg-[#f5f5f5] dark:bg-[#1a1a1a] hover:bg-[#e5e5e5] dark:hover:bg-[#252525] rounded-r-xl transition-colors px-2 py-2.5 sm:px-2.5 lg:px-4 lg:py-3.5 touch-manipulation"
                    aria-label="Copy to clipboard"
                    title={copied ? "Copied!" : "Copy to clipboard"}
                  >
                    {copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-3.5 w-3.5 text-green-600 lg:h-[18px] lg:w-[18px]"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-3.5 w-3.5 text-black/50 dark:text-[#8A8A8A] hover:text-black/80 dark:hover:text-[#E6E6E6] transition-colors lg:h-[18px] lg:w-[18px]"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs lg:text-sm text-black/60 dark:text-[#B3B3B3]">
                  Paste this in your terminal, or{" "}
                  <Link
                    href={releasesHref}
                    className="underline underline-offset-2 hover:text-black dark:hover:text-[#E6E6E6] transition-colors"
                  >
                    install another version
                  </Link>
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-[20rem]">
                  <span className="block">
                    <span className="inline-flex shrink-0 align-middle rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#7c7ca8] border-[#7c7ca8]/60 bg-[#7c7ca8]/15 dark:text-[#a5a5c4] dark:border-[#a5a5c4]/50 dark:bg-[#a5a5c4]/20 mr-1.5">
                      Alpha
                    </span>
                    for macOS 14+ on Apple Silicon Macs (M1 or newer). Recommended: 16 GB unified memory or more.
                  </span>
                  <span className="block">
                    iOS, Android, Linux, and Windows support coming later.
                  </span>
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
