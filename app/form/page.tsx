import type { Metadata } from "next"
import { LinuxNotifyForm } from "@/components/linux-notify-form"
import { SiteFooter } from "@/components/site-footer"

const formTitle = "Sign up for the Tiles app"
const formDescription = "Sign up to get notified when the Tiles is available for Linux."

export const metadata: Metadata = {
  title: formTitle,
  description: formDescription,
  openGraph: {
    title: formTitle,
    description: formDescription,
    url: "https://www.tiles.run/form",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: formTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: formTitle,
    description: formDescription,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default function FormPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <main className="flex min-h-[calc(100dvh-4.5rem)] bg-background px-5 pb-10 pt-2 text-foreground sm:min-h-[calc(100dvh-5rem)] sm:px-8 sm:pb-14 sm:pt-9 lg:min-h-[calc(100dvh-5.5rem)] lg:px-12 lg:pb-16 lg:pt-4">
        <div className="mx-auto flex w-full max-w-4xl flex-col justify-center gap-7 sm:gap-9 lg:gap-10">
          <header className="text-center">
            <h1 className="mx-auto max-w-[18ch] text-balance font-sans text-[1.95rem] font-semibold leading-[0.98] tracking-[-0.048em] text-foreground sm:text-[2.4rem] lg:text-[3.2rem]">
              Sign up for Tiles on Linux
            </h1>
            <p className="mx-auto mt-4 max-w-[34rem] text-balance text-[0.91rem] leading-[1.72] text-black/55 dark:text-[#ABABAB] sm:text-[0.95rem] lg:text-[0.99rem]">
              Sign up to get notified when Tiles CLI is available for Linux.
            </p>
          </header>

          <div className="mx-auto w-full max-w-2xl">
            <LinuxNotifyForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
