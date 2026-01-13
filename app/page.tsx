import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { fetchReleases } from "@/lib/releases"

export default async function Page() {
  let latestVersion = "0.0.0"

  try {
    const releases = await fetchReleases()
    if (releases.length > 0) {
      latestVersion = releases[0].version
    }
  } catch (error) {
    // Fallback to default version if fetch fails
  }
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <SiteHeader />

      {/* Main Content - properly spaced below fixed header */}
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-16 lg:pt-40 lg:pb-20">
        {/* Hero Section */}
        <div className="w-full max-w-6xl">
          {/* Top Section: Logo, Title, CTA */}
          <div className="flex flex-col items-center gap-8 mb-12 lg:mb-16">
            {/* Logo with Version badge */}
            <div className="relative">
              <div className="relative flex items-center justify-center rounded-3xl bg-[#F7F7F7] shadow-sm ring-1 ring-black/5 h-24 w-24 lg:h-32 lg:w-32">
                <Image
                  src="/cream.png"
                  alt="Tiles Logo"
                  width={112}
                  height={112}
                  className="h-14 w-14 lg:h-20 lg:w-20"
                />
              </div>
              <span className="absolute -right-2 -top-2 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black shadow-sm ring-1 ring-black/10 lg:-right-3 lg:-top-3 lg:px-3 lg:py-1.5 lg:text-xs">
                {latestVersion}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3 text-center lg:space-y-4">
              <h1 className="font-sans text-4xl font-bold tracking-tight text-black lg:text-6xl">
                Tiles
              </h1>
              <p className="text-base text-black/60 lg:text-xl max-w-lg mx-auto">
                Your private AI assistant for everyday use
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-3">
              <Button
                asChild
                className="group rounded-full bg-black px-6 py-5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 lg:px-8 lg:py-6 lg:text-base"
              >
                <Link href="/download" className="flex items-center gap-2.5">
                  <Image
                    src="/apple-logo-white.svg"
                    alt="Apple"
                    width={16}
                    height={20}
                    className="h-4 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-5"
                  />
                  <span>Download for Mac</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 lg:h-5 lg:w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </Button>
              <p className="text-xs text-black/40">
                for macOS 14+ with Apple Silicon (M1+).
              </p>
            </div>
          </div>

          {/* Features Section - Mobile: vertical stack, Desktop: horizontal grid */}
          <div className="w-full max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="flex items-start gap-3 lg:flex-col lg:items-center lg:gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-black/60 mt-1.5 lg:hidden"></div>
                <div className="flex-1 lg:flex-none lg:text-center">
                  <h3 className="text-sm lg:text-base font-semibold text-black mb-1.5 lg:mb-3">On-Device Models</h3>
                  <p className="text-sm lg:text-base text-black/60 leading-relaxed lg:mx-auto">
                    Run AI locally on your Mac. Your data stays private and secure.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3 lg:flex-col lg:items-center lg:gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-black/60 mt-1.5 lg:hidden"></div>
                <div className="flex-1 lg:flex-none lg:text-center">
                  <h3 className="text-sm lg:text-base font-semibold text-black mb-1.5 lg:mb-3">Code Interpreter</h3>
                  <p className="text-sm lg:text-base text-black/60 leading-relaxed lg:mx-auto">
                    Execute Python code and analyze data in real-time conversations.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3 lg:flex-col lg:items-center lg:gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-black/60 mt-1.5 lg:hidden"></div>
                <div className="flex-1 lg:flex-none lg:text-center">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5 lg:mb-3 lg:justify-center">
                    <h3 className="text-sm lg:text-base font-semibold text-black">AI Memory</h3>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] lg:text-[10px] font-medium uppercase tracking-wide text-black/50 ring-1 ring-black/10 bg-transparent font-mono">
                      INSIDERS
                    </span>
                  </div>
                  <p className="text-sm lg:text-base text-black/60 leading-relaxed lg:mx-auto">
                    Personalized assistance that learns and remembers your preferences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
