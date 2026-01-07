'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function BookLogo() {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use resolvedTheme if available, otherwise determine from theme/systemTheme
  const currentTheme = resolvedTheme || (theme === 'system' ? systemTheme : theme)
  const isDark = currentTheme === 'dark'

  // Show light theme logo during SSR to avoid hydration mismatch
  // This matches the default light theme
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Image
          src="/light.png"
          alt="Tiles"
          width={120}
          height={40}
          className="h-6 w-auto sm:h-8"
          priority
        />
        <span className="hidden sm:inline text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">Book</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Image
        src={isDark ? '/dark.jpeg' : '/light.png'}
        alt="Tiles"
        width={120}
        height={40}
        className="h-6 w-auto sm:h-8"
        priority
      />
      <span className="hidden sm:inline text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">Tiles Book</span>
    </div>
  )
}

