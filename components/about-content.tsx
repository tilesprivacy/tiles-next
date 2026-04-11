'use client'

import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"

export function AboutContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
      <div className="flex flex-1 flex-col pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))]">
        <MissionSection title="Get to know Tiles Privacy" className="pb-6 sm:pb-8 lg:pb-10" />
      </div>
      <section
        className="bg-background px-4 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-3 md:px-8 lg:px-12 lg:pb-14 lg:pt-4"
        aria-label="Tiles wordmark"
      >
        <div className="mx-auto flex max-w-6xl justify-center">
          <Image
            src="/tiles_banner_outline_blk.svg"
            alt="Tiles"
            width={1200}
            height={220}
            className="h-auto w-full max-w-lg min-[390px]:max-w-xl sm:max-w-2xl lg:max-w-3xl dark:hidden"
          />
          <Image
            src="/tiles_banner_outline_wht.svg"
            alt="Tiles"
            width={1200}
            height={220}
            className="hidden h-auto w-full max-w-lg min-[390px]:max-w-xl sm:max-w-2xl lg:max-w-3xl dark:block"
          />
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
