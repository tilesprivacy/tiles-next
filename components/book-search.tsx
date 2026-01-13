'use client'

import { Search } from 'nextra/components'
import { useEffect, useRef, useState, createContext, useContext } from 'react'

const SearchFocusContext = createContext<{
  isFocused: boolean
  setIsFocused: (focused: boolean) => void
}>({ isFocused: false, setIsFocused: () => {} })

export const useSearchFocus = () => useContext(SearchFocusContext)

export function SearchFocusProvider({ children }: { children: React.ReactNode }) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <SearchFocusContext.Provider value={{ isFocused, setIsFocused }}>
      {children}
    </SearchFocusContext.Provider>
  )
}

export function BookSearch() {
  return (
    <div className="nextra-search">
      <Search
        placeholder="Search documentation..."
      />
    </div>
  )
}

export function HeaderSearch() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setIsFocused } = useSearchFocus()
  const [localFocused, setLocalFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const input = containerRef.current?.querySelector('input[type="search"]') as HTMLInputElement
        if (input) {
          input.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const input = containerRef.current?.querySelector('input[type="search"]') as HTMLInputElement
    if (!input) return

    const handleFocus = () => {
      setIsFocused(true)
      setLocalFocused(true)
    }
    const handleBlur = () => {
      setIsFocused(false)
      setLocalFocused(false)
    }

    input.addEventListener('focus', handleFocus)
    input.addEventListener('blur', handleBlur)

    return () => {
      input.removeEventListener('focus', handleFocus)
      input.removeEventListener('blur', handleBlur)
    }
  }, [setIsFocused])

  return (
    <div
      ref={containerRef}
      className="header-search relative flex items-center w-full sm:w-auto"
    >
      {/* Search Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3 z-10 h-4 w-4 text-black/40 dark:text-white/40 pointer-events-none transition-colors duration-200"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      {/* Cmd+K badge - desktop only */}
      <div className={`absolute right-3 z-10 hidden sm:flex items-center gap-1 pointer-events-none transition-opacity duration-200 ${localFocused ? 'opacity-0' : 'opacity-100'}`}>
        <kbd className="h-5 px-1.5 flex items-center justify-center rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] font-medium text-black/60 dark:text-white/60">⌘</kbd>
        <kbd className="h-5 px-1.5 flex items-center justify-center rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] font-medium text-black/60 dark:text-white/60">K</kbd>
      </div>

      <Search
        className={[
          // Height and shape
          "[&_input]:h-9 [&_input]:sm:h-10",
          "[&_input]:rounded-full",

          // Border and background
          "[&_input]:border [&_input]:border-black/10 [&_input]:dark:border-white/10",
          "[&_input]:bg-black/[0.02] [&_input]:dark:bg-white/[0.03]",
          "[&_input]:backdrop-blur-sm",

          // Text styling
          "[&_input]:text-black [&_input]:dark:text-white",
          "[&_input]:text-sm [&_input]:font-normal",
          "[&_input]:placeholder:text-black/40 [&_input]:dark:placeholder:text-white/40",

          // Padding
          "[&_input]:pl-10",
          "[&_input]:pr-3 [&_input]:sm:pr-16",
          "[&_input]:sm:focus:pr-3",

          // Width
          "[&_input]:w-full",
          "[&_input]:sm:w-[200px]",
          "[&_input]:sm:focus:w-[280px]",

          // Transitions and interactions
          "[&_input]:transition-all [&_input]:duration-300 [&_input]:ease-out",
          "[&_input]:focus:outline-none",
          "[&_input]:focus:border-black/20 [&_input]:dark:focus:border-white/20",
          "[&_input]:focus:bg-white [&_input]:dark:focus:bg-neutral-800",
          "[&_input]:focus:shadow-sm",
          "[&_input]:hover:border-black/15 [&_input]:dark:hover:border-white/15",
        ].join(" ")}
        placeholder="Search..."
      />
    </div>
  )
}
