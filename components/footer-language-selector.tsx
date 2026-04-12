'use client'

import { ChevronDown, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: {
            pageLanguage: string
            includedLanguages: string
            autoDisplay: boolean
            layout: number
          },
          elementId: string,
        ) => void
      }
    }
    googleTranslateElementInit?: () => void
  }
}

const GOOGLE_SCRIPT_ID = 'tiles-google-translate-script'
const GOOGLE_ELEMENT_ID = 'google_translate_element'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'pt', label: 'Português (Brasil)' },
  { value: 'ru', label: 'Русский' },
  { value: 'zh-CN', label: '简体中文' },
] as const

const INCLUDED_LANGUAGES = LANGUAGE_OPTIONS.map((option) => option.value).join(',')

function getLanguageFromCookie() {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/)
  return match?.[1] ?? 'en'
}

function setLanguageCookie(language: string) {
  if (typeof document === 'undefined') return
  if (language === 'en') {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'
    return
  }
  document.cookie = `googtrans=/en/${language}; path=/; max-age=31536000`
}

function applyTranslation(language: string) {
  setLanguageCookie(language)
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (!combo) return false
  combo.value = language === 'en' ? '' : language
  combo.dispatchEvent(new Event('change'))
  return true
}

type FooterLanguageSelectorProps = {
  /** Matches `ThemeSwitcher` `variant` for the reversed footer surface (`dark` = dark footer band). */
  variant: 'light' | 'dark'
}

export function FooterLanguageSelector({ variant }: FooterLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [ready, setReady] = useState(false)

  // Track + text colors aligned with `components/theme-switcher.tsx` (segmented control shell).
  const isLightVariant = variant === 'light'
  const trackClass = isLightVariant ? 'bg-black/10' : 'bg-white/10'
  const selectClasses = isLightVariant
    ? 'text-black/85 focus-visible:ring-black/25'
    : 'text-white/90 focus-visible:ring-white/25'
  const iconMutedClass = isLightVariant ? 'text-black/60' : 'text-white/60'

  useEffect(() => {
    setSelectedLanguage(getLanguageFromCookie())

    const initGoogleTranslate = () => {
      if (!window.google?.translate?.TranslateElement) return
      if (!document.getElementById(GOOGLE_ELEMENT_ID)) return
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: INCLUDED_LANGUAGES,
          autoDisplay: false,
          layout: 0,
        },
        GOOGLE_ELEMENT_ID,
      )
      setReady(true)
    }

    if (window.google?.translate?.TranslateElement) {
      initGoogleTranslate()
      return
    }

    window.googleTranslateElementInit = initGoogleTranslate
    let script = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null

    if (!script) {
      script = document.createElement('script')
      script.id = GOOGLE_SCRIPT_ID
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    } else {
      script.addEventListener('load', initGoogleTranslate)
    }

    return () => {
      script?.removeEventListener('load', initGoogleTranslate)
    }
  }, [])

  const onLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    const applied = applyTranslation(language)
    if (!applied) {
      window.location.reload()
    }
  }

  return (
    <div className="w-auto notranslate" translate="no">
      <div id={GOOGLE_ELEMENT_ID} className="tiles-google-translate-root" />
      <label className="sr-only" htmlFor="footer-language-selector">
        Select language
      </label>
      <div
        className={`inline-flex items-center rounded-full p-1 ${trackClass}`}
      >
        <div className="relative flex items-center">
          <Globe
            className={`pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${iconMutedClass}`}
            aria-hidden
          />
          <select
            id="footer-language-selector"
            value={selectedLanguage}
            onChange={(event) => onLanguageChange(event.target.value)}
            className={`h-[22px] min-w-[10rem] sm:min-w-[11rem] cursor-pointer appearance-none rounded-full border-0 bg-transparent py-0 pl-9 pr-8 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-wait disabled:opacity-70 ${selectClasses}`}
            aria-label="Website language"
            disabled={!ready}
            translate="no"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} lang={option.value} translate="no">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${iconMutedClass}`}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}
