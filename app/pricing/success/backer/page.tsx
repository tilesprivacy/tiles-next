import type { Metadata } from "next"
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
      <main className="flex flex-1 items-center px-4 pb-16 pt-[calc(8.75rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-[calc(10rem+env(safe-area-inset-top,0px))] lg:px-12 lg:pt-[calc(12rem+env(safe-area-inset-top,0px))]">
        <section className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-card-foreground">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Purchase complete</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Backer license confirmed</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Thank you for supporting Tiles. Your backer purchase was successful.
          </p>
          {checkoutId ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Checkout ID: <span className="font-mono text-foreground">{checkoutId}</span>
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-3">
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
      <SiteFooter />
    </div>
  )
}
