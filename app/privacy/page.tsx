import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-6">
        <div className="flex items-center gap-2 text-base font-medium text-black lg:text-lg">
          <Link href="/" className="transition-colors hover:text-black/70">
            <Image src="/lighticon.png" alt="Tiles" width={32} height={32} className="h-7 w-7 lg:h-8 lg:w-8" />
          </Link>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              <Image
                src="/apple-logo-white.svg"
                alt="Apple"
                width={16}
                height={20}
                className="h-3.5 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-4"
              />
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Download</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 lg:gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-white/70 group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col pt-16 lg:pt-24 lg:pb-24">
        {/* Content */}
        <main className="flex flex-1 flex-col items-start justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-16 lg:pb-32 lg:pt-20 w-full max-w-3xl mx-auto">
          <div className="w-full space-y-6 sm:space-y-8 text-sm leading-relaxed text-black/80 sm:text-base lg:text-lg lg:leading-relaxed">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-black sm:text-3xl lg:text-4xl">Privacy Policy</h1>
              <p className="text-xs text-black/60 sm:text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Your Data Stays Local</h2>
              <p>
                Tiles operates entirely on your device. All data, including your memory, preferences, and usage patterns, remains on your local machine. We do not have access to your data, and we do not collect it.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">No Tracking</h2>
              <p>
                We do not track your usage, collect analytics, or monitor your behavior. Tiles does not include any telemetry, tracking pixels, or analytics services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">No Data Collection</h2>
              <p>
                We do not collect, store, or transmit any personal information. This includes but is not limited to: your identity, location, device information, usage statistics, or any content you create with Tiles.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Open Source Transparency</h2>
              <p>
                Tiles is open source. You can review the source code to verify our privacy claims. The codebase is publicly available and auditable.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Website Privacy</h2>
              <p>
                This website may use standard web technologies like cookies for basic functionality. We do not use third-party analytics or advertising services. We do not track visitors across sites or build profiles of visitors.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Your Control</h2>
              <p>
                You have complete control over your data. You can delete it at any time, export it, or stop using Tiles entirely. Your data belongs to you.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs text-black/60 sm:text-sm">
                For questions about privacy, please contact us through our{" "}
                <a
                  href="https://github.com/tilesprivacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-black/70 underline"
                >
                  GitHub
                </a>
                {" "}or{" "}
                <a
                  href="https://go.tiles.run/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-black/70 underline"
                >
                  Discord
                </a>
                .
              </p>
            </div>

          </div>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}

