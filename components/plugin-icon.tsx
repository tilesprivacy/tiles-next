import Image from "next/image"
import { Package, Youtube } from "lucide-react"

interface PluginIconProps {
  slug: string
  className?: string
}

export function PluginIcon({ slug, className = "h-5 w-5" }: PluginIconProps) {
  if (slug === "caldir") {
    return (
      <>
        <Image src="/caldir-icon-black.png" alt="" width={64} height={64} className={`${className} dark:hidden`} aria-hidden />
        <Image src="/caldir-icon-white.png" alt="" width={64} height={64} className={`hidden ${className} dark:block`} aria-hidden />
      </>
    )
  }

  if (slug === "youtube-transcript") {
    return <Youtube className={className} aria-hidden />
  }

  return <Package className={className} aria-hidden />
}
