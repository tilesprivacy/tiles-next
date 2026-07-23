'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeSwitcherProps {
  variant?: 'light' | 'dark' | 'auto'
  size?: 'sm' | 'md'
  mode?: 'segmented' | 'toggle'
  tone?: 'default' | 'quiet'
  /** Minimum 44px tap target for footer and other touch-first surfaces. */
  touchFriendly?: boolean
}

export function ThemeSwitcher({
  variant = 'auto',
  size = 'sm',
  mode = 'segmented',
  tone = 'default',
  touchFriendly = false,
}: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  // Determine colors based on variant
  const isLightVariant = variant === 'light' || (variant === 'auto' && !isDark)
  const quiet = tone === 'quiet'
  const bgColor = isLightVariant ? (quiet ? 'bg-black/[0.055]' : 'bg-black/10') : (quiet ? 'bg-white/[0.07]' : 'bg-white/10')
  const activeBg = isLightVariant ? 'bg-black' : 'bg-white'
  const activeText = isLightVariant ? 'text-white' : 'text-black'
  const inactiveText = isLightVariant ? (quiet ? 'text-black/45' : 'text-black/60') : (quiet ? 'text-white/50' : 'text-white/60')
  const hoverText = isLightVariant ? 'hover:text-black' : 'hover:text-white'

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2.5 py-1 gap-0.5' 
    : 'text-sm px-3 py-1.5 gap-1'

  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const togglePadding = quiet ? 'p-1' : 'p-1.5'

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
        {[0, 1, 2].map((index) => (
          <span key={index} className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium`}>
            {/* Keep the pre-hydration footprint identical to avoid footer jumps. */}
            <span className={`${iconSize} opacity-0`} />
          </span>
        ))}
      </div>
    )
  }

  if (mode === 'toggle') {
    const isSystem = theme === 'system'
    const effectiveMode: 'light' | 'dark' | 'system' = isSystem
      ? 'system'
      : resolvedTheme === 'dark'
        ? 'dark'
        : 'light'
    const nextMode: 'light' | 'dark' | 'system' =
      effectiveMode === 'light' ? 'dark' : effectiveMode === 'dark' ? 'system' : 'light'

    const focusRing = isLightVariant ? 'focus-visible:ring-black/25' : 'focus-visible:ring-white/25'
    const shell = isLightVariant
      ? `${bgColor} ${quiet ? 'text-black/55' : 'text-black/70'} hover:text-black`
      : `${bgColor} ${quiet ? 'text-white/58' : 'text-white/75'} hover:text-white`
    const iconButtonClass = `inline-flex items-center justify-center rounded-sm ${togglePadding} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${focusRing} ${shell} ${bgColor}`
    const themeIcon =
      effectiveMode === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={iconSize}>
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
        </svg>
      ) : effectiveMode === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={iconSize}>
          <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={iconSize}>
          <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clipRule="evenodd" />
        </svg>
      )

    const themeLabel = `Theme: ${effectiveMode}. Click to switch to ${nextMode}.`
    const themeTitle = `Theme: ${effectiveMode.toUpperCase()} (click for ${nextMode.toUpperCase()})`

    if (touchFriendly) {
      const touchIconClass = `inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${focusRing} ${
        isLightVariant
          ? `${quiet ? 'text-black/55' : 'text-black/70'} hover:text-black`
          : `${quiet ? 'text-white/58' : 'text-white/75'} hover:text-white`
      }`

      return (
        <div className={`inline-flex shrink-0 items-center rounded-sm leading-none ${bgColor} h-6`}>
          <div className="relative flex h-6 w-6 items-center justify-center">
            <button
              type="button"
              onClick={() => setTheme(nextMode)}
              className={`absolute -inset-[calc((2.75rem-1.5rem)/2)] z-[1] inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border-0 bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${focusRing}`}
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
        onClick={() => setTheme(nextMode)}
        className={iconButtonClass}
        aria-label={themeLabel}
        title={themeTitle}
      >
        {themeIcon}
      </button>
    )
  }

  return (
    <div className={`inline-flex items-center rounded-sm ${bgColor} p-1`}>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium transition-all duration-200 ${
          resolvedTheme === 'light' 
            ? `${activeBg} ${activeText}` 
            : `${inactiveText} ${hoverText}`
        }`}
        aria-label="Light mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconSize}
        >
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium transition-all duration-200 ${
          resolvedTheme === 'dark' 
            ? `${activeBg} ${activeText}` 
            : `${inactiveText} ${hoverText}`
        }`}
        aria-label="Dark mode"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconSize}
        >
          <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`inline-flex items-center ${sizeClasses} rounded-sm font-medium transition-all duration-200 ${
          theme === 'system' 
            ? `${activeBg} ${activeText}` 
            : `${inactiveText} ${hoverText}`
        }`}
        aria-label="System theme"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconSize}
        >
          <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
