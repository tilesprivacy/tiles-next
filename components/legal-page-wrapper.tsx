import { SiteFooter } from "@/components/site-footer"
import type { ReactNode } from "react"

interface LegalPageWrapperProps {
  children: ReactNode
}

export function LegalPageWrapper({ children }: LegalPageWrapperProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <main
        className="legal-page-content flex-1 flex flex-col items-start justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] lg:pb-32 lg:pt-[calc(10.5rem+env(safe-area-inset-top,0px))] w-full max-w-3xl mx-auto"
      >
        <div className={`w-full space-y-6 text-base leading-[1.7] text-foreground/80 sm:space-y-8
          [&_h1]:text-[clamp(2.25rem,4vw,2.5rem)] [&_h1]:font-normal [&_h1]:leading-[1.1] [&_h1]:tracking-[-0.035em] [&_h1]:text-balance
          [&_h2]:text-[1.375rem] [&_h2]:font-semibold [&_h2]:leading-[1.25] [&_h2]:tracking-[-0.02em] [&_h2]:text-balance lg:[&_h2]:text-2xl
          [&_h3]:text-[1.0625rem] [&_h3]:font-semibold [&_h3]:leading-[1.35] [&_h3]:tracking-[-0.01em] [&_h3]:text-balance
          [&_.last-updated]:text-xs [&_.last-updated]:sm:text-sm
          [&_.contact-info]:text-xs [&_.contact-info]:sm:text-sm
        `}>
          {children}
        </div>
      </main>
      <SiteFooter />

      <style jsx global>{`
        .legal-page-content h1,
        .legal-page-content h2,
        .legal-page-content h3 {
          color: var(--foreground) !important;
        }
        .legal-page-content .last-updated,
        .legal-page-content .contact-info {
          color: var(--muted-foreground) !important;
        }
        .legal-page-content .subprocessor-label {
          color: color-mix(in srgb, var(--foreground) 82%, transparent) !important;
        }
        .legal-page-content .subprocessor-value {
          color: var(--muted-foreground) !important;
        }
        .legal-page-content a {
          color: var(--foreground) !important;
        }
        .legal-page-content a:hover {
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}
