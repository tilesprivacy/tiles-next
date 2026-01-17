'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeSwitcherProps {
  variant?: 'light' | 'dark' | 'auto'
  size?: 'sm' | 'md'
}

export function ThemeSwitcher({ variant = 'auto', size = 'sm' }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === 'dark'
  
  // Determine colors based on variant
  const isLightVariant = variant === 'light' || (variant === 'auto' && !isDark)
  const bgColor = isLightVariant ? 'bg-black/10' : 'bg-white/10'
  const activeBg = isLightVariant ? 'bg-black' : 'bg-white'
  const activeText = isLightVariant ? 'text-white' : 'text-black'
  const inactiveText = isLightVariant ? 'text-black/60' : 'text-white/60'
  const hoverText = isLightVariant ? 'hover:text-black' : 'hover:text-white'

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-0.5' 
    : 'text-xs px-2.5 py-1 gap-1'

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'

  return (
    <div className={`inline-flex items-center rounded-full ${bgColor} p-0.5`}>
      <button
        onClick={() => setTheme('light')}
        className={`inline-flex items-center ${sizeClasses} rounded-full font-medium transition-all duration-200 ${
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
        onClick={() => setTheme('dark')}
        className={`inline-flex items-center ${sizeClasses} rounded-full font-medium transition-all duration-200 ${
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
        onClick={() => setTheme('system')}
        className={`inline-flex items-center ${sizeClasses} rounded-full font-medium transition-all duration-200 ${
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
