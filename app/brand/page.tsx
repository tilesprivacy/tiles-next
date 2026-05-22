import type { Metadata } from "next"
import Image from "next/image"
import { SiteFooter } from "@/components/site-footer"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"
import { marketingPageTitleClass } from "@/lib/marketing-page-title-classes"

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
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground lg:overflow-visible">
      <main className="flex flex-1 flex-col overflow-x-clip pt-[calc(4.25rem+env(safe-area-inset-top,0px))] lg:pt-[calc(6.5rem+env(safe-area-inset-top,0px))]">
        <section className="mx-auto w-full max-w-4xl overflow-x-clip px-6 pb-16 pt-8 lg:pb-24">
          <h1 className={`max-w-[22ch] ${marketingPageTitleClass}`}>
            Tiles brand guidelines
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-black/65 md:text-lg dark:text-[#B3B3B3]">
            Resources to represent Tiles consistently and accurately.
          </p>
          <a
            href="/tiles-brand-assets.zip"
            className={`mt-8 inline-flex h-10 items-center gap-2 rounded-sm px-5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] motion-reduce:transform-none ${themeAwareHeaderPrimaryCtaClasses}`}
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
                  width={280}
                  height={280}
                  sizes="(max-width: 767px) 200px, 280px"
                  className="h-[200px] w-[200px] object-contain [content-visibility:visible] dark:hidden md:h-[280px] md:w-[280px]"
                />
                <Image
                  src="/grey.png"
                  alt="Tiles logo preview on dark theme"
                  width={280}
                  height={280}
                  sizes="(max-width: 767px) 200px, 280px"
                  className="hidden h-[200px] w-[200px] object-contain [content-visibility:visible] dark:block md:h-[280px] md:w-[280px]"
                />
              </div>
              <p className="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
                Tiles logo, including light and dark mark variants.
              </p>
            </div>

            <div>
              <div className="mx-auto flex w-full max-w-3xl justify-center">
                <Image
                  src="/tiles_tlogo_banner_v1.2/svg/tiles_banner_fill_blk.svg"
                  alt="Tiles filled banner preview on light theme"
                  width={1200}
                  height={220}
                  sizes="(max-width: 767px) calc(100vw - 3rem), 768px"
                  className="h-auto w-full object-contain [content-visibility:visible] dark:hidden"
                />
                <Image
                  src="/tiles_tlogo_banner_v1.2/svg/tiles_banner_fill_wht.svg"
                  alt="Tiles filled banner preview on dark theme"
                  width={1200}
                  height={220}
                  sizes="(max-width: 767px) calc(100vw - 3rem), 768px"
                  className="hidden h-auto w-full object-contain [content-visibility:visible] dark:block"
                />
              </div>
              <p className="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
                Tiles filled banner treatment for light and dark surfaces.
              </p>
            </div>

            <div>
              <div className="mx-auto flex w-full max-w-3xl justify-center">
                <Image
                  src="/tiles_banner_outline_blk.svg"
                  alt="Tiles outline banner preview on light theme"
                  width={1200}
                  height={220}
                  sizes="(max-width: 767px) calc(100vw - 3rem), 768px"
                  className="h-auto w-full object-contain [content-visibility:visible] dark:hidden"
                />
                <Image
                  src="/tiles_banner_outline_wht.svg"
                  alt="Tiles outline banner preview on dark theme"
                  width={1200}
                  height={220}
                  sizes="(max-width: 767px) calc(100vw - 3rem), 768px"
                  className="hidden h-auto w-full object-contain [content-visibility:visible] dark:block"
                />
              </div>
              <p className="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
                Tiles outline banner treatment for light and dark surfaces.
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
                <p className="text-sm leading-relaxed text-black/55 dark:text-[#9A9A9D]">
                  Visual identity developed in collaboration with{" "}
                  <a
                    href="https://darkshapes.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"
                  >
                    <Image src="/darkshapes-logo.svg" alt="Darkshapes logo" width={14} height={14} className="h-3.5 w-auto" />
                    <span>Darkshapes</span>
                  </a>
                  , an umbrella organization rethinking machine-learning tools that work for people, not corporations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
