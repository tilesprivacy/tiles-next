'use client'

import { SiteFooter } from "@/components/site-footer"
import { MissionSection } from "@/components/mission-section"

export function MissionContent() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background lg:overflow-visible">
      <div className="flex flex-1 flex-col pt-16 lg:pt-24 lg:pb-24">
        <MissionSection title="Mission" />
      </div>
      <SiteFooter />
    </div>
  )
}
