import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"

export default function Page() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-white xl:h-screen xl:overflow-hidden">
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-3 pt-4 xl:fixed lg:px-6 lg:pb-4 lg:pt-6">
        <div className="flex-1" aria-hidden="true" />
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 overflow-hidden rounded-full bg-black p-0 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:text-sm"
          >
            <a
              href="https://github.com/tilesprivacy/tiles"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <div className="flex items-center justify-center px-3 lg:px-4">
                <FaGithub className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </div>
              <div className="h-full w-px bg-white/20"></div>
              <div className="flex items-center justify-center px-3 lg:px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 lg:h-4 lg:w-4"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </a>
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
                className="h-3.5 w-3.5 fill-[#ff8fb6] transition-all duration-300 group-hover:scale-110 group-hover:fill-[#ffc2dd] group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Desktop: Split Layout, Mobile: Stacked with image on top */}
      <div className="flex flex-1 flex-col lg:flex-row xl:min-h-0 xl:h-full">
        {/* Content Section */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-start bg-transparent px-6 pb-4 lg:justify-center lg:bg-white lg:pt-20 lg:pb-4 lg:flex-[0.45] lg:shrink-0 lg:items-stretch lg:px-12 lg:pb-24 xl:min-h-0 xl:pt-0 xl:h-full">
          {/* Mobile: Spacer to push content down */}
          <div className="shrink-0 lg:hidden" style={{ height: "var(--mobile-hero-offset)" }} />

          {/* Mobile: Image at top - extends to 50% of logo height */}
          <div
            className="absolute inset-x-0 top-0 overflow-hidden bg-white lg:hidden"
            style={{ height: "var(--mobile-graph-height)" }}
          >
            <img
              src="/graph.png?v=2"
              alt="Network graph visualization showing data relationships"
              className="h-full w-full object-cover"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col gap-3 lg:gap-6">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div
                  className="flex items-center justify-center rounded-xl bg-[#F9F9F9] shadow-sm ring-1 ring-black/5 sm:rounded-2xl lg:rounded-3xl lg:ring-0"
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
                <span className="absolute -right-1 -top-1 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600 shadow-sm ring-1 ring-blue-200/50 sm:-right-1.5 sm:-top-1.5 sm:px-2 sm:py-0.5 sm:text-[10px] lg:-right-2 lg:-top-2 lg:px-2.5 lg:py-1 lg:text-xs">
                  Alpha
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1 text-center lg:space-y-3 lg:text-left">
              <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-6xl">
                Tiles
              </h1>
              <p className="text-sm text-black/70 sm:text-base lg:text-xl">
                Your private AI assistant with offline memory
              </p>
            </div>

            {/* Platform Button */}
            <div className="space-y-2 lg:space-y-3">
              <div className="flex justify-center lg:justify-start">
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

              <div className="flex items-center justify-center gap-1.5 text-[10px] lg:justify-start lg:text-sm">
                <span className="text-black/50">for macOS 14+ with Apple Silicon (M1+).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Image on Right, Mobile: Hidden */}
        <div className="hidden flex-[0.55] items-center justify-center bg-white p-4 lg:flex">
          <div className="relative min-h-[400px] w-full lg:min-h-[500px] xl:h-full">
            <Image
              src="/graph.png?v=2"
              alt="Network graph visualization showing data relationships"
              fill
              className="object-contain"
              priority
              loading="eager"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 flex shrink-0 flex-col gap-3 bg-white px-4 pb-3 pt-4 text-xs text-black/60 lg:px-6 lg:py-4 lg:text-sm xl:absolute xl:bottom-0 xl:left-0 xl:right-0">
        <a
          href="https://www.tiles.run/book"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-black/60 transition-colors hover:text-black"
        >
          Book
        </a>
        <Link href="/blog" className="font-medium text-black/60 transition-colors hover:text-black">
          Blog
        </Link>
        <Link href="/about" className="font-medium text-black/60 transition-colors hover:text-black">
          About
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-black/60">© 2026 Tiles Privacy</span>
          <div className="flex items-center gap-2.5 lg:gap-4">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#000000] group-active:text-[#000000] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0085FF] group-active:text-[#0085FF] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#E4405F] group-active:text-[#E4405F] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#5865F2] group-active:text-[#5865F2] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://www.reddit.com/r/tilesprivacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Reddit"
            >
              <FaReddit className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF4500] group-active:text-[#FF4500] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#181717] group-active:text-[#181717] lg:h-5 lg:w-5" />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FFD21E] group-active:text-[#FFD21E] lg:h-5 lg:w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
