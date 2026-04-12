'use client'

import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { FaChevronDown, FaGlobe } from 'react-icons/fa6'

const LANGUAGE_STORAGE_KEY = 'tiles-language'

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'de', label: 'Deutsch', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'it', label: 'Italiano', dir: 'ltr' },
  { code: 'ja', label: '日本語', dir: 'ltr' },
  { code: 'ko', label: '한국어', dir: 'ltr' },
  { code: 'pt-BR', label: 'Português (Brasil)', dir: 'ltr' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'zh-CN', label: '简体中文', dir: 'ltr' },
] as const

type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]['code']

interface FooterLanguageSwitcherProps {
  isDarkFooter: boolean
}

export function FooterLanguageSwitcher({ isDarkFooter }: FooterLanguageSwitcherProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en')
  const textColor = isDarkFooter ? 'text-[#E6E6E6]' : 'text-black'
  const borderColor = isDarkFooter ? 'border-[#2a2a2a]' : 'border-black/15'
  const backgroundColor = isDarkFooter ? 'bg-black' : 'bg-white'
  const optionClassName = isDarkFooter ? 'bg-[#111111] text-[#E6E6E6]' : 'bg-white text-black'

  const selectedOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === selectedLanguage) ?? LANGUAGE_OPTIONS[0],
    [selectedLanguage],
  )

  useEffect(() => {
    const persistedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null
    const browserLanguage = navigator.language
    const exactMatch = LANGUAGE_OPTIONS.find((option) => option.code === browserLanguage)
    const prefixMatch = LANGUAGE_OPTIONS.find((option) => browserLanguage.startsWith(option.code))
    const initialLanguage = persistedLanguage ?? exactMatch?.code ?? prefixMatch?.code ?? 'en'

    applyLanguage(initialLanguage)
    setSelectedLanguage(initialLanguage)
  }, [])

  const applyLanguage = (languageCode: LanguageCode) => {
    const language = LANGUAGE_OPTIONS.find((option) => option.code === languageCode) ?? LANGUAGE_OPTIONS[0]

    document.documentElement.lang = language.code
    document.documentElement.dir = language.dir

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language.code)
    window.dispatchEvent(new CustomEvent('tiles-language-change', { detail: { language: language.code } }))
  }

  const onLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLanguage = event.target.value as LanguageCode
    setSelectedLanguage(nextLanguage)
    applyLanguage(nextLanguage)
  }

  return (
    <label
      className={`relative inline-flex h-11 min-w-[220px] items-center rounded-2xl border px-3.5 ${borderColor} ${backgroundColor}`}
      aria-label="Select language"
    >
      <FaGlobe className={`h-4 w-4 shrink-0 ${textColor}`} aria-hidden />
      <span className={`pointer-events-none ml-2.5 mr-8 text-sm ${textColor}`}>{selectedOption.label}</span>
      <select
        value={selectedLanguage}
        onChange={onLanguageChange}
        className={`absolute inset-0 cursor-pointer appearance-none rounded-2xl bg-transparent text-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isDarkFooter ? 'focus-visible:ring-[#E6E6E6]/70 focus-visible:ring-offset-black' : 'focus-visible:ring-black/35 focus-visible:ring-offset-white'}`}
        aria-label="Website language"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} className={optionClassName}>
            {option.label}
          </option>
        ))}
      </select>
      <FaChevronDown className={`pointer-events-none absolute right-3.5 h-3.5 w-3.5 ${textColor}`} aria-hidden />
    </label>
  )
}
