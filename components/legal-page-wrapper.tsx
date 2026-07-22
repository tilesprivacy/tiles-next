import { SiteFooter } from "@/components/site-footer"
import type { CSSProperties, ReactNode } from 'react'

interface LegalPageWrapperProps {
  children: ReactNode
}

export function LegalPageWrapper({ children }: LegalPageWrapperProps) {
  const bgColor = 'bg-background'
  const textColorBody = 'text-[#3f3f3f]'

  return (
    <div className={`flex min-h-[100dvh] flex-col ${bgColor}`}>
      <main 
        className="legal-page-content flex-1 flex flex-col items-start justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] lg:pb-32 lg:pt-[calc(10.5rem+env(safe-area-inset-top,0px))] w-full max-w-3xl mx-auto"
        style={{
          '--legal-text-color': '#111111',
          '--legal-text-body': '#333333',
          '--legal-text-subtle': '#626262',
          '--legal-text-muted': '#4f4f4f',
        } as CSSProperties}
      >
        <div className={`w-full space-y-6 sm:space-y-8 text-base leading-[1.7] ${textColorBody}
          [&_h1]:text-[2rem] [&_h1]:font-normal [&_h1]:leading-[1.1] [&_h1]:tracking-[-0.035em] [&_h1]:text-balance
          [&_h2]:text-base [&_h2]:font-semibold [&_h2]:leading-[1.4] [&_h2]:tracking-[-0.01em] [&_h2]:text-balance
          [&_h3]:text-[0.9375rem] [&_h3]:font-semibold [&_h3]:leading-[1.4] [&_h3]:tracking-[-0.01em] [&_h3]:text-balance
          [&_.last-updated]:text-xs [&_.last-updated]:sm:text-sm
          [&_.contact-info]:text-xs [&_.contact-info]:sm:text-sm
        `}
        style={{
          color: '#3f3f3f',
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
