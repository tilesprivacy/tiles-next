'use client'

import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { FaGithub } from "react-icons/fa6"

interface AboutContentProps {
  sponsorsGoal: {
    goalAmountMonthly: string | null
    progressPercent: string | null
  }
}

export function AboutContent({ sponsorsGoal }: AboutContentProps) {
  const goalLine = sponsorsGoal.goalAmountMonthly
    ? `${sponsorsGoal.progressPercent ? `${sponsorsGoal.progressPercent} toward ` : ""}${sponsorsGoal.goalAmountMonthly} goal`
    : "Monthly goal updates are published on GitHub Sponsors"
  const progressValue = sponsorsGoal.progressPercent
    ? Math.max(0, Math.min(100, Number.parseInt(sponsorsGoal.progressPercent, 10)))
    : null

  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
      <div className="flex flex-1 flex-col pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))]">
        <section className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 sm:pb-8 lg:px-12 lg:pb-10">
          <div className="rounded-2xl border border-black/5 bg-black/[0.035] px-4 py-5 dark:border-white/5 dark:bg-white/[0.06] sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 sm:gap-5">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Support Tiles via GitHub Sponsors
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-black/65 dark:text-[#B3B3B3]">
                Tiles is independently built and fully user-supported. Early development is bootstrapped through GitHub
                Sponsors, with plans to sustain the project long term through licensing. We are a small team of two
                working to bring privacy technology to everyone with a focus on convenience and ease of use. If you
                find Tiles useful, consider supporting our work. Contributions directly fund development, help keep both
                developers fed, and keep the project moving. Your support means a lot.
              </p>
              <div className="flex w-full max-w-2xl flex-col items-start gap-3 sm:gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-transparent px-2.5 py-1 text-xs font-medium text-black/65 dark:border-white/15 dark:text-[#B3B3B3]">
                  <Heart className="h-3.5 w-3.5" aria-hidden />
                  <span>{goalLine}</span>
                </div>
                {progressValue !== null && (
                  <div className="w-full">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#d96ab0] transition-[width] duration-500"
                        style={{ width: `${progressValue}%` }}
                        aria-hidden
                      />
                    </div>
                  </div>
                )}
                <p className="text-sm leading-relaxed text-black/60 dark:text-[#A8A8A8]">
                  Baseline funding to support two full-time contributors.
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="mt-1 h-10 rounded-2xl border border-black/5 bg-black/[0.045] px-5 text-sm font-medium text-foreground shadow-none transition-colors hover:bg-black/[0.08] dark:border-white/5 dark:bg-white/[0.08] dark:hover:bg-white/[0.14]"
              >
                <a
                  href="https://github.com/sponsors/tilesprivacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <FaGithub className="h-3.5 w-3.5" aria-hidden />
                  <span>Sponsor</span>
                </a>
              </Button>
            </div>
          </div>
        </section>
        <MissionSection title="Get to know Tiles Privacy" className="pb-6 sm:pb-8 lg:pb-10" />
      </div>
      <SiteFooter />
    </div>
  )
}
