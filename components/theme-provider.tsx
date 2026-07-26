'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import {
  ThemeProvider as NextThemesProvider,
  useTheme,
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
  CYBERPUNK_THEME,
  SITE_THEMES,
  SITE_THEME_CLASS_VALUES,
} from '@/lib/site-theme'
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

function getForcedTheme(pageTheme: string | null): string | undefined {
  if (pageTheme === OWN_YOUR_AI_PAGE_THEME) return 'dark'
  if (pageTheme === SPONSOR_PAGE_THEME) return CYBERPUNK_THEME
  return undefined
}

/**
 * next-themes can only apply one class token per theme. Cyberpunk also needs
 * `.dark` so existing `.dark` CSS and `dark:` utilities keep working.
 */
function CyberpunkDarkClassSync() {
  const { resolvedTheme } = useTheme()

  React.useLayoutEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === CYBERPUNK_THEME) {
      root.classList.add('dark')
    }
  }, [resolvedTheme])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const pageTheme = getPageTheme(pathname)
  const forcedTheme = getForcedTheme(pageTheme)

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
    <NextThemesProvider
      {...props}
      themes={[...SITE_THEMES]}
      value={SITE_THEME_CLASS_VALUES}
      forcedTheme={forcedTheme}
    >
      {/* Runs immediately after next-themes’ blocking script so first paint has `.dark`. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var d=document.documentElement;if(d.classList.contains(${JSON.stringify(CYBERPUNK_THEME)}))d.classList.add("dark");}catch(e){}})();`,
        }}
      />
      <CyberpunkDarkClassSync />
      {children}
    </NextThemesProvider>
  )
}
