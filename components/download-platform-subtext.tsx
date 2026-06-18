import { FaApple, FaLinux } from "react-icons/fa6"
import {
  DOWNLOAD_PLATFORM_LINUX_LABEL,
  DOWNLOAD_PLATFORM_MACOS_LABEL,
} from "@/lib/product-description"

type DownloadPlatformSubtextSize = "hero" | "footer"

const sizeClasses: Record<DownloadPlatformSubtextSize, string> = {
  hero: "text-[0.79rem] sm:text-[0.83rem]",
  footer: "text-[0.74rem] sm:text-[0.79rem]",
}

const iconClasses: Record<DownloadPlatformSubtextSize, string> = {
  hero: "h-3.5 w-3.5",
  footer: "h-3 w-3 sm:h-3.5 sm:w-3.5",
}

export function DownloadPlatformSubtext({
  size = "hero",
  className = "",
}: {
  size?: DownloadPlatformSubtextSize
  className?: string
}) {
  const textClass = `font-medium text-black/48 dark:text-[#9A9A9A] ${sizeClasses[size]}`
  const platformClass = `inline-flex items-center gap-1.5 ${textClass}`

  return (
    <div
      className={`flex w-fit max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center lg:justify-start lg:text-left ${className}`.trim()}
      aria-label={`${DOWNLOAD_PLATFORM_MACOS_LABEL} and ${DOWNLOAD_PLATFORM_LINUX_LABEL}`}
    >
      <span className={platformClass}>
        <FaApple className={`${iconClasses[size]} shrink-0`} aria-hidden />
        {DOWNLOAD_PLATFORM_MACOS_LABEL}
      </span>
      <span className={platformClass}>
        <FaLinux className={`${iconClasses[size]} shrink-0`} aria-hidden />
        {DOWNLOAD_PLATFORM_LINUX_LABEL}
      </span>
    </div>
  )
}
