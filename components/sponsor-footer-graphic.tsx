"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { isDarkResolvedTheme } from "@/lib/site-theme"

export function SponsorFooterGraphic() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const src =
    mounted && isDarkResolvedTheme(resolvedTheme) ? "/razor.png" : "/razordark.png"

  return (
    <div className="minimal-sponsor-footer-graphic">
      <Image
        src={src}
        alt=""
        width={1450}
        height={1085}
        className="minimal-sponsor-footer-graphic-img"
      />
    </div>
  )
}
