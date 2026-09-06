import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"
import Image from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import {
  downloadButtonIconMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"
import {
  marketingPageSectionTitleClass,
  marketingPageSubsectionTitleClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"
import { TILES_PRODUCT_DESCRIPTION } from "@/lib/product-description"
import { ownYourAiTalkRecording } from "@/lib/own-your-ai-talk"

const socialImage = getSocialImage("Press Kit")

const pageDescription =
  "Editorial summary, brand files, screenshots, and contact details for writing about Tiles."

export const metadata: Metadata = {
  title: "Press Kit | Tiles",
  description: pageDescription,
  openGraph: {
    title: "Press Kit | Tiles",
    description: pageDescription,
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press Kit | Tiles",
    description: pageDescription,
    images: [socialImage.url],
  },
}

const externalLinkClasses =
  "text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"

const factSheet: Array<{ label: string; value: string }> = [
  { label: "Product", value: "Tiles" },
  { label: "Company", value: "Tiles Privacy Technologies Pvt. Ltd." },
  { label: "Headquarters", value: "Bengaluru, India" },
  { label: "Status", value: "Public alpha" },
  { label: "Platforms", value: "macOS 14+ on Apple Silicon (M1+) and Linux" },
  { label: "Website", value: "https://www.tiles.run" },
]

const siteLinks: Array<{ label: string; href: string; external?: boolean }> = [
  { label: "Website", href: "https://www.tiles.run", external: true },
  { label: "Download", href: "/download" },
  { label: "Blog", href: "/blog" },
  { label: "Documentation", href: "/book" },
  { label: "GitHub", href: "https://github.com/tilesprivacy", external: true },
  { label: "X (Twitter)", href: "https://x.com/tilesprivacy", external: true },
  { label: "Bluesky", href: "https://bsky.app/profile/tiles.run", external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tilesprivacy/", external: true },
  { label: "Discord", href: "https://go.tiles.run/discord", external: true },
  { label: "Hugging Face", href: "https://huggingface.co/tilesprivacy", external: true },
]

const companyDetails: Array<{ label: string; value: string }> = [
  { label: "Legal name", value: "Tiles Privacy Technologies Pvt. Ltd." },
  { label: "CIN", value: "U58200KA2026PTC226312" },
  { label: "GSTIN", value: "29AANCT5152A1ZB" },
]

export default function PressKitPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground lg:overflow-visible">
      <main className="flex flex-1 flex-col overflow-x-clip pt-[calc(7rem+env(safe-area-inset-top,0px))] lg:pt-[calc(7.5rem+env(safe-area-inset-top,0px))]">
        <section className="mx-auto w-full max-w-4xl overflow-x-clip px-6 pb-16 pt-8 lg:pb-24">
          <h1 className={`max-w-[22ch] ${marketingPageTitleClass}`}>
            Tiles press kit
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
            Everything you need to write about Tiles: product background, brand files, screenshots, and contact
            details.
          </p>

          <h2 id="product" className={`mt-16 ${marketingPageSectionTitleClass}`}>Product</h2>
          <div className="mt-4 max-w-2xl space-y-4 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
            <p className="text-black/80 dark:text-[#D0D0D3]">{TILES_PRODUCT_DESCRIPTION}</p>
            <p>
              Tiles runs open models on your own device, so your conversations and data stay with you. Peer-to-peer
              encrypted sync connects your devices without a central server, and social features are built on the AT
              Protocol. Identity is user-owned through locally generated DIDs and UCANs, so your data and identity
              remain yours.
            </p>
            <p>
              Tiles is in public alpha for macOS and Linux. It is built by Tiles Privacy Technologies Pvt. Ltd., an
              independent team based in Bengaluru, India.
            </p>
          </div>

          <dl className="mt-8 max-w-2xl divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
            {factSheet.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                <dt className="w-36 shrink-0 text-sm font-medium leading-[1.7] text-foreground">{fact.label}</dt>
                <dd className="text-sm leading-[1.7] text-black/65 dark:text-[#B3B3B3]">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className={`mt-10 ${marketingPageSubsectionTitleClass}`}>Background talk</h3>
          <p className="mt-3 max-w-2xl text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
            For the story behind Tiles, watch{" "}
            <a
              href={ownYourAiTalkRecording.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={externalLinkClasses}
            >
              Own your AI with local models and open protocols
            </a>
            , a talk given at Local-First Conf 2026 in Berlin, or read the{" "}
            <Link href="/blog/own-your-ai" className={externalLinkClasses}>
              adapted blog post
            </Link>
            .
          </p>

          <h2 id="brand-files" className={`mt-16 ${marketingPageSectionTitleClass}`}>Brand files</h2>
          <a
            href="/tiles-brand-assets.zip"
            className={`group minimal-primary-button minimal-download-action mt-6 !min-w-0 !no-underline ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
          >
            <span>Download brand assets</span>
            <Download
              className={`download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`}
              aria-hidden
            />
          </a>
          <div className="mt-6 max-w-2xl space-y-2 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
            <p>
              <strong className="font-semibold text-foreground">Logos</strong> are available as icon mark and logo
              variants, in light and dark versions.
            </p>
            <p>
              <strong className="font-semibold text-foreground">Banners</strong> are available as outline and full
              banner treatments for both light and dark surfaces.
            </p>
            <p>
              Refer to us as <strong className="font-semibold text-foreground">Tiles Privacy</strong>. Not Tiles
              Assistant or Tiles AI. See the{" "}
              <Link href="/brand" className={externalLinkClasses}>
                full brand guidelines
              </Link>{" "}
              for details.
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
          </div>

          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-black/55 dark:text-[#9A9A9D]">
            Visual identity developed in collaboration with{" "}
            <a
              href="https://darkshapes.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 ${externalLinkClasses}`}
            >
              <Image src="/darkshapes-logo.svg" alt="Darkshapes logo" width={14} height={14} className="h-3.5 w-auto" />
              <span>Darkshapes</span>
            </a>
            , an umbrella organization rethinking machine-learning tools that work for people, not corporations.
          </p>

          <h2 id="screenshots" className={`mt-16 ${marketingPageSectionTitleClass}`}>Screenshots</h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
            Current product screenshots for use in articles and coverage of Tiles.
          </p>

          <div className="mt-10 space-y-10">
            <div>
              <div className="mx-auto flex w-full max-w-sm justify-center">
                <div className="w-full overflow-hidden rounded-sm border border-black/10 dark:border-white/10">
                  <Image
                    src="/clilight.png"
                    alt="Tiles CLI onboarding screen in the terminal, light theme"
                    width={875}
                    height={1798}
                    sizes="(max-width: 767px) calc(100vw - 3rem), 384px"
                    className="mx-auto h-auto w-full object-contain [content-visibility:visible] dark:hidden"
                  />
                  <Image
                    src="/clidark.png"
                    alt="Tiles CLI onboarding screen in the terminal, dark theme"
                    width={780}
                    height={1864}
                    sizes="(max-width: 767px) calc(100vw - 3rem), 384px"
                    className="mx-auto hidden h-auto w-full object-contain [content-visibility:visible] dark:block"
                  />
                </div>
              </div>
              <p className="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
                Onboarding flow for the Tiles CLI.
              </p>
            </div>

            <div>
              <div className="mx-auto flex w-full max-w-3xl justify-center">
                <div className="w-full overflow-hidden rounded-sm border border-black/10 dark:border-white/10">
                  <Image
                    src="/lightshare.png"
                    alt="A conversation shared from Tiles as a public link on tiles.run, light theme"
                    width={3126}
                    height={2172}
                    sizes="(max-width: 767px) calc(100vw - 3rem), 768px"
                    className="mx-auto h-auto w-full object-contain [content-visibility:visible] dark:hidden"
                  />
                  <Image
                    src="/darkshare.png"
                    alt="A conversation shared from Tiles as a public link on tiles.run, dark theme"
                    width={3118}
                    height={2162}
                    sizes="(max-width: 767px) calc(100vw - 3rem), 768px"
                    className="mx-auto hidden h-auto w-full object-contain [content-visibility:visible] dark:block"
                  />
                </div>
              </div>
              <p className="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
                A conversation shared from Tiles as a public link on tiles.run.
              </p>
            </div>
          </div>

          <h2 id="links-and-contact" className={`mt-16 ${marketingPageSectionTitleClass}`}>Links and contact</h2>

          <h3 className={`mt-8 ${marketingPageSubsectionTitleClass}`}>Links</h3>
          <ul className="mt-4 max-w-2xl space-y-2 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
            {siteLinks.map((link) => (
              <li key={link.label}>
                <span className="font-medium text-foreground">{link.label}:</span>{" "}
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={externalLinkClasses}>
                    {link.href}
                  </a>
                ) : (
                  <Link href={link.href} className={externalLinkClasses}>
                    {`https://www.tiles.run${link.href}`}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <h3 className={`mt-10 ${marketingPageSubsectionTitleClass}`}>Contact</h3>
          <div className="mt-4 max-w-2xl space-y-2 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
            <p>
              <span className="font-medium text-foreground">Press and general inquiries:</span>{" "}
              <a href="mailto:hello@tiles.run" className={externalLinkClasses}>
                hello@tiles.run
              </a>
            </p>
            <p>
              <span className="font-medium text-foreground">Phone:</span>{" "}
              <a href="tel:+917338014129" className={externalLinkClasses}>
                +91 7338014129
              </a>
            </p>
            <address className="not-italic">
              <span className="font-medium text-foreground">Address:</span> WeWork Prestige Atlanta, 80 Feet Rd,
              Koramangala, Bengaluru, IN 560034
            </address>
          </div>

          <h3 className={`mt-10 ${marketingPageSubsectionTitleClass}`}>Company details</h3>
          <dl className="mt-4 max-w-2xl divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
            {companyDetails.map((detail) => (
              <div key={detail.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                <dt className="w-36 shrink-0 text-sm font-medium leading-[1.7] text-foreground">{detail.label}</dt>
                <dd className="text-sm leading-[1.7] text-black/65 dark:text-[#B3B3B3]">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
