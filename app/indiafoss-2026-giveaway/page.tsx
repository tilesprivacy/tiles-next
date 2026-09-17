import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"
import { IndiaFossGiveawayForm } from "@/components/indiafoss-giveaway-form"
import { SiteFooter } from "@/components/site-footer"
import { INDIAFOSS_GIVEAWAY_PATH } from "@/lib/indiafoss-giveaway"

const title = "IndiaFOSS 2026 ticket and travel grant giveaway"
const description = "Apply for one of 10 IndiaFOSS 2026 tickets for OSDC members. Five entries include a US$100 travel grant."

export const metadata: Metadata = {
  title: `${title} | Tiles`,
  description,
  alternates: { canonical: INDIAFOSS_GIVEAWAY_PATH },
  openGraph: {
    title,
    description,
    url: INDIAFOSS_GIVEAWAY_PATH,
    images: [
      {
        url: "/indiafoss-2026-giveaway.png",
        width: 1080,
        height: 1350,
        alt: "Tiles, Solstone, IndiaFOSS 2026, and OSDC giveaway",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/indiafoss-2026-giveaway.png"],
  },
}

const requirements = [
  <span key="member">
    Be a member of <a href="https://osdc.dev" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">OSDC</a>.
  </span>,
  <span key="tiles">
    Download and install the <Link href="/download" className="underline underline-offset-4">Tiles Canary version</Link> on your device.
  </span>,
  <span key="solstone">
    Use the <a href="https://solstone.app/install" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Solstone download page</a> to install both journal and the menu bar app on your devices.
  </span>,
]

export default function IndiaFossGiveawayPage() {
  return (
    <div className="minimal-product-page">
      <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-[calc(var(--site-announcement-height)+7rem)] sm:px-8 sm:pb-32 lg:px-10 lg:pt-[calc(var(--site-announcement-height)+9rem)]">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-black/10 bg-black dark:border-white/10">
              <Image
                src="/indiafoss-2026-giveaway.png"
                alt="Tiles, Solstone, IndiaFOSS 2026, and OSDC"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-contain"
              />
            </div>
          </aside>

          <article>
            <p className="text-sm font-medium text-black dark:text-[#f7ff61]">Tiles × Solstone × IndiaFOSS 2026</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.06] tracking-[-0.045em] sm:text-5xl">
              Apply for the IndiaFOSS 2026 ticket and travel grant giveaway
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              We have 10 spots for OSDC members. Five include an IndiaFOSS ticket and a US$100 travel grant, while the other five include a conference ticket. All 10 also include swag.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              <a href="https://osdc.dev" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">OSDC</a> is a student-run open-source club based at JIIT in Noida.
            </p>
            <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">
              Swag includes three T-shirts, one each from Tiles, Solstone, and IndiaFOSS, plus additional stickers. Conference ticket codes and flight tickets will be sent to selected recipients by email. The T-shirts and additional swag will be provided at the venue.
            </p>

            <section className="mt-10 rounded-2xl border border-black/10 bg-black/[0.025] p-5 dark:border-white/10 dark:bg-white/[0.025] sm:p-6" aria-labelledby="requirements-heading">
              <h2 id="requirements-heading" className="text-lg font-semibold tracking-[-0.02em]">Before you apply</h2>
              <ul className="mt-4 space-y-3">
                {requirements.map((requirement) => (
                  <li key={requirement.key} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-black dark:text-[#f7ff61]" aria-hidden />
                    {requirement}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-12 border-t border-black/10 pt-10 dark:border-white/10">
              <IndiaFossGiveawayForm />
            </div>

            <p className="mt-8 text-xs leading-5 text-muted-foreground">
              One entry per person. Entries are reviewed by the organizers, and submitting does not guarantee selection. Selected applicants may be asked to verify eligibility.
            </p>
          </article>
        </div>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
