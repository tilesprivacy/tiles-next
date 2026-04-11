'use client'

import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"

export function AboutContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
      <div className="flex flex-1 flex-col pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] lg:pb-24">
        <MissionSection title="Get to know Tiles Privacy" />
      </div>
      <div
        className="w-full border-t border-black/[0.06] bg-background px-4 py-10 dark:border-white/[0.06] sm:px-6 md:px-8 lg:px-12 lg:py-14"
        aria-hidden
      >
        <div className="mx-auto flex max-w-7xl justify-center">
          <Image
            src="/tiles_banner_outline_blk.svg"
            alt=""
            width={1200}
            height={220}
            className="h-auto w-full max-w-md min-[390px]:max-w-lg sm:max-w-xl dark:hidden"
          />
          <Image
            src="/tiles_banner_outline_wht.svg"
            alt=""
            width={1200}
            height={220}
            className="hidden h-auto w-full max-w-md min-[390px]:max-w-lg sm:max-w-xl dark:block"
          />
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
