'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import {
  OWN_YOUR_AI_PAGE_THEME,
  isOwnYourAiForceDarkPath,
} from '@/lib/own-your-ai-theme'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const forceDark = isOwnYourAiForceDarkPath(pathname)

  React.useLayoutEffect(() => {
    const root = document.documentElement

    if (forceDark) {
      root.dataset.pageTheme = OWN_YOUR_AI_PAGE_THEME
      return () => {
        if (root.dataset.pageTheme === OWN_YOUR_AI_PAGE_THEME) {
          delete root.dataset.pageTheme
        }
      }
    }

    if (root.dataset.pageTheme === OWN_YOUR_AI_PAGE_THEME) {
      delete root.dataset.pageTheme
    }
  }, [forceDark])

  return (
    <NextThemesProvider {...props} forcedTheme={forceDark ? 'dark' : undefined}>
      {children}
    </NextThemesProvider>
  )
}
