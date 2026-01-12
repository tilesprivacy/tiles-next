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

    const handleFocus = () => setIsFocused(true)
    const handleBlur = () => setIsFocused(false)

    input.addEventListener('focus', handleFocus)
    input.addEventListener('blur', handleBlur)

    return () => {
      input.removeEventListener('focus', handleFocus)
      input.removeEventListener('blur', handleBlur)
    }
  }, [setIsFocused])

  const { isFocused } = useSearchFocus()

  return (
    <div 
      ref={containerRef} 
      className="header-search relative flex items-center w-full sm:w-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-2.5 z-10 h-3.5 w-3.5 lg:h-4 lg:w-4 text-black/50 dark:text-white/50 pointer-events-none"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <Search
        className={[
          "[&_input]:h-8 [&_input]:lg:h-10 [&_input]:rounded-full",
          "[&_input]:border [&_input]:border-black/20 [&_input]:dark:border-white/20",
          "[&_input]:bg-white [&_input]:dark:bg-neutral-800",
          "[&_input]:text-black [&_input]:dark:text-white",
          "[&_input]:pl-8 [&_input]:pr-1 [&_input]:focus:pr-3 [&_input]:sm:pr-3 [&_input]:lg:pl-9 [&_input]:lg:pr-4",
          "[&_input]:text-xs [&_input]:lg:text-sm",
          "[&_input]:w-8 [&_input]:focus:w-full [&_input]:sm:w-[160px] [&_input]:lg:w-[220px]",
          "[&_input]:sm:focus:w-[180px] [&_input]:lg:focus:w-[260px]",
          "[&_input]:placeholder:text-black/50 [&_input]:dark:placeholder:text-white/50",
          "[&_input]:placeholder:opacity-0 [&_input]:focus:placeholder:opacity-100 [&_input]:sm:placeholder:opacity-100",
          "[&_input]:transition-[width,padding] [&_input]:duration-300 [&_input]:ease-out",
          "[&_input]:focus:outline-none [&_input]:focus:ring-2 [&_input]:focus:ring-black/10 [&_input]:dark:focus:ring-white/20"
        ].join(" ")}
        placeholder="Search..."
      />
    </div>
  )
}
