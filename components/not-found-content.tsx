import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import {
  marketingPageMetaClass,
  marketingPageTitleClass,
} from "@/lib/marketing-page-title-classes"

interface NotFoundContentProps {
  /** Book layout already renders `SiteFooter`. */
  variant?: "default" | "book"
}

export function NotFoundContent({ variant = "default" }: NotFoundContentProps) {
  const isBook = variant === "book"

  const main = (
    <main
      className={
        isBook
          ? "flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20"
          : "flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]"
      }
    >
      <div className="mx-auto w-full max-w-md text-center">
        <p className={`mb-3 tabular-nums ${marketingPageMetaClass}`}>404</p>
        <h1 className={marketingPageTitleClass}>Page not found</h1>
        <p className="mt-8">
          <Link
            href="/"
            className="text-sm text-foreground underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >
            Back to home
          </Link>
        </p>
      </div>
    </main>
  )

  if (isBook) {
    return main
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {main}
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
