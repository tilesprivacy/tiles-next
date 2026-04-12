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
  isDarkFooter: boolean
}

export function FooterLanguageSelector({ isDarkFooter }: FooterLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [ready, setReady] = useState(false)

  const selectClasses = isDarkFooter
    ? 'border-[#2a2a2a] bg-black text-[#E6E6E6] hover:border-[#3a3a3a] focus-visible:ring-[#3a3a3a]'
    : 'border-black/10 bg-white text-black/85 hover:border-black/20 focus-visible:ring-black/20'

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
      <div className="relative">
        <Globe
          className={`pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
            isDarkFooter ? 'text-[#A3A3A3]' : 'text-black/50'
          }`}
          aria-hidden
        />
        <select
          id="footer-language-selector"
          value={selectedLanguage}
          onChange={(event) => onLanguageChange(event.target.value)}
          className={`h-8 min-w-[170px] appearance-none rounded-full border py-0 pl-8 pr-8 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-wait disabled:opacity-70 ${selectClasses}`}
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
          className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
            isDarkFooter ? 'text-[#A3A3A3]' : 'text-black/50'
          }`}
          aria-hidden
        />
      </div>
    </div>
  )
}
