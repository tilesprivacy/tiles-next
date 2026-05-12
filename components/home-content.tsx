"use client"

import Image from "next/image"
import Link from "next/link"
import { AtSign, Check, Copy, Download } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { triggerHaptic } from "@/lib/haptics"
import {
  downloadButtonIconMotionClasses,
  downloadButtonLabelMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"

const featureCards = [
  {
    command: "tiles run <modelfile>",
    heading: "Automate your work",
    description: (
      <>
        Native{" "}
        <a
          href="https://pi.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-black/30 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/45 dark:decoration-white/35 dark:hover:text-white/90 dark:hover:decoration-white/55"
        >
          Pi
        </a>{" "}
        agent harness for knowledge work, built around{" "}
        <span className="inline-flex items-center gap-1.5 rounded bg-black/[0.045] px-1.5 py-0.5 align-baseline dark:bg-white/[0.08]">
          <Image src="/openai-logo.svg" alt="OpenAI logo" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono text-[0.95em]">gpt-oss-20b</span>
        </span>{" "}
        powered on-device by{" "}
        <a
          href="https://ml-explore.github.io/mlx/build/html/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-black/30 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/45 dark:decoration-white/35 dark:hover:text-white/90 dark:hover:decoration-white/55"
        >
          MLX
        </a>
        .
      </>
    ),
    ctaLabel: "Run models",
    ctaHref: "/book/manual#run-models-tiles-run",
    terminalLines: [
      "$ tiles run gpt-oss-20b",
      "Starting local model",
      "Loading sessions from data folder",
      "> /help for shortcuts",
    ],
    shareLink: undefined,
  },
  {
    command: "tiles sync <did>",
    heading: "Sync your chats P2P",
    description: (
      <>
        Encrypted peer-to-peer sync for chats across your linked devices, online or on your local network, with{" "}
        <a
          href="https://www.iroh.computer/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-black/30 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/45 dark:decoration-white/35 dark:hover:text-white/90 dark:hover:decoration-white/55"
        >
          Iroh&apos;s
        </a>{" "}
        networking stack.
      </>
    ),
    ctaLabel: "Create your link",
    ctaHref: "https://www.tiles.run/book/manual#peer-to-peer-linking-tiles-link",
    terminalLines: [
      "$ tiles sync did:key:z6Mknxy...YWSmTcZA",
      "Connecting to Iroh relay",
      "Discovering local peers",
      "Sync complete",
    ],
    shareLink: undefined,
  },
  {
    command: "/share",
    heading: "Share chats publicly",
    description: (
      <>
        Create a public link to a chat session, published through{" "}
        <a
          href="https://atproto.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-black/30 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/45 dark:decoration-white/35 dark:hover:text-white/90 dark:hover:decoration-white/55"
        >
          ATProto
        </a>
        .
      </>
    ),
    ctaLabel: "Add ATProto account",
    ctaHref: "https://www.tiles.run/book/manual#atproto-tiles-at",
    terminalLines: [
      "> /share",
      "Writing to ATProto PDS",
      "Creating shareable link",
    ],
    shareLink:
      "/share/YXQ6Ly9kaWQ6cGxjOm1iazZ3Z214aWF0b3R6eTViM3E1N25hdy9ydW4udGlsZXMuc2Vzc2lvbi8zbWtuMm9veG5xeTI3",
  },
] as const

const showTechCircuitBackground = false

function TechCircuitBackground() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 620 460"
      className="absolute right-[-16rem] top-[4.75rem] h-[22rem] w-[30rem] text-black/[0.055] dark:text-white/[0.06] sm:right-[-8rem] sm:top-[4.5rem] sm:h-[28rem] sm:w-[38rem] sm:text-black/[0.07] sm:dark:text-white/[0.075] lg:right-[-5rem] lg:top-[3.5rem] xl:right-[-2rem]"
      fill="none"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4">
        <path d="M20 78H120L154 112H236L268 80H362" />
        <path d="M82 142H198L232 176H362L412 126H548" />
        <path d="M38 232H132L176 188H270L318 236H476L536 176H602" />
        <path d="M128 320H252L312 260H408L462 314H574" />
        <path d="M218 34V112" />
        <path d="M318 236V390" />
        <path d="M460 48V126" />
        <path d="M534 176V286" />
        <path d="M154 112V168" />
        <path d="M412 126V196" />
        <path d="M252 320V410" />
        <path d="M92 86V192H44" />
        <path d="M372 82H446L490 38H586" />
        <path d="M420 364H532L592 424" />
      </g>
      <g fill="currentColor">
        <circle cx="20" cy="78" r="3.5" />
        <circle cx="120" cy="78" r="3.5" />
        <circle cx="362" cy="80" r="3.5" />
        <circle cx="82" cy="142" r="3.5" />
        <circle cx="548" cy="126" r="3.5" />
        <circle cx="38" cy="232" r="3.5" />
        <circle cx="602" cy="176" r="3.5" />
        <circle cx="128" cy="320" r="3.5" />
        <circle cx="574" cy="314" r="3.5" />
        <circle cx="218" cy="34" r="3.5" />
        <circle cx="318" cy="390" r="3.5" />
        <circle cx="460" cy="48" r="3.5" />
        <circle cx="534" cy="286" r="3.5" />
        <circle cx="44" cy="192" r="3.5" />
        <circle cx="586" cy="38" r="3.5" />
        <circle cx="592" cy="424" r="3.5" />
        <rect x="284" y="206" width="18" height="18" rx="2" />
        <rect x="498" y="154" width="16" height="16" rx="2" />
        <rect x="170" y="296" width="15" height="15" rx="2" />
        <rect x="382" y="102" width="12" height="12" rx="2" />
      </g>
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.1">
        <path d="M34 116H72" />
        <path d="M34 128H72" />
        <path d="M34 140H72" />
        <path d="M474 212H520" />
        <path d="M474 224H520" />
        <path d="M474 236H520" />
        <path d="M214 356H270" />
        <path d="M214 368H270" />
        <path d="M214 380H270" />
      </g>
    </svg>
  )
}

export function HomeContent() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const handleCopyCommand = (command: string) => {
    if (typeof window === "undefined") return

    if (navigator?.clipboard?.writeText) {
      void navigator.clipboard.writeText(command).then(() => {
        triggerHaptic()
        setCopiedCommand(command)
        window.setTimeout(() => setCopiedCommand((value) => (value === command ? null : value)), 1400)
      })
      return
    }

    const textArea = document.createElement("textarea")
    textArea.value = command
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    triggerHaptic()
    setCopiedCommand(command)
    window.setTimeout(() => setCopiedCommand((value) => (value === command ? null : value)), 1400)
  }

  return (
    <div className="relative isolate bg-background">
      <div className="pointer-events-none absolute inset-0 h-[100svh] sm:h-[100dvh]">
        {showTechCircuitBackground ? <TechCircuitBackground /> : null}
        <div className="absolute left-1/2 top-[18%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-black/[0.035] blur-3xl dark:bg-transparent sm:h-[24rem] sm:w-[24rem] lg:left-[62%] lg:top-[28%] lg:h-[30rem] lg:w-[30rem] lg:translate-x-0" />
        <div className="absolute bottom-[-12%] left-[-6%] h-[12rem] w-[12rem] rounded-full bg-black/[0.03] blur-3xl dark:bg-transparent sm:h-[16rem] sm:w-[16rem]" />
      </div>

      <main className="flex min-h-[100svh] px-4 pb-14 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] min-[390px]:px-5 min-[430px]:min-h-[calc(100svh-4.5rem)] min-[430px]:pb-8 min-[430px]:pt-[calc(10rem+env(safe-area-inset-top,0px))] sm:min-h-[100dvh] sm:px-6 sm:pb-14 sm:pt-[calc(9.5rem+env(safe-area-inset-top,0px))] lg:min-h-[calc(100dvh-9rem)] lg:px-12 lg:pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pb-9">
        <div className="mx-auto flex w-full max-w-6xl flex-1 items-start lg:items-center">
          <div className="grid w-full items-center gap-9 sm:gap-12 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-11 xl:gap-14">
            <div className="relative z-10 mx-auto flex max-w-[29rem] flex-col items-center gap-5 text-center sm:gap-6 lg:mx-0 lg:max-w-[28rem] lg:items-start lg:gap-6 lg:text-left">
              <div className="mx-auto w-[88%] max-w-[26rem] space-y-3.5 lg:mx-0 lg:w-full lg:space-y-4">
                <h1 className="mx-auto max-w-[17ch] text-balance font-sans text-[clamp(2.3rem,7.2vw,3.85rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-foreground lg:mx-0 lg:max-w-[15ch]">
                  <span className="block lg:hidden">Local-first private</span>
                  <span className="block lg:hidden">AI assistant</span>
                  <span className="hidden lg:block">Local-first private AI assistant</span>
                </h1>
                <p className="mx-auto max-w-[31rem] text-[0.93rem] leading-[1.62] text-black/55 dark:text-[#ABABAB] sm:text-[1rem] lg:mx-0 lg:max-w-[26rem] lg:text-[1.01rem]">
                  Runs on-device models with encrypted P2P sync, keeping your data and identity local, and supports
                  sharing chats publicly on{" "}
                  <a
                    href="https://atproto.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-black/30 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/45 dark:decoration-white/35 dark:hover:text-white/90 dark:hover:decoration-white/55"
                  >
                    ATProto
                  </a>
                  . Fully open source.
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-5 lg:items-start lg:gap-5">
                <div className="inline-flex w-fit flex-col items-center gap-3.5 lg:items-start">
                  <Button
                    asChild
                    variant="ghost"
                    className={`h-9 w-fit rounded-sm ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses} px-5 text-[0.83rem] font-medium sm:h-10 sm:px-5 sm:text-sm lg:h-10 lg:px-6 lg:text-[0.91rem]`}
                  >
                    <Link
                      href="/download"
                      onClick={() => {
                        triggerHaptic()
                      }}
                      className="group flex items-center gap-2"
                    >
                      <span className={downloadButtonLabelMotionClasses}>
                        Download Tiles
                      </span>
                      <Download
                        className={`h-3.5 w-3.5 ${downloadButtonIconMotionClasses} sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4`}
                        aria-hidden
                      />
                    </Link>
                  </Button>
                  <p className="inline-flex w-fit items-center whitespace-nowrap text-[0.67rem] font-medium text-black/48 dark:text-[#9A9A9A] sm:text-[0.72rem]">
                    Alpha • macOS 14+ • Apple Silicon (M1+)
                  </p>
                  <Link
                    href="/linux"
                    className="text-[0.74rem] font-medium text-black/58 underline decoration-black/25 underline-offset-4 transition-colors hover:text-black/78 hover:decoration-black/45 dark:text-[#A4A4A4] dark:decoration-white/25 dark:hover:text-white/85 dark:hover:decoration-white/45 sm:text-[0.8rem]"
                  >
                    Get notified for Linux
                  </Link>
                  <Link
                    href="/book/overview#private-ai-comparison"
                    className="text-[0.74rem] font-medium text-black/54 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black/74 hover:decoration-black/40 dark:text-[#9D9D9D] dark:decoration-white/20 dark:hover:text-white/82 dark:hover:decoration-white/40 sm:text-[0.8rem]"
                  >
                    See how Tiles compares to Ollama and others →
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative flex w-full items-center justify-center lg:justify-end">
              <div className="relative mx-auto w-full max-w-[22rem] min-[360px]:max-w-[25rem] min-[430px]:max-w-[29rem] sm:max-w-[32rem] lg:mx-0 lg:max-w-[37.5rem] xl:max-w-[39rem]">
                <Image
                  src="/wireframe.webp"
                  alt="Tiles Interface Wireframe"
                  width={800}
                  height={600}
                  className="h-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.12)] dark:drop-shadow-none"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[8%] sm:px-[9%]">
                  <Image
                    src="/tiles_banner_outline_blk.svg"
                    alt="Tiles"
                    width={1200}
                    height={220}
                    className="h-auto w-full max-w-[12.75rem] min-[360px]:max-w-[13.9rem] sm:max-w-[16.25rem] lg:max-w-[20.75rem] lg:-translate-y-1 dark:hidden"
                  />
                  <Image
                    src="/tiles_banner_outline_wht.svg"
                    alt="Tiles"
                    width={1200}
                    height={220}
                    className="hidden h-auto w-full max-w-[12.75rem] min-[360px]:max-w-[13.9rem] sm:max-w-[16.25rem] lg:max-w-[20.75rem] lg:-translate-y-1 dark:block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="relative z-10 px-4 pb-12 min-[390px]:px-5 sm:px-6 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="mx-auto w-full max-w-6xl space-y-20 sm:space-y-16 lg:space-y-20">
          {featureCards.map((card) => (
            <article
              key={card.command}
              className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-12"
            >
              <div className="space-y-5">
                <div className="space-y-3.5">
                  <h2 className="text-balance text-[clamp(1.85rem,5.4vw,2.7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                    {card.heading}
                  </h2>
                  <p className="max-w-[32rem] text-[1rem] leading-[1.55] text-black/62 dark:text-[#B1B1B1]">
                    {card.description}
                  </p>
                </div>

                <div className="inline-flex w-full max-w-[29rem] items-center justify-between rounded-xl border border-black/6 bg-black/[0.035] px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <code className="truncate font-mono text-[0.95rem] text-black/78 dark:text-[#DADADA]">{card.command}</code>
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(card.command)}
                    aria-label={copiedCommand === card.command ? "Command copied" : `Copy command ${card.command}`}
                    className="ml-3 inline-flex items-center justify-center text-black/35 transition-colors hover:text-black/55 dark:text-[#8F8F8F] dark:hover:text-[#B8B8B8]"
                  >
                    {copiedCommand === card.command ? (
                      <Check className="h-4 w-4" aria-hidden />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
                <Link
                  href={card.ctaHref}
                  className="inline-flex items-center text-[0.95rem] text-black/50 underline decoration-black/30 underline-offset-4 transition-colors hover:text-black/70 hover:decoration-black/45 dark:text-[#A4A4A4] dark:decoration-white/30 dark:hover:text-[#C0C0C0] dark:hover:decoration-white/45"
                >
                  {card.ctaLabel} →
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-black/8 bg-background dark:border-white/10">
                  <div className="flex h-10 items-center gap-2 px-3.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/85" aria-hidden />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/85" aria-hidden />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/85" aria-hidden />
                  </div>
                  <div className="space-y-1 px-4 py-4 sm:px-5 sm:py-5">
                    {card.terminalLines.map((line) => (
                      <p key={line} className="font-mono text-[0.88rem] leading-[1.55] text-black/40 dark:text-[#AAAAAA]">
                        {line}
                      </p>
                    ))}
                    {card.shareLink ? (
                      <p className="font-mono text-[0.88rem] leading-[1.55] text-black/40 dark:text-[#AAAAAA]">
                        <a
                          href={card.shareLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/60 hover:decoration-black/40 dark:decoration-white/25 dark:hover:text-[#C4C4C4] dark:hover:decoration-white/40"
                        >
                          <span className="sm:hidden">tiles.run/share/…xeTI3</span>
                          <span className="hidden sm:inline">tiles.run/share/YXQ6…xeTI3</span>
                        </a>{" "}
                        copied to clipboard
                      </p>
                    ) : null}
                  </div>
                </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16 pt-3 min-[390px]:px-5 sm:px-6 sm:pb-20 lg:px-12 lg:pb-24">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-12 py-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_10rem] lg:gap-3 lg:py-5">
          <div className="space-y-5 lg:max-w-[52rem] lg:pl-1">
            <h2 className="max-w-[24ch] text-balance text-[clamp(1.85rem,5.4vw,2.7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
              Built on Atmosphere
            </h2>
            <ul className="max-w-[42rem] space-y-4">
              <li className="flex items-center gap-2.5 text-[1.02rem] leading-[1.52] text-black/68 dark:text-[#B7B7B7]">
                <Check className="h-3.5 w-3.5 shrink-0 text-black/33 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
                <span>You control who hosts your Personal Data Server (PDS).</span>
              </li>
              <li className="flex items-center gap-2.5 text-[1.02rem] leading-[1.52] text-black/68 dark:text-[#B7B7B7]">
                <Check className="h-3.5 w-3.5 shrink-0 text-black/33 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
                <span>Apps connect to you, not the other way around</span>
              </li>
              <li className="flex items-center gap-2.5 text-[1.02rem] leading-[1.52] text-black/68 dark:text-[#B7B7B7]">
                <Check className="h-3.5 w-3.5 shrink-0 text-black/33 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
                <span>No starting over when apps change or disappear</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-center lg:-ml-[15rem] lg:mt-2 lg:justify-start" aria-hidden>
            <AtSign
              className="h-48 w-48 text-black dark:text-white sm:h-52 sm:w-52 lg:h-44 lg:w-44"
              strokeWidth={1.05}
              style={{ opacity: 0.12 }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
