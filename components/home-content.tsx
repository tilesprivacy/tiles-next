"use client"

import Image from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { triggerHaptic } from "@/lib/haptics"
import {
  downloadButtonIconMotionClasses,
  downloadButtonLabelMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"

export function HomeContent() {
  const alphaPillClass =
    "inline-flex items-center rounded-full border border-black/15 bg-black/[0.03] px-1.5 py-0.5 text-[0.62rem] tracking-[0.12em] text-black/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-[#B9B9B9] sm:text-[0.66rem]"

  return (
    <div className="relative isolate bg-background">
      <div className="pointer-events-none absolute inset-0 h-[100dvh]">
        <div className="absolute left-1/2 top-[18%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-black/[0.035] blur-3xl dark:bg-white/[0.05] sm:h-[24rem] sm:w-[24rem] lg:left-[62%] lg:top-[28%] lg:h-[30rem] lg:w-[30rem] lg:translate-x-0" />
        <div className="absolute bottom-[-12%] left-[-6%] h-[12rem] w-[12rem] rounded-full bg-black/[0.03] blur-3xl dark:bg-white/[0.03] sm:h-[16rem] sm:w-[16rem]" />
      </div>

      <main className="flex min-h-[100dvh] px-4 pb-12 pt-[calc(2rem+env(safe-area-inset-top,0px))] min-[390px]:px-5 sm:px-6 sm:pb-8 sm:pt-[calc(2.5rem+env(safe-area-inset-top,0px))] lg:px-12 lg:pt-[calc(3rem+env(safe-area-inset-top,0px))] lg:pb-10">
        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center">
          <div className="grid w-full items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-6 xl:gap-10">
            <div className="relative z-10 flex max-w-[29rem] flex-col items-center gap-5 text-center lg:max-w-[27rem] lg:items-start lg:gap-6 lg:text-left">
              <div className="space-y-2.5 lg:space-y-3">
                <h1 className="max-w-[18ch] text-balance font-sans text-[1.95rem] font-semibold leading-[0.98] tracking-[-0.048em] text-foreground sm:text-[2.4rem] lg:max-w-[15ch] lg:text-[3.2rem]">
                  Private and secure AI assistant for everyday use
                </h1>
                <p className="mx-auto max-w-[31rem] text-[0.91rem] leading-[1.65] text-black/55 dark:text-[#ABABAB] sm:text-[0.94rem] lg:mx-0 lg:max-w-[25rem] lg:text-[0.97rem]">
                  Runs locally by default with optional peer-to-peer sync. Built as a fully user-supported,
                  independent open-source project, based on open standards and decentralized technologies.
                </p>
              </div>

              <div className="flex w-full flex-col items-center gap-3 lg:items-start">
                <div className="inline-flex w-fit flex-col items-center gap-2 lg:items-start">
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
                  <p className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap text-[0.65rem] font-medium text-black/48 dark:text-[#9A9A9A] sm:text-[0.68rem]">
                    <span className="hidden items-center gap-1.5 lg:inline-flex">
                      <span className={alphaPillClass}>ALPHA</span>
                      <span>for macOS 14+ (arm64)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 lg:hidden">
                      <span>Currently available in</span>
                      <span className={alphaPillClass}>ALPHA</span>
                    </span>
                  </p>
                </div>

                <Link
                  href="/book/overview"
                  className="group inline-flex items-center gap-1 text-[0.79rem] font-medium text-black/50 transition-colors hover:text-black/70 dark:text-[#8F8F95] dark:hover:text-[#A8A8A8] sm:text-[0.81rem]"
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
              </div>
            </div>

            <div className="relative flex w-full items-center justify-center lg:justify-end">
              <div className="relative mx-auto w-full max-w-[18.5rem] min-[360px]:max-w-[21rem] min-[430px]:max-w-[24rem] sm:max-w-[28rem] lg:mx-0 lg:max-w-[40rem] lg:translate-x-4 xl:max-w-[42rem]">
                <Image
                  src="/wireframe.webp"
                  alt="Tiles Interface Wireframe"
                  width={800}
                  height={600}
                  className="h-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_28px_80px_rgba(0,0,0,0.42)]"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[8%] sm:px-[9%]">
                  <Image
                    src="/tiles_banner_outline_blk.svg"
                    alt="Tiles"
                    width={1200}
                    height={220}
                    className="h-auto w-full max-w-[14.5rem] min-[360px]:max-w-[15.8rem] sm:max-w-[18.5rem] lg:max-w-[24.5rem] lg:-translate-y-1 dark:hidden"
                  />
                  <Image
                    src="/tiles_banner_outline_wht.svg"
                    alt="Tiles"
                    width={1200}
                    height={220}
                    className="hidden h-auto w-full max-w-[14.5rem] min-[360px]:max-w-[15.8rem] sm:max-w-[18.5rem] lg:max-w-[24.5rem] lg:-translate-y-1 dark:block"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
