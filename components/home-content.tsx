"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, CircleDashed, Cpu, Download, FileCode, KeyRound, Package, RefreshCw, Wrench } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"
import { triggerHaptic } from "@/lib/haptics"

export function HomeContent() {
  const comparisonRows = [
    { label: "CLI", tiles: "check", ollama: "check", lmStudio: "check", jan: "check", lumo: "empty" },
    { label: "Client app", tiles: "empty", ollama: "check", lmStudio: "check", jan: "check", lumo: "check" },
    { label: "Decentralized Identity", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", lumo: "empty" },
    { label: "Encryption", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", lumo: "check" },
    { label: "Sync", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", lumo: "check" },
    { label: "On-device models", tiles: "check", ollama: "check", lmStudio: "check", jan: "check", lumo: "empty" },
    { label: "Cloud models", tiles: "empty", ollama: "check", lmStudio: "empty", jan: "check", lumo: "check" },
    { label: "In-house models", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "check", lumo: "empty" },
    { label: "Open source", tiles: "check", ollama: "partial", lmStudio: "partial", jan: "check", lumo: "partial" },
    { label: "Modelfile", tiles: "check", ollama: "check", lmStudio: "empty", jan: "empty", lumo: "empty" },
    { label: "Agent Harness", tiles: "wip", ollama: "check", lmStudio: "partial", jan: "empty", lumo: "empty" },
    { label: "Memory", tiles: "wip", ollama: "empty", lmStudio: "empty", jan: "empty", lumo: "empty" },
    { label: "Connectors", tiles: "wip", ollama: "check", lmStudio: "check", jan: "check", lumo: "empty" },
    { label: "Shared Links", tiles: "wip", ollama: "empty", lmStudio: "empty", jan: "empty", lumo: "empty" },
    { label: "Offline Installer", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", lumo: "empty" },
    { label: "Cross platform", tiles: "wip", ollama: "check", lmStudio: "check", jan: "check", lumo: "check" },
  ]
  const renderComparisonStatus = (status: string) => (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-foreground dark:bg-white/10">
      {status === "check" ? (
        <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
      ) : status === "wip" ? (
        <Wrench className="h-3.5 w-3.5 text-black/50 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
      ) : status === "partial" ? (
        <CircleDashed className="h-3.5 w-3.5 text-black/50 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
      ) : (
        <span className="text-sm text-black/35 dark:text-[#6B6B6B]" aria-hidden>
          -
        </span>
      )}
      <span className="sr-only">
        {status === "check" ? "Supported" : status === "wip" ? "Work in progress" : status === "partial" ? "Partially supported" : "Not supported"}
      </span>
    </span>
  )

  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-background">

      {/* Main Content - progressive spacing so narrow screens keep consistent rhythm */}
      <main className="px-4 pb-14 pt-[4.5rem] min-[390px]:px-5 min-[390px]:pt-20 sm:px-6 sm:pb-20 lg:px-12 lg:pt-28 lg:pb-28">
        <div className="mx-auto w-full max-w-6xl">
          {/* Hero Section - Two Pane Layout */}
          <div className="mb-10 flex flex-col gap-10 min-[390px]:mb-12 sm:mb-14 sm:gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:mb-20">
            {/* Left Pane - Content */}
            <div className="flex max-w-[34rem] flex-col gap-6 sm:gap-10 lg:gap-10">
              {/* Spacer for top whitespace on desktop only; mobile uses main pt-20 for consistency */}
              <div className="h-0 lg:h-6 w-fit" aria-hidden="true" />

              {/* Title & Subtitle */}
              <div className="space-y-3.5 min-[390px]:space-y-5 sm:space-y-6 lg:space-y-6">
                <h1 className="font-sans text-[2.6rem] font-bold leading-[1.02] tracking-tight text-foreground min-[360px]:text-[3rem] lg:text-6xl">
                  Tiles
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base lg:text-xl">
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
                    <Download className="h-3.5 w-3.5 origin-right transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-4 sm:w-4" aria-hidden />
                    <span className="origin-left transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105">
                      Download for macOS
                    </span>
                  </Link>
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
            <div className="flex w-full items-center justify-center">
              <div className="relative mx-auto w-full max-w-[24rem] min-[360px]:max-w-[26rem] min-[430px]:max-w-[30rem] sm:max-w-[34rem] lg:max-w-xl">
                <Image
                  src="/wireframe.webp"
                  alt="Tiles Interface Wireframe"
                  width={800}
                  height={600}
                  className="h-auto w-full"
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
          <div className="flex flex-col gap-7 pt-10 sm:gap-10 sm:pt-14 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 lg:pt-20">
            {/* Feature 1 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Cpu className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">On-device Models</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                An opinionated package of prompt, tools, and models optimized for your hardware. Powered by{" "}
                <a
                  href="https://ml-explore.github.io/mlx/build/html/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                >
                  MLX
                </a>{" "}
                on Apple Silicon.
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
                Locally generated decentralized IDs, with the private key always stored locally on device.
              </p>
            </div>

            {/* Feature 3 — Sync */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Sync</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Encrypted peer-to-peer sync for chats across your linked devices, online or on your local network. Powered by{" "}
                <a
                  href="https://www.iroh.computer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                >
                  Iroh&rsquo;s
                </a>{" "}
                networking stack.
              </p>
            </div>

            {/* Code Interpreter (commented out for later)
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
                Bundled dependencies run in a self contained environment without modifying your system, with a fully offline installer available for secure and air gapped installations.
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
                Customize local models and agent experiences within Tiles. Built in Rust, based on open-source specifications such as Modelfile and the Open Responses API.{" "}
                See{" "}
                <Link
                  href="/book/tilekit"
                  className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                >
                  Tilekit SDK docs.
                </Link>
              </p>
            </div>

          </div>

          <section className="pt-10 sm:pt-14 lg:pt-20">
            <div className="min-w-0 space-y-4 sm:space-y-5">
              <div className="max-w-2xl space-y-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Private AI comparison
                </h2>
                <p className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base">
                  A quick comparison of private AI assistant tools across app experience, integrations, models, and private deployment features.
                </p>
              </div>

              <div className="-mx-4 max-w-none overflow-x-auto overflow-y-hidden px-4 overscroll-x-contain min-[390px]:-mx-5 min-[390px]:px-5 sm:mx-0 sm:max-w-full sm:px-0 [-webkit-overflow-scrolling:touch]">
                <table className="w-full min-w-[42rem] table-fixed border-separate border-spacing-0 text-left sm:min-w-[48rem]">
                  <colgroup>
                    <col className="w-[32%]" />
                    <col className="w-[13.6%]" />
                    <col className="w-[13.6%]" />
                    <col className="w-[13.6%]" />
                    <col className="w-[13.6%]" />
                    <col className="w-[13.6%]" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th className="border-b border-black/10 py-3 pr-4 text-xs font-medium uppercase tracking-[0.2em] text-black/50 dark:border-white/10 dark:text-[#8A8A8A]">
                        Capability
                      </th>
                      <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">
                        Tiles
                      </th>
                      <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">
                        Ollama
                      </th>
                      <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">
                        LM Studio
                      </th>
                      <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">
                        Jan
                      </th>
                      <th className="border-b border-black/10 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">
                        Lumo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label}>
                        <th className="border-b border-black/10 py-3 pr-4 text-sm font-medium text-foreground dark:border-white/10">
                          {row.label}
                        </th>
                        {[row.tiles, row.ollama, row.lmStudio, row.jan, row.lumo].map((status, index) => (
                          <td
                            key={`${row.label}-${index}`}
                            className="border-b border-black/10 px-4 py-3 align-middle dark:border-white/10"
                          >
                            {renderComparisonStatus(status)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/60 dark:text-[#B3B3B3] sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  {renderComparisonStatus("check")}
                  <span>Supported</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  {renderComparisonStatus("partial")}
                  <span>Partially supported</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  {renderComparisonStatus("empty")}
                  <span>Not supported</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  {renderComparisonStatus("wip")}
                  <span>Work in progress</span>
                </span>
              </div>
            </div>
          </section>

          <MissionSection title="Get to know Tiles Privacy" compact />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
