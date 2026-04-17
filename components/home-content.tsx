"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, CircleDashed, Cpu, Download, FileCode, KeyRound, Package, RefreshCw } from "lucide-react"
import { BookFaq, BookFaqItem } from "@/components/book-faq"
import { PersonAvatar } from "@/components/person-avatar"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { triggerHaptic } from "@/lib/haptics"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"
import { getPersonById, splitPersonDisplayName } from "@/lib/people"
import { useMobileDownloadPrompt } from "@/components/mobile-download-prompt"

interface HomeContentProps {
  highlightReadTimes: Record<string, string>
}

export function HomeContent({ highlightReadTimes }: HomeContentProps) {
  const { openMobileDownloadPrompt, mobileDownloadPrompt } = useMobileDownloadPrompt()
  const sectionHeadingClass = "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
  const alphaPillClass =
    "inline-flex items-center rounded-full border border-black/20 px-1.5 py-0.5 text-[0.62rem] tracking-[0.08em] text-black/60 dark:border-white/25 dark:text-[#B9B9B9] sm:text-[0.66rem]"
  const betaAvailabilityNote = (
    <div className="max-w-md space-y-2 pl-1">
      <p className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap text-[0.68rem] font-medium text-black/55 dark:text-[#9E9E9E] sm:text-[0.72rem]">
        <span className="hidden items-center gap-1.5 lg:inline-flex">
          <span className={alphaPillClass}>
            ALPHA
          </span>
          <span>for macOS 14+ (arm64)</span>
        </span>
        <span className="inline-flex items-center gap-1.5 lg:hidden">
          <span>Currently available in</span>
          <span className={alphaPillClass}>
            ALPHA
          </span>
        </span>
      </p>
      <p className="max-w-[34ch] text-xs leading-relaxed text-black/55 dark:text-[#9E9E9E] sm:text-[0.8rem]">
        Expect rough edges, features behind experimental flags, and occasional reliability issues.
      </p>
    </div>
  )
  const highlightCards = [
    {
      slug: "ship-it-up",
      href: "/blog/ship-it-up",
      meta: "Apr 5, 2026 . Engineering",
      title: "Ship it up",
      authorId: "anandu-pavanan",
    },
    {
      slug: "move-along-python",
      href: "/blog/move-along-python",
      meta: "Feb 17, 2026 . Engineering",
      title: "Move Along, Python",
      authorId: "anandu-pavanan",
    },
    {
      slug: "introducing-tiles-public-alpha",
      href: "/blog/introducing-tiles-public-alpha",
      meta: "Jan 2, 2026 . Product",
      title: "Introducing Tiles Public Alpha",
      authorId: "ankesh-bharti",
    },
  ]
  const comparisonRows = [
    { label: "CLI", tiles: "check", ollama: "check", lmStudio: "check", jan: "check", osaurus: "check" },
    { label: "Client app", tiles: "empty", ollama: "check", lmStudio: "check", jan: "check", osaurus: "check" },
    { label: "Decentralized Identity", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "check" },
    { label: "Encryption", tiles: "check", ollama: "empty", lmStudio: "partial", jan: "empty", osaurus: "partial" },
    { label: "Sync", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "empty" },
    { label: "On-device models", tiles: "check", ollama: "check", lmStudio: "check", jan: "check", osaurus: "check" },
    { label: "Cloud models", tiles: "empty", ollama: "check", lmStudio: "empty", jan: "check", osaurus: "check" },
    { label: "In-house models", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "check", osaurus: "empty" },
    { label: "Modelfile", tiles: "check", ollama: "check", lmStudio: "empty", jan: "empty", osaurus: "empty" },
    { label: "Agent Harness", tiles: "empty", ollama: "check", lmStudio: "partial", jan: "empty", osaurus: "check" },
    { label: "Memory", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "check" },
    { label: "Connectors", tiles: "empty", ollama: "check", lmStudio: "check", jan: "check", osaurus: "check" },
    { label: "Remote link", tiles: "empty", ollama: "empty", lmStudio: "check", jan: "empty", osaurus: "check" },
    { label: "Shared Links", tiles: "empty", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "empty" },
    { label: "Offline Installer", tiles: "check", ollama: "empty", lmStudio: "empty", jan: "empty", osaurus: "empty" },
    { label: "Cross platform", tiles: "empty", ollama: "check", lmStudio: "check", jan: "check", osaurus: "empty" },
    { label: "Open source", tiles: "check", ollama: "partial", lmStudio: "partial", jan: "check", osaurus: "check" },
  ]
  const renderComparisonStatus = (status: string) => (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-foreground dark:bg-white/10">
      {status === "check" ? (
        <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
      ) : status === "partial" ? (
        <CircleDashed className="h-3.5 w-3.5 text-black/50 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
      ) : (
        <span className="text-sm text-black/35 dark:text-[#6B6B6B]" aria-hidden>
          -
        </span>
      )}
      <span className="sr-only">
        {status === "check" ? "Supported" : status === "partial" ? "Partially supported" : "Not supported"}
      </span>
    </span>
  )

  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-background">

      {/* Main Content - progressive spacing so narrow screens keep consistent rhythm */}
      <main className="px-4 pb-6 pt-[calc(4.75rem+env(safe-area-inset-top,0px))] min-[390px]:px-5 min-[390px]:pt-[calc(5.25rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-8 lg:px-12 lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] lg:pb-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Hero Section - Two Pane Layout */}
          <div className="mb-10 flex flex-col gap-8 min-[390px]:mb-12 sm:mb-14 sm:gap-10 lg:mb-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
            {/* Left Pane - Content */}
            <div className="flex max-w-[33rem] flex-col gap-5 sm:gap-6 lg:gap-6 lg:pr-4">
              {/* Hero copy */}
              <div className="space-y-3 min-[390px]:space-y-4 sm:space-y-4 lg:space-y-4">
                <h1 className="max-w-[22ch] font-sans text-[1.95rem] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[2.2rem] lg:text-[2.6rem]">
                  Private and secure AI assistant for everyday use
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-black/65 dark:text-[#B3B3B3] sm:text-base lg:text-lg">
                  Runs locally by default with optional peer-to-peer sync. Built as a fully user-supported,
                  independent open-source project.
                </p>
              </div>

              {/* Primary Call To Action */}
              <div className="flex flex-col gap-3 sm:gap-3.5 lg:gap-3 w-full">
                <div className="inline-flex w-fit flex-col items-start gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    className={`h-10 w-fit self-start rounded-sm ${themeAwareHeaderPrimaryCtaClasses} px-5 text-sm font-medium sm:h-10 sm:px-5 lg:h-11 lg:px-7 lg:text-[0.98rem]`}
                  >
                    <Link
                      href="/download"
                      onClick={(event) => {
                        if (openMobileDownloadPrompt(event)) {
                          return
                        }
                        triggerHaptic()
                      }}
                      className="group flex items-center gap-2"
                    >
                      <span className="transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105 group-active:scale-105">
                        Download for macOS
                      </span>
                      <Download
                        className="h-3.5 w-3.5 transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                  {betaAvailabilityNote}
                </div>
              </div>
            </div>

            {/* Right Pane - Wireframe */}
            <div className="flex w-full items-center justify-center">
              <div className="relative mx-auto w-full max-w-[24rem] min-[360px]:max-w-[26rem] min-[430px]:max-w-[30rem] sm:max-w-[34rem] lg:max-w-[35.5rem]">
                <Image
                  src="/wireframe.webp"
                  alt="Tiles Interface Wireframe"
                  width={800}
                  height={600}
                  className="h-auto w-full"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[10%] sm:px-[11%]">
                  <Image
                    src="/tiles_banner_outline_blk.svg"
                    alt="Tiles"
                    width={1200}
                    height={220}
                    className="h-auto w-full max-w-[15rem] min-[360px]:max-w-[16.5rem] sm:max-w-[18rem] lg:max-w-[19.5rem] dark:hidden"
                  />
                  <Image
                    src="/tiles_banner_outline_wht.svg"
                    alt="Tiles"
                    width={1200}
                    height={220}
                    className="hidden h-auto w-full max-w-[15rem] min-[360px]:max-w-[16.5rem] sm:max-w-[18rem] lg:max-w-[19.5rem] dark:block"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - same width as hero, tighter spacing for continuous flow */}
          <div className="flex flex-col gap-7 pt-8 pb-10 sm:gap-10 sm:pt-10 sm:pb-12 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12 lg:pt-12 lg:pb-14">
            {/* Feature 1 (temporarily hidden until launch)
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Bot className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Agent Harness</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Native{" "}
                <a
                  href="https://pi.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                >
                  Pi
                </a>{" "}
                agent harness for knowledge work and coding, with extensions for fully customizable workflows across
                tasks and use cases.
              </p>
            </div>
            */}

            {/* Feature 2 */}
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

            {/* Feature 3 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <KeyRound className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Decentralized Identity</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Locally generated{" "}
                <a
                  href="https://github.com/w3c/did"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                >
                  DIDs
                </a>
                , with the private key always stored locally on device.
              </p>
            </div>

            {/* Feature 4 — Sync */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">P2P Sync</h3>
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

            {/* Feature 5 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <Package className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Offline Installer</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Bundled dependencies run in a self contained environment without modifying your system, with a fully offline installer available for secure and air gapped installations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10 text-foreground">
                  <FileCode className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <h3 className="text-base lg:text-lg font-semibold text-foreground">Tilekit SDK</h3>
              </div>
              <p className="text-sm lg:text-base text-black/60 dark:text-[#B3B3B3] leading-relaxed">
                Customize local models and agent experiences within Tiles. Built in Rust, based on open-source specifications such as Modelfile and Open Responses API.
              </p>
            </div>

          </div>

          <section className="border-t border-black/10 pt-10 pb-10 dark:border-white/10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
            <div className="min-w-0 space-y-4 sm:space-y-5">
              <div className="max-w-2xl space-y-2">
                <h2 className={sectionHeadingClass}>
                  What makes Tiles different
                </h2>
                <p className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base">
                  Our approach combines best-in-class privacy-focused engineering with unmatched consumer convenience. See how Tiles compares to other local-first AI assistants.
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
                        Osaurus
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label}>
                        <th className="border-b border-black/10 py-3 pr-4 text-sm font-medium text-foreground dark:border-white/10">
                          {row.label}
                        </th>
                        {[row.tiles, row.ollama, row.lmStudio, row.jan, row.osaurus].map((status, index) => (
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
              </div>
            </div>
          </section>

          <section
            className="border-t border-black/10 pt-10 pb-10 dark:border-white/10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14"
            aria-labelledby="home-security-faq-heading"
          >
            <div className="min-w-0 space-y-4 sm:space-y-5">
              <div className="max-w-2xl space-y-2">
                <h2
                  id="home-security-faq-heading"
                  className={sectionHeadingClass}
                >
                  Frequently asked questions
                </h2>
                <p className="text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base">
                  Short answers drawn from our{" "}
                  <Link
                    href="/book/security"
                    className="font-medium text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                  >
                    security documentation
                  </Link>
                  . For full context and limits, read that page.
                </p>
              </div>
              <BookFaq omitHeading className="mt-0">
              <BookFaqItem question="What does local-first mean for Tiles?">
                <p>
                  Tiles is designed so the default experience runs on-device. The local server binds to{" "}
                  <code>localhost</code>, which limits exposed network surface during normal use. Configuration and
                  application data live in standard local directories, and you can change the user data path when
                  needed.
                </p>
              </BookFaqItem>
              <BookFaqItem question="Are chat and account databases stored as plain SQLite files?">
                <p>
                  No. Application state is persisted locally with encryption at rest. The Rust build uses
                  SQLCipher-enabled SQLite, and database connections use a passkey from secure storage. That raises the
                  bar against casual inspection of copied files, though it does not remove all local risk.
                </p>
              </BookFaqItem>
              <BookFaqItem question="How does Tiles handle identity and secret material?">
                <p>
                  Public identity is separated from private keys. Device and account identity use{" "}
                  <code>did:key</code> identifiers from Ed25519 keys. Private keys and database passkeys are stored in
                  the operating system’s secure credential store, not in plaintext app configuration files.
                </p>
              </BookFaqItem>
              <BookFaqItem question="How does device linking and chat sync work?">
                <p>
                  Peer-to-peer linking is user-mediated, not automatic. One device shows a ticket or local code; the
                  other enters it and explicitly accepts or rejects. In release builds, endpoints derive from your stored
                  secret key, and peer identity is checked against the delivered public key. Sync includes defensive
                  controls, including a maximum size cap for downloaded deltas before they are applied.
                </p>
                <p>
                  Sync uses{" "}
                  <a
                    href="https://www.iroh.computer/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Iroh
                  </a>{" "}
                  for device-to-device networking. When a direct path is not practical, Iroh&apos;s public relays can help
                  establish the connection; we list that relay use on our{" "}
                  <Link href="/sub-processors">sub-processors</Link>{" "}
                  page.
                </p>
              </BookFaqItem>
              <BookFaqItem question="Does Tiles include product analytics, and what is logged locally?">
                <p>
                  The product does not currently bundle obvious analytics SDKs such as Sentry, PostHog, Segment,
                  Mixpanel, or similar telemetry. There is still local logging: the Python server may log request
                  metadata and bodies to files under the Tiles data directory, so prompt content can appear in local
                  logs unless logging changes.
                </p>
              </BookFaqItem>
              <BookFaqItem question="How do updates, signing, and bundled dependencies relate to trust?">
                <p>
                  Updates can check GitHub releases and install via the hosted installer script, which depends on
                  release and hosting integrity rather than a stronger built-in end-user verification workflow.
                  Dependencies are pinned and reviewed. The macOS package is code signed, notarized, and stapled. Bundled
                  dependencies are self-contained so normal installation and use do not require live package downloads
                  from the internet.
                </p>
              </BookFaqItem>
              <BookFaqItem question="How do I report a security vulnerability?">
                <p>
                  Use the published security policy and private disclosure path. Researchers can use GitHub Security
                  Advisories or email{" "}
                  <a href="mailto:security@tiles.run">security@tiles.run</a>, with expectations for acknowledgement,
                  triage, and coordinated disclosure. See{" "}
                  <a
                    href="https://github.com/tilesprivacy/tiles/blob/main/SECURITY.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SECURITY.md
                  </a>
                  .
                </p>
              </BookFaqItem>
            </BookFaq>
            </div>
          </section>

          <section className="border-t border-black/10 pt-10 pb-12 dark:border-white/10 sm:pt-12 sm:pb-14 lg:pt-14 lg:pb-16" aria-labelledby="recent-highlights-heading">
            <div className="space-y-4">
              <h2 id="recent-highlights-heading" className="text-[2rem] font-semibold tracking-tight text-foreground sm:text-[2.15rem]">
                Recent highlights
              </h2>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
                {highlightCards.map((card) => (
                  (() => {
                    const author = getPersonById(card.authorId)
                    const authorLabel = author ? splitPersonDisplayName(author.name).nameWithoutHandle : "Tiles Team"
                    const readTime = highlightReadTimes[card.slug] ?? "min read"

                    return (
                      <Link
                        key={card.href}
                        href={card.href}
                        className="group min-h-[7rem] rounded-sm border border-black/[0.07] bg-black/[0.025] p-3 transition-colors hover:bg-black/[0.04] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
                      >
                        <p className="text-[0.78rem] text-black/45 dark:text-[#8A8A8A]">{card.meta}</p>
                        <p className="mt-1.5 text-[1.02rem] font-medium leading-snug text-foreground">{card.title}</p>
                        <div className="mt-3.5 inline-flex items-center gap-1.5 text-[0.96rem] text-black/60 transition-colors group-hover:text-black/70 dark:text-[#B3B3B3] dark:group-hover:text-[#D0D0D0]">
                          {author && (
                            <PersonAvatar
                              name={author.name}
                              links={author.links}
                              variant="blog"
                              className="inline-flex shrink-0"
                            />
                          )}
                          <span>{authorLabel}</span>
                          <span aria-hidden>.</span>
                          <span>{readTime}</span>
                        </div>
                      </Link>
                    )
                  })()
                ))}
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center text-base font-medium text-black/65 underline decoration-current underline-offset-4 transition-colors hover:text-black dark:text-[#B3B3B3] dark:hover:text-[#E6E6E6]"
              >
                View all blog posts -&gt;
              </Link>
            </div>
          </section>

        </div>
      </main>

      {mobileDownloadPrompt}
      <SiteFooter />
    </div>
  )
}
