import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tiles Privacy Policy",
  description: "Read our Privacy Policy and how it relates to you.",
  openGraph: {
    title: "Tiles Privacy Policy",
    description: "Read our Privacy Policy and how it relates to you.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Privacy Policy",
    description: "Read our Privacy Policy and how it relates to you.",
    images: ["/api/og"],
  },
}

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      <SiteHeader />

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
