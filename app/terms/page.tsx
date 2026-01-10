import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function TermsPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      <SiteHeader />

      <div className="flex flex-1 flex-col pt-16 lg:pt-24 lg:pb-24">
        {/* Content */}
        <main className="flex flex-1 flex-col items-start justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-16 lg:pb-32 lg:pt-20 w-full max-w-3xl mx-auto">
          <div className="w-full space-y-6 sm:space-y-8 text-sm leading-relaxed text-black/80 sm:text-base lg:text-lg lg:leading-relaxed">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-black sm:text-3xl lg:text-4xl">Terms of Use</h1>
              <p className="text-xs text-black/60 sm:text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Acceptance of Terms</h2>
              <p>
                By using Tiles, you agree to these Terms of Use. If you do not agree, please do not use Tiles.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Privacy-First Design</h2>
              <p>
                Tiles is designed with privacy as a core principle. Your data remains on your device. We do not collect, store, or transmit your personal information or usage data to our servers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Open Source License</h2>
              <p>
                Tiles is open source software. The source code is available under its respective license. You are free to use, modify, and distribute Tiles in accordance with that license.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">No Warranty</h2>
              <p>
                Tiles is provided "as is" without warranty of any kind. We make no guarantees about its functionality, reliability, or suitability for any purpose.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, we are not liable for any damages arising from your use of Tiles.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-black sm:text-xl lg:text-2xl">Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of Tiles after changes constitutes acceptance of the updated terms.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs text-black/60 sm:text-sm">
                For questions about these terms, please contact us through our{" "}
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

