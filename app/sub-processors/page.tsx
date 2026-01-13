import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tiles Subprocessors",
  description: "Third-party subprocessors that Tiles uses to provide services.",
  openGraph: {
    title: "Tiles Subprocessors",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Subprocessors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Subprocessors",
    description: "Third-party subprocessors that Tiles uses to provide services.",
    images: ["/api/og"],
  },
}

export default function SubProcessorsPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground lg:overflow-visible">
      <SiteHeader themeAware />

      <div className="flex flex-1 flex-col pt-16 lg:pt-24 lg:pb-24">
        {/* Content */}
        <main className="flex flex-1 flex-col items-start justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 px-4 sm:px-6 md:px-8 lg:px-12 pb-20 pt-16 lg:pb-32 lg:pt-20 w-full max-w-3xl mx-auto">
          <div className="w-full space-y-6 sm:space-y-8 text-sm leading-relaxed text-foreground/80 sm:text-base lg:text-lg lg:leading-relaxed">
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">Subprocessors</h1>
              <p className="text-xs text-foreground/60 sm:text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="space-y-4">
              <p>
                This page lists the third-party subprocessors that Tiles uses to provide our services. These subprocessors may process personal data on our behalf in connection with the operation of our website and services.
              </p>
            </div>

            <div className="space-y-8 sm:space-y-10">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">Vercel</h3>
                <div className="space-y-1.5 text-sm text-foreground/70 sm:text-base">
                  <p>
                    <span className="font-medium text-foreground/80">Purpose:</span> Server hosting
                  </p>
                  <p>
                    <span className="font-medium text-foreground/80">Location:</span> US
                  </p>
                  <p>
                    <span className="font-medium text-foreground/80">Reference:</span>{" "}
                    <a
                      href="https://vercel.com/legal/dpa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-foreground/70 underline transition-colors"
                    >
                      DPA
                    </a>
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground sm:text-xl">Resend</h3>
                <div className="space-y-1.5 text-sm text-foreground/70 sm:text-base">
                  <p>
                    <span className="font-medium text-foreground/80">Purpose:</span> Email sending
                  </p>
                  <p>
                    <span className="font-medium text-foreground/80">Location:</span> US
                  </p>
                  <p>
                    <span className="font-medium text-foreground/80">Reference:</span>{" "}
                    <a
                      href="https://resend.com/legal/dpa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground hover:text-foreground/70 underline transition-colors"
                    >
                      DPA
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs text-foreground/60 sm:text-sm">
                We will update this page when we add or remove subprocessors. For questions about our subprocessors, please contact us through our{" "}
                <a
                  href="https://github.com/tilesprivacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-foreground/70 underline"
                >
                  GitHub
                </a>
                {" "}or{" "}
                <a
                  href="https://go.tiles.run/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-foreground/70 underline"
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
