'use client'

import { usePathname } from "next/navigation"
import { MinimalTopbar } from "@/components/minimal-topbar"

interface SiteHeaderProps {
  themeAware?: boolean
}

export function SiteHeader(_: SiteHeaderProps) {
  const pathname = usePathname()
  const hasPageTopbar = pathname === "/" || pathname === "/download" || pathname === "/sponsor"

  if (hasPageTopbar) return null

  return <MinimalTopbar />
}

export default SiteHeader
