'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  className?: string
  iconClassName?: string
  placeholderClassName?: string
}

export function ThemeToggle({ className, iconClassName, placeholderClassName }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={placeholderClassName ?? "h-8 w-8 rounded-full border border-foreground/10"}
        aria-hidden
      />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={
        className ??
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
      }
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className={iconClassName ?? "h-4 w-4"} />
      ) : (
        <Moon className={iconClassName ?? "h-4 w-4"} />
      )}
    </button>
  )
}
