import Image from "next/image"
import Link from "next/link"
import { Cpu, Code2, Package, Brain, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"

export function HomeContent() {
  return (
    <div className="min-h-screen bg-background">

      {/* Main Content - consistent section spacing (20/28) */}
      <main className="px-6 py-20 lg:px-12 lg:py-28">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hero Section - Two Pane Layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 mb-14 lg:mb-20 items-center">
            {/* Left Pane - Content */}
            <div className="flex flex-col gap-8 lg:gap-10">
              {/* Spacer to preserve top whitespace (version badge removed) */}
              <div className="h-5 lg:h-6 w-fit" aria-hidden="true" />

              {/* Title & Subtitle */}
              <div className="space-y-4 lg:space-y-6">
                <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground lg:text-6xl leading-[1.08]">
                  Tiles
                </h1>
                <p className="text-base text-black/60 dark:text-[#B3B3B3] lg:text-xl max-w-xl leading-relaxed">
                  Your private and secure AI assistant for everyday use. Developed as an independent open source project.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col gap-4">
                <Button
                  asChild
                  variant="ghost"
                  className="group rounded-full bg-black dark:bg-white px-6 py-5 text-sm font-medium text-white dark:text-black transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90 hover:shadow-lg hover:shadow-black/20 dark:hover:shadow-white/20 lg:px-8 lg:py-6 lg:text-base w-fit"
                >
                  <Link href="/download" className="flex items-center gap-2.5">
                    {/* Light mode: white Apple logo (on black button) */}
                    <Image
                      src="/apple-logo-white.svg"
                      alt="Apple"
                      width={16}
                      height={20}
                      className="h-4 w-auto lg:h-5 transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 dark:hidden"
                    />
                    {/* Dark mode: black Apple logo (on white button) */}
                    <Image
                      src="/apple-logo.svg"
                      alt="Apple"
                      width={16}
                      height={20}
                      className="h-4 w-auto lg:h-5 transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 hidden dark:block"
                    />
                    <span>Download for macOS</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 lg:h-5 lg:w-5 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </Button>
                <p className="text-xs leading-relaxed text-muted-foreground max-w-[20rem]">
                  <span className="block">
                    <span className="inline-flex shrink-0 align-middle rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#7c7ca8] border-[#7c7ca8]/60 bg-[#7c7ca8]/15 dark:text-[#a5a5c4] dark:border-[#a5a5c4]/50 dark:bg-[#a5a5c4]/20 mr-1.5">
                      Alpha
                    </span>
                    for macOS 14+ on Apple Silicon Macs (M1 or newer). Recommended: 16 GB unified memory or more.
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
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 pt-14 lg:pt-20">
            {/* Feature 1 */}
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Cpu className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Built for Your Machine</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                An opinionated package of prompt, tools, and on-device models optimized for your hardware.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-3 lg:space-y-4">
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

            {/* Feature 3 */}
            <div className="space-y-3 lg:space-y-4">
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

            {/* Feature 4 */}
            <div className="space-y-3 lg:space-y-4">
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

            {/* Feature 5 */}
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <FileCode className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Modelfile SDK</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Customize local models and agent experiences within Tiles. Built in Rust, backward compatible with Ollama&apos;s Modelfile spec, with support for the Open Responses API.
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
