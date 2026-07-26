'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { CYBERPUNK_THEME, isDarkResolvedTheme } from '@/lib/site-theme'

interface ThemeSwitcherProps {
  variant?: 'light' | 'dark' | 'auto'
  size?: 'sm' | 'md'
  mode?: 'segmented' | 'toggle'
  tone?: 'default' | 'quiet'
  /** Minimum 44px tap target for footer and other touch-first surfaces. */
  touchFriendly?: boolean
}

type ThemeMode = 'light' | 'dark' | 'cyberpunk'

function SunIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
    </svg>
  )
}

/** Neon bolt for the cyberpunk theme. */
function CyberpunkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M11.25 2a.75.75 0 01.66.39l4.5 8.25A.75.75 0 0115.75 12h-3.038l1.127 5.073a.75.75 0 01-1.348.663l-5.75-8.5A.75.75 0 017.25 8h2.962L9.162 2.927A.75.75 0 0110 2.25h1.25z" />
    </svg>
  )
}

function resolveToggleMode(theme: string | undefined, resolvedTheme: string | undefined): ThemeMode {
  if (theme === CYBERPUNK_THEME || resolvedTheme === CYBERPUNK_THEME) return 'cyberpunk'
  if (resolvedTheme === 'dark') return 'dark'
  return 'light'
}

function nextToggleMode(mode: ThemeMode): ThemeMode {
  if (mode === 'light') return 'dark'
  if (mode === 'dark') return 'cyberpunk'
  return 'light'
}

export function ThemeSwitcher({
  variant = 'auto',
  size = 'sm',
  mode = 'segmented',
  tone = 'default',
  touchFriendly = false,
}: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme, forcedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = isDarkResolvedTheme(resolvedTheme)
  const locked = Boolean(forcedTheme)

  // Determine colors based on variant
  const isLightVariant = variant === 'light' || (variant === 'auto' && !isDark)
  const quiet = tone === 'quiet'
  const bgColor = isLightVariant ? (quiet ? 'bg-black/[0.055]' : 'bg-black/10') : (quiet ? 'bg-white/[0.07]' : 'bg-white/10')
  const activeBg = isLightVariant ? 'bg-black' : 'bg-white'
  const activeText = isLightVariant ? 'text-white' : 'text-black'
  const inactiveText = isLightVariant ? (quiet ? 'text-black/45' : 'text-black/60') : (quiet ? 'text-white/50' : 'text-white/60')
  const hoverText = isLightVariant ? 'hover:text-black' : 'hover:text-white'
  const cyberpunkActive =
    !isLightVariant && (theme === CYBERPUNK_THEME || resolvedTheme === CYBERPUNK_THEME)
      ? 'bg-[var(--sponsor-yellow,#f7ff61)] text-black'
      : null

  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-2.5 py-1 gap-0.5'
    : 'text-sm px-3 py-1.5 gap-1'

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const togglePadding = quiet ? 'p-1' : 'p-1.5'
  const segmentCount = 3

  if (!mounted) {
    const placeholderBg = 'bg-foreground/[0.06]'

    if (mode === 'toggle') {
      const placeholderClass = touchFriendly
        ? `inline-flex h-6 shrink-0 items-center rounded-sm ${placeholderBg}`
        : `inline-flex items-center justify-center rounded-sm ${placeholderBg} ${togglePadding} ${iconSize}`
      return (
        <span aria-hidden="true" className={`${placeholderClass} pointer-events-none`}>
          {touchFriendly ? (
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className={`inline-flex h-5 w-5 items-center justify-center ${iconSize} opacity-0`} />
            </span>
          ) : null}
        </span>
      )
    }
    return (
      <div className={`inline-flex items-center rounded-sm ${placeholderBg} p-1 pointer-events-none`} aria-hidden="true">
        {Array.from({ length: segmentCount }, (_, index) => (
          <span key={index} className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium`}>
            {/* Keep the pre-hydration footprint identical to avoid footer jumps. */}
            <span className={`${iconSize} opacity-0`} />
          </span>
        ))}
      </div>
    )
  }

  if (mode === 'toggle') {
    const effectiveMode = resolveToggleMode(theme, resolvedTheme)
    const nextMode = nextToggleMode(effectiveMode)

    const focusRing = isLightVariant ? 'focus-visible:ring-black/25' : 'focus-visible:ring-white/25'
    const shell = isLightVariant
      ? `${bgColor} ${quiet ? 'text-black/55' : 'text-black/70'} hover:text-black`
      : effectiveMode === 'cyberpunk'
        ? 'bg-[var(--sponsor-yellow,#f7ff61)]/15 text-[var(--sponsor-yellow,#f7ff61)] hover:text-[var(--sponsor-yellow,#f7ff61)]'
        : `${bgColor} ${quiet ? 'text-white/58' : 'text-white/75'} hover:text-white`
    const iconButtonClass = `inline-flex items-center justify-center rounded-sm ${togglePadding} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${focusRing} ${shell}`
    const themeIcon =
      effectiveMode === 'light' ? (
        <SunIcon className={iconSize} />
      ) : effectiveMode === 'dark' ? (
        <MoonIcon className={iconSize} />
      ) : (
        <CyberpunkIcon className={iconSize} />
      )

    const themeLabel = locked
      ? `Theme: ${effectiveMode} (locked on this page)`
      : `Theme: ${effectiveMode}. Click to switch to ${nextMode}.`
    const themeTitle = locked
      ? `Theme: ${effectiveMode.toUpperCase()} (locked)`
      : `Theme: ${effectiveMode.toUpperCase()} (click for ${nextMode.toUpperCase()})`

    if (touchFriendly) {
      const touchIconClass = `inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${focusRing} ${
        isLightVariant
          ? `${quiet ? 'text-black/55' : 'text-black/70'} hover:text-black`
          : effectiveMode === 'cyberpunk'
            ? 'text-[var(--sponsor-yellow,#f7ff61)]'
            : `${quiet ? 'text-white/58' : 'text-white/75'} hover:text-white`
      }`
      const touchShell =
        effectiveMode === 'cyberpunk'
          ? 'bg-[var(--sponsor-yellow,#f7ff61)]/15'
          : bgColor

      return (
        <div className={`inline-flex shrink-0 items-center rounded-sm leading-none ${touchShell} h-6`}>
          <div className="relative flex h-6 w-6 items-center justify-center">
            <button
              type="button"
              onClick={() => {
                if (!locked) setTheme(nextMode)
              }}
              disabled={locked}
              className={`absolute -inset-[calc((2.75rem-1.5rem)/2)] z-[1] inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border-0 bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${focusRing} disabled:cursor-default`}
              aria-label={themeLabel}
              title={themeTitle}
            >
              <span className={touchIconClass}>{themeIcon}</span>
            </button>
          </div>
        </div>
      )
    }

    return (
      <button
        type="button"
        onClick={() => {
          if (!locked) setTheme(nextMode)
        }}
        disabled={locked}
        className={`${iconButtonClass} disabled:cursor-default`}
        aria-label={themeLabel}
        title={themeTitle}
      >
        {themeIcon}
      </button>
    )
  }

  const isCyberpunk = theme === CYBERPUNK_THEME || resolvedTheme === CYBERPUNK_THEME

  return (
    <div className={`inline-flex items-center rounded-sm ${bgColor} p-1`}>
      <button
        type="button"
        onClick={() => setTheme('light')}
        disabled={locked}
        className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium transition-all duration-200 disabled:cursor-default ${
          resolvedTheme === 'light'
            ? `${activeBg} ${activeText}`
            : `${inactiveText} ${hoverText}`
        }`}
        aria-label="Light mode"
      >
        <SunIcon className={iconSize} />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        disabled={locked}
        className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium transition-all duration-200 disabled:cursor-default ${
          resolvedTheme === 'dark'
            ? `${activeBg} ${activeText}`
            : `${inactiveText} ${hoverText}`
        }`}
        aria-label="Dark mode"
      >
        <MoonIcon className={iconSize} />
      </button>
      <button
        type="button"
        onClick={() => setTheme(CYBERPUNK_THEME)}
        disabled={locked}
        className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium transition-all duration-200 disabled:cursor-default ${
          isCyberpunk
            ? cyberpunkActive ?? `${activeBg} ${activeText}`
            : `${inactiveText} ${hoverText}`
        }`}
        aria-label="Cyberpunk mode"
      >
        <CyberpunkIcon className={iconSize} />
      </button>
    </div>
  )
}
