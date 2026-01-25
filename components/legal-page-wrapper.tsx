'use client'

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { type ReactNode } from 'react'

interface LegalPageWrapperProps {
  children: ReactNode
}

export function LegalPageWrapper({ children }: LegalPageWrapperProps) {
  // Theme-aware colors - matching book dark theme (#121212 bg, #E6E6E6 text)
  const bgColor = 'bg-background'
  const textColorBody = 'text-black/80 dark:text-[#B3B3B3]'

  return (
    <div className={`flex min-h-[100dvh] flex-col ${bgColor}`}>
      <SiteHeader themeAware />
      <main 
        className="legal-page-content flex-1 flex flex-col items-start justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-32 lg:pb-32 lg:pt-40 w-full max-w-3xl mx-auto [--legal-text-color:rgb(0_0_0)] [--legal-text-body:rgb(0_0_0_/_0.8)] [--legal-text-subtle:rgb(0_0_0_/_0.6)] [--legal-text-muted:rgb(0_0_0_/_0.7)] dark:[--legal-text-color:#E6E6E6] dark:[--legal-text-body:#B3B3B3] dark:[--legal-text-subtle:#8A8A8A] dark:[--legal-text-muted:#B3B3B3]"
      >
        <div className={`w-full space-y-6 sm:space-y-8 text-sm leading-relaxed ${textColorBody} sm:text-base lg:text-lg lg:leading-relaxed
          [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:sm:text-3xl [&_h1]:lg:text-4xl
          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:sm:text-xl [&_h2]:lg:text-2xl
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:sm:text-xl
          [&_.last-updated]:text-xs [&_.last-updated]:sm:text-sm
          [&_.contact-info]:text-xs [&_.contact-info]:sm:text-sm
        `}
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
