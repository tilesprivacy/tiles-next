import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <SiteHeader />

      {/* Desktop: Split Layout, Mobile: Stacked with image on top */}
      <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:min-h-0">
        {/* Content Section */}
        <div className="relative z-10 flex flex-1 flex-col bg-transparent px-6 pb-4 lg:min-h-0 lg:items-center lg:justify-center lg:bg-white lg:flex-[0.45] lg:shrink-0 lg:px-12">
          {/* Mobile: Graph image - bottom layer (z-0), covers top 50% of viewport to cover top 50% of logo */}
          <div
            className="absolute inset-x-0 top-0 z-0 overflow-hidden bg-white lg:hidden"
            style={{ height: "50dvh" }}
          >
            <Image
              src="/graph.png"
              alt="Network graph visualization showing data relationships"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Desktop: Centered container with logo above text */}
          <div className="relative z-20 mx-auto flex w-full max-w-md flex-col items-center gap-2 pb-8 pt-[calc(50dvh+var(--mobile-logo-half)+1rem)] lg:pt-0 lg:gap-6">
            {/* Mobile: Logo container - middle layer (z-20), positioned at 50% of page height */}
            <div className="absolute left-1/2 top-[50dvh] z-20 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 lg:mb-4">
              <div className="relative">
                {/* Logo container - full logo visible */}
                <div
                  className="relative z-20 flex items-center justify-center rounded-xl bg-[#F9F9F9] shadow-sm ring-1 ring-black/5 sm:rounded-2xl lg:rounded-3xl lg:ring-0"
                  style={{ height: "var(--mobile-logo-size)", width: "var(--mobile-logo-size)" }}
                >
                  <Image
                    src="/logo.png"
                    alt="Tiles Logo"
                    width={80}
                    height={80}
                    className="h-11 w-11 sm:h-14 sm:w-14 lg:h-[84px] lg:w-[84px]"
                  />
                </div>
                {/* Alpha text - top layer (z-30) */}
                <span className="absolute -right-1 -top-1 z-30 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600 shadow-sm ring-1 ring-blue-200/50 sm:-right-1.5 sm:-top-1.5 sm:px-2 sm:py-0.5 sm:text-[10px] lg:-right-2 lg:-top-2 lg:px-2.5 lg:py-1 lg:text-xs">
                  Alpha
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5 text-center lg:space-y-4">
              <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-6xl">
                Tiles
              </h1>
              <p className="text-sm text-black/70 sm:text-base lg:text-xl">
                Your private AI assistant with offline memory
              </p>
            </div>

            {/* Platform Button */}
            <div className="space-y-2 lg:space-y-4">
              <div className="flex justify-center">
                <Button
                  asChild
                  className="group rounded-full bg-black px-4 py-4 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-black/90 hover:shadow-lg active:scale-95 sm:px-5 sm:py-5 lg:px-8 lg:py-6 lg:text-lg"
                >
                  <Link href="/download" className="flex items-center gap-2 sm:gap-3">
                    <Image
                      src="/apple-logo-white.svg"
                      alt="Apple"
                      width={16}
                      height={20}
                      className="h-4 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-6"
                    />
                    <span className="transition-all duration-300">Download</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:ml-3 lg:h-6 lg:w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] lg:text-sm">
                <span className="text-black/50">for macOS 14+ with Apple Silicon (M1+).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Image on Right, Mobile: Hidden */}
        <div className="hidden flex-[0.55] items-center justify-center bg-white p-8 lg:flex lg:py-20 lg:pb-40">
          <div className="relative min-h-[400px] w-full lg:min-h-[600px]">
            <Image
              src="/graph.png"
              alt="Network graph visualization showing data relationships"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
