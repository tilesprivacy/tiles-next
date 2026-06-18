'use client'

import Link from "next/link"
import { Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { triggerHaptic } from "@/lib/haptics"
import {
  downloadButtonIconMotionClasses,
  downloadButtonLabelMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"
import { DOWNLOAD_TILES_CTA_LABEL } from "@/lib/product-description"

type DownloadTilesCtaSize = "footer" | "hero" | "default"

const sizeClasses: Record<DownloadTilesCtaSize, string> = {
  footer:
    "h-9 px-5 text-[0.83rem] sm:h-10 sm:px-5 sm:text-sm lg:h-10 lg:px-6 lg:text-[0.91rem]",
  hero: "h-11 px-5 text-[0.9rem] sm:h-11 sm:px-5 sm:text-[0.94rem] lg:h-11 lg:px-6 lg:text-[0.95rem]",
  default: "h-10 px-5 text-sm",
}

const iconSizeClasses: Record<DownloadTilesCtaSize, string> = {
  footer: "h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4",
  hero: "h-4 w-4",
  default: "h-4 w-4",
}

const baseClasses = [
  "group inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium",
  "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  themeAwareHeaderPrimaryCtaClasses,
  downloadButtonMotionClasses,
].join(" ")

export function DownloadTilesCta({
  size = "default",
  className,
  href = "/download",
}: {
  size?: DownloadTilesCtaSize
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        triggerHaptic()
      }}
      className={cn(baseClasses, sizeClasses[size], className)}
      data-slot="button"
    >
      <span className={downloadButtonLabelMotionClasses}>{DOWNLOAD_TILES_CTA_LABEL}</span>
      <Download
        className={cn(
          "download-cta-icon shrink-0",
          iconSizeClasses[size],
          downloadButtonIconMotionClasses,
        )}
        aria-hidden
      />
    </Link>
  )
}
