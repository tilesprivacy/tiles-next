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
import {
  SPONSOR_PAGE_THEME,
  isSponsorForceDarkPath,
} from '@/lib/sponsor-page-theme'

function getForcedPageTheme(pathname: string | null): string | null {
  if (isOwnYourAiForceDarkPath(pathname)) return OWN_YOUR_AI_PAGE_THEME
  if (isSponsorForceDarkPath(pathname)) return SPONSOR_PAGE_THEME
  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const pageTheme = getForcedPageTheme(pathname)
  const forceDark = pageTheme !== null

  React.useLayoutEffect(() => {
    const root = document.documentElement

    if (pageTheme) {
      root.dataset.pageTheme = pageTheme
      return () => {
        if (root.dataset.pageTheme === pageTheme) {
          delete root.dataset.pageTheme
        }
      }
    }

    delete root.dataset.pageTheme
  }, [pageTheme])

  return (
    <NextThemesProvider {...props} forcedTheme={forceDark ? 'dark' : undefined}>
      {children}
    </NextThemesProvider>
  )
}
