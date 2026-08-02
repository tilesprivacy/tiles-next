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
  isOwnYourAiPath,
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
  if (isOwnYourAiPath(pathname)) return OWN_YOUR_AI_PAGE_THEME
  if (isSponsorPath(pathname)) return SPONSOR_PAGE_THEME
  if (isHomePageThemePath(pathname)) return HOME_PAGE_THEME
  return null
}

/**
 * next-themes can only apply one class token per theme, and the dark theme
 * maps to `.cyberpunk`. Mirror `.dark` onto <html> so existing `.dark` CSS
 * and `dark:` utilities keep working.
 */
function DarkClassSync() {
  const { resolvedTheme } = useTheme()

  React.useLayoutEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [resolvedTheme])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const pageTheme = getPageTheme(pathname)
  const storageKey = props.storageKey ?? 'theme'

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
    >
      {/* Runs immediately after next-themes’ blocking script so first paint has `.dark`.
          Also migrates the retired stored "cyberpunk" selection to "dark". */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var d=document.documentElement,k=${JSON.stringify(storageKey)},c=${JSON.stringify(CYBERPUNK_THEME)};try{if(localStorage.getItem(k)===c){localStorage.setItem(k,"dark");d.classList.remove("light");d.classList.add(c);d.style.colorScheme="dark";}}catch(e){}if(d.classList.contains(c))d.classList.add("dark");else d.classList.remove("dark");}catch(e){}})();`,
        }}
      />
      <DarkClassSync />
      {children}
    </NextThemesProvider>
  )
}
