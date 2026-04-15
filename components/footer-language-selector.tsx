'use client'

import { ChevronDown, Globe } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
const TRANSLATE_SCROLL_RESTORE_KEY = 'tiles-translate-scroll-restore'

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
    const hostname = window.location.hostname
    const domainVariants = [hostname, `.${hostname}`]
    for (const domain of domainVariants) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain};`
    }
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'
    return
  }
  document.cookie = `googtrans=/en/${language}; path=/; max-age=31536000`
}

function reloadPreservingScroll() {
  try {
    sessionStorage.setItem(
      TRANSLATE_SCROLL_RESTORE_KEY,
      JSON.stringify({
        path: `${window.location.pathname}${window.location.search}`,
        x: window.scrollX,
        y: window.scrollY,
      }),
    )
  } catch {
    // Ignore storage failures and continue with reload fallback.
  }
  window.location.reload()
}

function restoreScrollAfterTranslateReload() {
  try {
    const raw = sessionStorage.getItem(TRANSLATE_SCROLL_RESTORE_KEY)
    if (!raw) return
    sessionStorage.removeItem(TRANSLATE_SCROLL_RESTORE_KEY)
    const parsed = JSON.parse(raw) as { path?: string; x?: number; y?: number }
    const currentPath = `${window.location.pathname}${window.location.search}`
    if (parsed.path !== currentPath) return
    const x = Number.isFinite(parsed.x) ? parsed.x : 0
    const y = Number.isFinite(parsed.y) ? parsed.y : 0
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const restore = () => {
      window.scrollTo({ left: x, top: y, behavior: 'auto' })
    }
    requestAnimationFrame(() => {
      restore()
      requestAnimationFrame(restore)
      setTimeout(() => {
        restore()
        window.history.scrollRestoration = previousScrollRestoration
      }, 120)
    })
  } catch {
    sessionStorage.removeItem(TRANSLATE_SCROLL_RESTORE_KEY)
  }
}

function lockScrollAroundGoogleComboApply(run: () => void) {
  const x = window.scrollX
  const y = window.scrollY
  const previous = window.history.scrollRestoration
  window.history.scrollRestoration = 'manual'
  run()
  const restore = () => {
    window.scrollTo({ left: x, top: y, behavior: 'auto' })
  }
  queueMicrotask(restore)
  requestAnimationFrame(() => {
    restore()
    requestAnimationFrame(() => {
      restore()
      setTimeout(() => {
        restore()
        window.history.scrollRestoration = previous
      }, 120)
    })
  })
}

function tryApplyGoogleCombo(language: string) {
  const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
  if (!combo) return false
  const optionValues = Array.from(combo.options).map((option) => option.value)
  let targetValue: string | null = null
  if (language === 'en') {
    // Prefer the Google "original" option, then explicit English.
    if (optionValues.includes('')) {
      targetValue = ''
    } else if (optionValues.includes('en')) {
      targetValue = 'en'
    }
  } else {
    if (optionValues.includes(language)) {
      targetValue = language
    }
  }
  if (targetValue == null) return false
  lockScrollAroundGoogleComboApply(() => {
    combo.value = targetValue
    combo.dispatchEvent(new Event('change', { bubbles: true }))
  })
  return true
}

type FooterLanguageSelectorProps = {
  /** Matches `ThemeSwitcher` `variant` for the reversed footer surface (`dark` = dark footer band). */
  variant: 'light' | 'dark'
}

export function FooterLanguageSelector({ variant }: FooterLanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const translatePollRafRef = useRef<number | null>(null)

  const cancelTranslatePoll = () => {
    if (translatePollRafRef.current != null) {
      cancelAnimationFrame(translatePollRafRef.current)
      translatePollRafRef.current = null
    }
  }

  const scheduleGoogleComboPoll = (language: string) => {
    cancelTranslatePoll()
    const deadline = performance.now() + 8000
    const step = () => {
      if (tryApplyGoogleCombo(language)) {
        cancelTranslatePoll()
        return
      }
      if (performance.now() >= deadline) {
        cancelTranslatePoll()
        reloadPreservingScroll()
        return
      }
      translatePollRafRef.current = requestAnimationFrame(step)
    }
    translatePollRafRef.current = requestAnimationFrame(step)
  }

  // Track + text colors aligned with `components/theme-switcher.tsx` (segmented control shell).
  const isLightVariant = variant === 'light'
  const trackClass = isLightVariant ? 'bg-black/10' : 'bg-white/10'
  const selectClasses = isLightVariant
    ? 'text-black/85 focus-visible:ring-black/25'
    : 'text-white/90 focus-visible:ring-white/25'
  const iconMutedClass = isLightVariant ? 'text-black/60' : 'text-white/60'
  const dropdownSurfaceClass = isLightVariant
    ? 'border-black/10 bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.14)]'
    : 'border-white/15 bg-[#101010] text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)]'
  const optionActiveClass = isLightVariant ? 'bg-black/5 text-black' : 'bg-white/10 text-white'
  const optionIdleClass = isLightVariant ? 'hover:bg-black/5 text-black/85' : 'hover:bg-white/10 text-white/90'
  const selectedOption = LANGUAGE_OPTIONS.find((option) => option.value === selectedLanguage) ?? LANGUAGE_OPTIONS[0]

  useEffect(() => {
    restoreScrollAfterTranslateReload()
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

  useEffect(() => {
    return () => {
      const id = translatePollRafRef.current
      if (id != null) cancelAnimationFrame(id)
      translatePollRafRef.current = null
    }
  }, [])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current) return
      const target = event.target
      if (target instanceof Node && !rootRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const onLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setIsOpen(false)
    cancelTranslatePoll()
    setLanguageCookie(language)
    if (tryApplyGoogleCombo(language)) return
    scheduleGoogleComboPoll(language)
  }

  return (
    <div
      ref={rootRef}
      className="relative shrink-0 notranslate w-[min(14rem,calc(100vw-9.5rem))] sm:w-[min(14.25rem,calc(100vw-10rem))]"
      translate="no"
    >
      <div id={GOOGLE_ELEMENT_ID} className="tiles-google-translate-root" />
      <span id="footer-language-selector-label" className="sr-only">
        Select language
      </span>
      <div className={`inline-flex w-full items-center rounded-none p-1 ${trackClass}`}>
        <div className="relative flex w-full min-w-0 items-center">
          <Globe
            className={`pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${iconMutedClass}`}
            aria-hidden
          />
          <button
            type="button"
            id="footer-language-selector"
            aria-labelledby="footer-language-selector-label footer-language-selector"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className={`h-[22px] w-full min-w-0 truncate rounded-none border-0 bg-transparent py-0 pl-9 pr-8 text-left text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ${selectClasses}`}
            translate="no"
            title={selectedOption.label}
          >
            {selectedOption.label}
          </button>
          <ChevronDown
            className={`pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-transform ${iconMutedClass} ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </div>
      </div>
      {isOpen ? (
        <div
          className={`absolute bottom-full left-0 z-50 mb-2 w-[min(16rem,calc(100vw-3rem))] sm:left-auto sm:right-0 sm:w-[min(16rem,85vw)] overflow-hidden rounded-none border p-1.5 ${dropdownSurfaceClass}`}
          role="presentation"
        >
          <ul role="listbox" aria-labelledby="footer-language-selector-label" className="max-h-64 overflow-y-auto">
            {LANGUAGE_OPTIONS.map((option) => {
              const isSelected = option.value === selectedLanguage
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => onLanguageChange(option.value)}
                    className={`w-full rounded-none px-3 py-2 text-left text-sm transition-colors ${
                      isSelected ? optionActiveClass : optionIdleClass
                    }`}
                    translate="no"
                    lang={option.value}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
