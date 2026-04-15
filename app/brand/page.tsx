import type { Metadata } from "next"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"

export const metadata: Metadata = {
  title: "Brand | Tiles",
  description: "Resources to represent Tiles consistently and accurately.",
  openGraph: {
    title: "Brand | Tiles",
    description: "Resources to represent Tiles consistently and accurately.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Brand | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand | Tiles",
    description: "Resources to represent Tiles consistently and accurately.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function BrandPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto w-full max-w-4xl px-6 pb-16 pt-28 md:pt-32">
        <h1 className="max-w-[22ch] font-sans text-[1.95rem] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[2.2rem] lg:text-[2.6rem]">
          Tiles brand guidelines
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg dark:text-[#B3B3B3]">
          Resources to represent Tiles consistently and accurately.
        </p>
        <a
          href="/tiles-brand-assets.zip"
          className={`mt-8 inline-flex h-10 items-center gap-2 rounded-sm px-5 text-sm font-medium transition-all duration-300 will-change-transform hover:scale-[1.02] active:scale-[0.98] ${themeAwareHeaderPrimaryCtaClasses}`}
        >
          Download brand assets
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M12 4v11" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m7.5 11.5 4.5 4.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <h2 className="mt-16 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Brand assets</h2>
        <div className="mt-4 max-w-3xl space-y-2 text-base leading-relaxed text-black/65 md:text-lg dark:text-[#B3B3B3]">
          <p>
            <strong className="font-semibold text-foreground">Logos</strong> are available as icon mark and logo
            variants, in light and dark versions.
          </p>
          <p>
            <strong className="font-semibold text-foreground">Banners</strong> are available as outline and full
            banner treatments for both light and dark surfaces.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          <div>
            <div className="flex justify-center">
              <Image
                src="/lighticon.png"
                alt="Tiles logo preview on light theme"
                width={220}
                height={220}
                className="h-[160px] w-[160px] object-contain dark:hidden md:h-[220px] md:w-[220px]"
              />
              <Image
                src="/grey.png"
                alt="Tiles logo preview on dark theme"
                width={220}
                height={220}
                className="hidden h-[160px] w-[160px] object-contain dark:block md:h-[220px] md:w-[220px]"
              />
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
              Tiles logo, including light and dark mark variants.
            </p>
          </div>

          <div>
            <div className="mx-auto flex w-full max-w-3xl justify-center">
              <Image
                src="/tiles_banner_outline_blk.svg"
                alt="Tiles banner preview on light theme"
                width={1200}
                height={220}
                className="h-auto w-full object-contain dark:hidden"
              />
              <Image
                src="/tiles_banner_outline_wht.svg"
                alt="Tiles banner preview on dark theme"
                width={1200}
                height={220}
                className="hidden h-auto w-full object-contain dark:block"
              />
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
              Tiles banner treatment for light and dark surfaces.
            </p>
          </div>
        </div>

        <h2 className="mt-14 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Name</h2>
        <p className="mt-4 text-base leading-relaxed text-black/80 md:text-lg dark:text-[#D0D0D3]">
          Refer to us as Tiles Privacy. Not Tiles Assistant or Tiles AI .
        </p>

        <div className="mt-14 border-t border-black/10 pt-6 dark:border-white/10">
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-black/55 dark:text-[#9A9A9D]">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span>Visual identity developed in collaboration with</span>
                <a
                  href="https://darkshapes.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                >
                  <Image src="/darkshapes-logo.svg" alt="Darkshapes logo" width={14} height={14} className="h-3.5 w-auto" />
                  <span>Darkshapes</span>
                </a>
                <span>.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
