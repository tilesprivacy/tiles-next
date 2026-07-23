import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"
import { marketingPageTitleClass } from "@/lib/marketing-page-title-classes"

type PricingSuccessVariant = "commercial" | "backer"

const copy: Record<
  PricingSuccessVariant,
  { title: string; description: string; licenseAnchor: string; licenseLabel: string }
> = {
  commercial: {
    title: "Thank you for your support",
    description:
      "Your Commercial license purchase is complete. Activate it in the Tiles app when you are ready, using the steps in the book.",
    licenseAnchor: "/book/licenses#commercial",
    licenseLabel: "Commercial license details",
  },
  backer: {
    title: "Thank you for your support",
    description:
      "Your Backer purchase is complete. Activate it in the Tiles app when you are ready, using the steps in the book.",
    licenseAnchor: "/book/licenses#backer",
    licenseLabel: "Backer license details",
  },
}

export function PricingSuccessContent({ variant }: { variant: PricingSuccessVariant }) {
  const c = copy[variant]
  const primaryButtonClass = `h-10 w-fit rounded-sm px-5 text-sm sm:text-base ${themeAwareHeaderPrimaryCtaClasses}`
  const secondaryButtonClass =
    `h-10 w-fit rounded-sm px-5 text-sm sm:text-base ${themeAwareHeaderPrimaryCtaClasses}`

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 flex-col pb-16 pt-[calc(8.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(10rem+env(safe-area-inset-top,0px))] lg:pb-20 lg:pt-[calc(12rem+env(safe-area-inset-top,0px))]">
        <section className="px-4 sm:px-6 lg:px-12">
          <div className="mx-auto w-full max-w-2xl space-y-6 text-center sm:space-y-8">
            <h1 className={marketingPageTitleClass}>
              {c.title}
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">{c.description}</p>
            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className={primaryButtonClass}>
                <Link href={c.licenseAnchor}>{c.licenseLabel}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className={secondaryButtonClass}>
                <Link href="/download">Download Tiles</Link>
              </Button>
            </div>
            <p className="pt-4 text-sm text-muted-foreground">
              Questions?{" "}
              <a href="mailto:support@tiles.run" className="underline underline-offset-2 transition-opacity hover:opacity-80">
                support@tiles.run
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
