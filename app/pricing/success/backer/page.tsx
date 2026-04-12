import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Backer Purchase Success",
  description: "Backer purchase success confirmation for Tiles.",
}

interface BackerPurchaseSuccessPageProps {
  searchParams?: Promise<{
    checkout_id?: string
  }>
}

export default async function BackerPurchaseSuccessPage({ searchParams }: BackerPurchaseSuccessPageProps) {
  const params = searchParams ? await searchParams : undefined
  const checkoutId = params?.checkout_id

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <main className="flex flex-1 items-center px-4 pb-14 pt-[calc(8.75rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-[calc(10rem+env(safe-area-inset-top,0px))] lg:px-12 lg:pt-[calc(12rem+env(safe-area-inset-top,0px))]">
        <section className="mx-auto w-full max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">Thanks for your support</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Backer license confirmed</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Thank you for supporting Tiles. Your backer purchase was successful.
          </p>
          {checkoutId ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Checkout ID: <span className="font-mono text-foreground">{checkoutId}</span>
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
            >
              Back to pricing
            </Link>
            <Link
              href="/download"
              className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Continue to download
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
