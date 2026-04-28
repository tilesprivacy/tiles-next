import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Download } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Backer Purchase Success | Tiles",
  description: "Backer purchase success confirmation for Tiles.",
}

interface BackerPurchaseSuccessPageProps {
  searchParams?: Promise<{
    checkoutId?: string
    checkout_id?: string
  }>
}

export default async function BackerPurchaseSuccessPage({ searchParams }: BackerPurchaseSuccessPageProps) {
  const params = searchParams ? await searchParams : undefined
  const checkoutId = params?.checkoutId ?? params?.checkout_id

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 items-center px-4 pb-14 pt-[calc(8.75rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-[calc(10rem+env(safe-area-inset-top,0px))] lg:px-12 lg:pt-[calc(12rem+env(safe-area-inset-top,0px))]">
        <section className="mx-auto w-full max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">Thanks for your support</p>
          <h1 className="mb-4 mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Backer license confirmed</h1>
          <div className="mx-auto mt-2 max-w-xl space-y-3 text-base leading-relaxed text-muted-foreground">
            <p>
              Please check your email for your license key. You can access and manage your purchases in the{" "}
              <a
                href="https://polar.sh/tilesprivacy/portal/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 text-foreground hover:opacity-80"
              >
                Tiles Privacy Customer Portal
              </a>
              .
            </p>
            <p>
              To activate your license, run <code className="font-mono text-foreground">tiles activate &lt;license-key&gt;</code>. Learn
              more on the{" "}
              <Link href="/book/licenses" className="underline underline-offset-2 text-foreground hover:opacity-80">
                licenses page
              </Link>
              .
            </p>
            <p>
              For any other help, please contact{" "}
              <a href="mailto:support@tiles.run" className="underline underline-offset-2 text-foreground hover:opacity-80">
                support@tiles.run
              </a>
              .
            </p>
          </div>
          {checkoutId ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Checkout ID: <span className="font-mono text-foreground">{checkoutId}</span>
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center justify-center rounded-sm border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
            >
              Back to pricing
            </Link>
            <Link
              href="/download"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Continue to download
              <Download className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <section
        className="bg-background px-4 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-3 lg:px-12 lg:pb-14 lg:pt-4"
        aria-label="Tiles wordmark"
      >
        <div className="mx-auto flex max-w-6xl justify-center">
          <Image
            src="/tiles_banner_outline_blk.svg"
            alt="Tiles"
            width={1200}
            height={220}
            className="h-auto w-full max-w-lg min-[390px]:max-w-xl sm:max-w-2xl lg:max-w-3xl dark:hidden"
          />
          <Image
            src="/tiles_banner_outline_wht.svg"
            alt="Tiles"
            width={1200}
            height={220}
            className="hidden h-auto w-full max-w-lg min-[390px]:max-w-xl sm:max-w-2xl lg:max-w-3xl dark:block"
          />
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
