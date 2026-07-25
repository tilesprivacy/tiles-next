'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import {
  HOME_PAGE_THEME,
  isHomePageThemePath,
} from '@/lib/home-page-theme'
import {
  OWN_YOUR_AI_PAGE_THEME,
  isOwnYourAiForceDarkPath,
} from '@/lib/own-your-ai-theme'
import {
  SPONSOR_PAGE_THEME,
  isSponsorPath,
} from '@/lib/sponsor-page-theme'

function getPageTheme(pathname: string | null): string | null {
  if (isOwnYourAiForceDarkPath(pathname)) return OWN_YOUR_AI_PAGE_THEME
  if (isSponsorPath(pathname)) return SPONSOR_PAGE_THEME
  if (isHomePageThemePath(pathname)) return HOME_PAGE_THEME
  return null
}

function shouldForceDark(pageTheme: string | null): boolean {
  return pageTheme === OWN_YOUR_AI_PAGE_THEME
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const pageTheme = getPageTheme(pathname)
  const forceDark = shouldForceDark(pageTheme)

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
