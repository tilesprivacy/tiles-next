import { MinimalDownload } from "@/components/minimal-download"
import { MinimalFooter } from "@/components/minimal-footer"
import { NewsletterCta } from "@/components/newsletter-cta"

interface SiteFooterProps {
  showNewsletterCta?: boolean
  newsletterCtaLayout?: "default" | "landing"
  showDownloadCta?: boolean
  showGemmaInferenceNote?: boolean
}

function GemmaInferenceNote() {
  return (
    <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-black/55 dark:text-white/55">
      <span>Inference powered locally by</span>
      <img
        src="https://ai.google.dev/gemma/images/gemma_sq.png"
        alt=""
        width={18}
        height={18}
        className="drop-shadow-[0_0_5px_rgba(124,85,255,0.5)] dark:drop-shadow-[0_0_7px_rgba(166,137,255,0.75)]"
        aria-hidden
      />
      <span>Gemma 4 series.</span>
    </p>
  )
}

export function SiteFooter({
  showNewsletterCta = false,
  showDownloadCta = true,
  showGemmaInferenceNote = false,
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
          {showGemmaInferenceNote ? <GemmaInferenceNote /> : null}
        </section>
      ) : null}
      <MinimalFooter />
    </div>
  )
}
