import type { ReactNode } from "react"
import Link from "next/link"
import { MinimalDownload } from "@/components/minimal-download"
import { MinimalFooter } from "@/components/minimal-footer"
import { NewsletterCta } from "@/components/newsletter-cta"

interface SiteFooterProps {
  showNewsletterCta?: boolean
  newsletterCtaLayout?: "default" | "landing"
  showDownloadCta?: boolean
  decoration?: ReactNode
}

export function SiteFooter({
  showNewsletterCta = false,
  showDownloadCta = true,
  decoration,
}: SiteFooterProps) {
  return (
    <div className="refined-site-footer" data-pagefind-ignore="all">
      {showNewsletterCta ? (
        <section className="refined-site-footer-newsletter">
          <NewsletterCta />
        </section>
      ) : null}
      {showDownloadCta ? (
        <section className="refined-site-footer-download">
          <h2>Try Tiles now.</h2>
          <MinimalDownload platformSize="footer" />
          <Link href="/book/manual" className="minimal-actions-manual-link">
            Read the User Manual
          </Link>
        </section>
      ) : null}
      {decoration}
      <MinimalFooter />
    </div>
  )
}
