"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Copy, Download, Key } from "lucide-react"
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
        agent harness for knowledge work and coding, powered on-device by{" "}
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
  },
  {
    command: "/share",
    heading: "Share chats publicly on ATProto",
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
      "Link copied to clipboard",
    ],
  },
] as const

export function HomeContent() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const alphaPillClass =
    "inline-flex items-center rounded-full border border-black/15 bg-black/[0.03] px-1.5 py-0.5 text-[0.62rem] tracking-[0.12em] text-black/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-[#B9B9B9] sm:text-[0.66rem]"

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
        <div className="absolute left-1/2 top-[18%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-black/[0.035] blur-3xl dark:bg-transparent sm:h-[24rem] sm:w-[24rem] lg:left-[62%] lg:top-[28%] lg:h-[30rem] lg:w-[30rem] lg:translate-x-0" />
        <div className="absolute bottom-[-12%] left-[-6%] h-[12rem] w-[12rem] rounded-full bg-black/[0.03] blur-3xl dark:bg-transparent sm:h-[16rem] sm:w-[16rem]" />
      </div>

      <main className="flex min-h-[100svh] px-4 pb-14 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] min-[390px]:px-5 sm:min-h-[100dvh] sm:px-6 sm:pb-14 sm:pt-[calc(9.5rem+env(safe-area-inset-top,0px))] lg:min-h-[calc(100dvh-9rem)] lg:px-12 lg:pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pb-7">
        <div className="mx-auto flex w-full max-w-6xl flex-1 items-start lg:items-center">
          <div className="grid w-full items-center gap-10 sm:gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8 xl:gap-12">
            <div className="relative z-10 mx-auto flex max-w-[29rem] flex-col items-center gap-5 text-center sm:gap-7 lg:mx-0 lg:max-w-[28rem] lg:items-start lg:gap-6 lg:text-left">
              <div className="space-y-3.5 lg:space-y-4">
                <h1 className="mx-auto max-w-[18ch] text-balance font-sans text-[1.92rem] font-semibold leading-[1.03] tracking-[-0.035em] text-foreground sm:text-[2.5rem] lg:mx-0 lg:max-w-[15ch] lg:text-[3.25rem]">
                  Local-first private AI assistant for everyday use
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
                  .
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-4 lg:items-start lg:gap-4">
                <div className="inline-flex w-fit flex-col items-center gap-2.5 lg:items-start">
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
                        Download for macOS
                      </span>
                      <Download
                        className={`h-3.5 w-3.5 ${downloadButtonIconMotionClasses} sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4`}
                        aria-hidden
                      />
                    </Link>
                  </Button>
                  <p className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap text-[0.67rem] font-medium text-black/48 dark:text-[#9A9A9A] sm:text-[0.72rem]">
                    <span>Currently available as a CLI in</span>
                    <span className={alphaPillClass}>ALPHA</span>
                  </p>
                  <Link
                    href="/linux"
                    className="text-[0.74rem] font-medium text-black/58 underline decoration-black/25 underline-offset-4 transition-colors hover:text-black/78 hover:decoration-black/45 dark:text-[#A4A4A4] dark:decoration-white/25 dark:hover:text-white/85 dark:hover:decoration-white/45 sm:text-[0.8rem]"
                  >
                    Get notified for Linux
                  </Link>
                </div>

                <div className="inline-flex items-center gap-3">
                  <Link
                    href="/book/overview"
                    className="group inline-flex items-center gap-1 text-[0.79rem] font-medium text-black/50 transition-colors hover:text-black/70 dark:text-[#8F8F95] dark:hover:text-[#A8A8A8] sm:text-[0.85rem]"
                  >
                    <span>Learn More</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    >
                      <path d="M6 12L10 8L6 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <span className="h-3 w-px bg-black/12 dark:bg-white/16" aria-hidden />
                  <a
                    href="https://github.com/tilesprivacy/tiles"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-[0.79rem] font-medium text-black/50 transition-colors hover:text-black/70 dark:text-[#8F8F95] dark:hover:text-[#A8A8A8] sm:text-[0.85rem]"
                  >
                    <span>GitHub</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    >
                      <path d="M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10.5 5.5L4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="relative flex w-full items-center justify-center lg:justify-end">
              <div className="relative mx-auto w-full max-w-[22rem] min-[360px]:max-w-[25rem] min-[430px]:max-w-[29rem] sm:max-w-[32rem] lg:mx-0 lg:max-w-[38.5rem] lg:translate-x-2 xl:max-w-[40rem]">
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
                  <h2 className="text-balance text-[2.1rem] font-semibold leading-[1.03] tracking-[-0.03em] text-foreground sm:text-[2.35rem] lg:text-[2.75rem]">
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
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-4 pb-16 pt-3 min-[390px]:px-5 sm:px-6 sm:pb-20 lg:px-12 lg:pb-24">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-12 py-4 sm:py-6 lg:grid-cols-[minmax(0,1fr)_10rem] lg:gap-3 lg:py-5">
          <div className="space-y-5 lg:max-w-[52rem] lg:pl-1">
            <h2 className="max-w-[24ch] text-balance text-[2.1rem] font-semibold leading-[1.03] tracking-[-0.03em] text-foreground sm:text-[2.35rem] lg:text-[2.75rem]">
              Private by design
            </h2>
            <ul className="max-w-[42rem] space-y-4">
              <li className="flex items-center gap-2.5 text-[1.02rem] leading-[1.52] text-black/68 dark:text-[#B7B7B7]">
                <Check className="h-3.5 w-3.5 shrink-0 text-black/33 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
                <span>Runs entirely offline</span>
              </li>
              <li className="flex items-center gap-2.5 text-[1.02rem] leading-[1.52] text-black/68 dark:text-[#B7B7B7]">
                <Check className="h-3.5 w-3.5 shrink-0 text-black/33 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
                <span>Your identity and data are portable and user-owned</span>
              </li>
              <li className="flex items-center gap-2.5 text-[1.02rem] leading-[1.52] text-black/68 dark:text-[#B7B7B7]">
                <Check className="h-3.5 w-3.5 shrink-0 text-black/33 dark:text-[#8A8A8A]" strokeWidth={2} aria-hidden />
                <span>Sync across devices securely</span>
              </li>
            </ul>
          </div>

          <div className="mt-3 flex items-center justify-center lg:-ml-12 lg:mt-1 lg:justify-start" aria-hidden>
            <Key className="h-40 w-40 text-black/12 dark:text-white/12 sm:h-44 sm:w-44 lg:h-32 lg:w-32" strokeWidth={1.15} />
          </div>
        </div>
      </section>
    </div>
  )
}
