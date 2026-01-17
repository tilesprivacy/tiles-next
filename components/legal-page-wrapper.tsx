'use client'

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useTheme } from 'next-themes'
import { useEffect, useState, ReactNode } from 'react'

interface LegalPageWrapperProps {
  children: ReactNode
}

export function LegalPageWrapper({ children }: LegalPageWrapperProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Theme-aware colors
  const bgColor = 'bg-background'
  const textColorBody = isDark ? 'text-white/80' : 'text-black/80'

  return (
    <div className={`flex min-h-[100dvh] flex-col ${bgColor}`}>
      <SiteHeader themeAware />
      <main 
        className="legal-page-content flex-1 flex flex-col items-start justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-32 lg:pb-32 lg:pt-40 w-full max-w-3xl mx-auto"
        style={{
          '--legal-text-color': isDark ? 'rgb(255 255 255)' : 'rgb(0 0 0)',
          '--legal-text-body': isDark ? 'rgb(255 255 255 / 0.8)' : 'rgb(0 0 0 / 0.8)',
          '--legal-text-subtle': isDark ? 'rgb(255 255 255 / 0.6)' : 'rgb(0 0 0 / 0.6)',
          '--legal-text-muted': isDark ? 'rgb(255 255 255 / 0.7)' : 'rgb(0 0 0 / 0.7)',
        } as React.CSSProperties}
      >
        <div className={`w-full space-y-6 sm:space-y-8 text-sm leading-relaxed ${textColorBody} sm:text-base lg:text-lg lg:leading-relaxed
          [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:sm:text-3xl [&_h1]:lg:text-4xl
          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:sm:text-xl [&_h2]:lg:text-2xl
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:sm:text-xl
          [&_.last-updated]:text-xs [&_.last-updated]:sm:text-sm
          [&_.contact-info]:text-xs [&_.contact-info]:sm:text-sm
        `}
        style={{
          color: isDark ? 'rgb(255 255 255 / 0.8)' : 'rgb(0 0 0 / 0.8)',
        }}
        >
          {children}
        </div>
      </main>
      <SiteFooter />

      <style jsx global>{`
        .legal-page-content h1,
        .legal-page-content h2,
        .legal-page-content h3 {
          color: var(--legal-text-color) !important;
        }
        .legal-page-content .last-updated,
        .legal-page-content .contact-info {
          color: var(--legal-text-subtle) !important;
        }
        .legal-page-content .subprocessor-label {
          color: var(--legal-text-body) !important;
        }
        .legal-page-content .subprocessor-value {
          color: var(--legal-text-muted) !important;
        }
        .legal-page-content a {
          color: var(--legal-text-color) !important;
        }
        .legal-page-content a:hover {
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}
