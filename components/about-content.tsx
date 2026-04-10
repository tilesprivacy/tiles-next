'use client'

import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"

export function AboutContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
      <div className="flex flex-1 flex-col pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))] lg:pb-24">
        <MissionSection title="Get to know Tiles Privacy" />
      </div>
      <SiteFooter />
    </div>
  )
}
