import Link from "next/link"
import { Check } from "lucide-react"
import { WHY_TILES_TAGLINE, whyTilesBullets } from "@/lib/why-tiles-content"
import {
  marketingPageCompactSectionTitleClass,
  marketingPageSectionTitleClass,
} from "@/lib/marketing-page-title-classes"

const sectionCtaClass =
  "inline-flex items-center text-[0.95rem] text-black/50 underline decoration-black/30 underline-offset-4 transition-colors hover:text-black/70 hover:decoration-black/45 dark:text-[#A4A4A4] dark:decoration-white/30 dark:hover:text-[#C0C0C0] dark:hover:decoration-white/45"

function WhyTilesCta({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={sectionCtaClass}>
      {label} →
    </Link>
  )
}

type WhyTilesSectionProps = {
  variant?: "home" | "book"
  showHeading?: boolean
  cta?: {
    href: string
    label: string
  }
}

export function WhyTilesSection({
  variant = "home",
  showHeading = true,
  cta,
}: WhyTilesSectionProps) {
  const headingClass =
    variant === "home"
      ? marketingPageCompactSectionTitleClass
      : `text-balance ${marketingPageSectionTitleClass}`

  const taglineClass =
    variant === "home"
      ? "text-[1rem] leading-[1.55] text-black/58 dark:text-[#AFAFAF]"
      : "text-sm leading-relaxed text-black/60 dark:text-[#B3B3B3] sm:text-base"

  const bulletClass =
    variant === "home"
      ? "flex gap-3 text-[0.96rem] leading-[1.55] text-black/64 dark:text-[#B5B5B5]"
      : "flex gap-3 text-sm leading-relaxed text-black/64 dark:text-[#B5B5B5] sm:text-base"


  return (
    <div
      className={variant === "book" ? "not-prose mt-4 sm:mt-5" : undefined}
      id={variant === "book" ? "why-tiles" : undefined}
    >
      <div className="grid gap-7 sm:gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <div className="max-w-[28rem] space-y-3.5">
          {showHeading ? <h2 className={headingClass}>Why Tiles</h2> : null}
          <p className={taglineClass}>{WHY_TILES_TAGLINE}</p>
          {cta ? <div className="hidden lg:block"><WhyTilesCta href={cta.href} label={cta.label} /></div> : null}
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5 lg:col-start-2 lg:row-start-1">
          {whyTilesBullets.map((bullet) => (
            <li key={bullet} className={bulletClass}>
              <Check
                className="mt-1 h-3.5 w-3.5 shrink-0 text-black/34 dark:text-[#8A8A8A]"
                strokeWidth={2}
                aria-hidden
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {cta ? <div className="lg:hidden"><WhyTilesCta href={cta.href} label={cta.label} /></div> : null}
      </div>
    </div>
  )
}
