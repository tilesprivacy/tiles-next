import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiSubstack, SiHuggingface } from "react-icons/si"

export default function Page() {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white lg:h-screen">
      <header className="absolute inset-x-0 top-0 z-10 flex justify-end px-4 pt-4 lg:px-6 lg:pt-6">
        <div className="flex items-center gap-2 lg:gap-3">
          <Button
            asChild
            variant="outline"
            className="h-8 rounded-full border-2 border-black/20 bg-white px-3 text-xs font-medium text-black hover:bg-black/5 lg:h-10 lg:px-4 lg:text-sm"
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 lg:gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 text-pink-500 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span>Sponsor</span>
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-8 rounded-full border-2 border-black bg-white px-3 text-xs font-medium text-black hover:bg-black/5 lg:h-10 lg:px-5 lg:text-sm"
          >
            <a href="https://registry.tiles.run/login">Login</a>
          </Button>
        </div>
      </header>

      {/* Desktop: Split Layout, Mobile: Stacked with image on top */}
      <div className="flex min-h-0 flex-1 flex-col lg:h-full lg:flex-row">
        {/* Mobile: Image at top - covers upper portion */}
        <div className="relative h-[35vh] shrink-0 lg:hidden">
          <Image
            src="/images/network-graph.png"
            alt="Network graph visualization showing data relationships"
            fill
            className="object-cover"
            priority
            loading="eager"
            unoptimized
          />
        </div>

        {/* Content Section */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-white px-6 py-4 lg:h-full lg:flex-[0.5] lg:shrink-0 lg:items-stretch lg:px-12 lg:pb-24 lg:pt-0">
          <div className="mx-auto flex w-full max-w-md flex-col gap-3 lg:gap-6">
            {/* Logo */}
            <div className="flex justify-center lg:justify-start">
<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#F9F9F9] shadow-sm sm:h-20 sm:w-20 sm:rounded-2xl lg:h-28 lg:w-28 lg:rounded-3xl">
                <Image
                  src="/logo.png"
                  alt="Tiles Logo"
                  width={80}
                  height={80}
                  className="h-11 w-11 sm:h-14 sm:w-14 lg:h-[84px] lg:w-[84px]"
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1 text-center lg:space-y-3 lg:text-left">
              <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-6xl">
                Tiles
              </h1>
              <p className="text-sm text-black/70 sm:text-base lg:text-xl">Your private AI assistant with offline memory</p>
            </div>

            {/* Platform Button */}
            <div className="space-y-2 lg:space-y-3">
              <div className="flex justify-center lg:justify-start">
                <Button
                  asChild
                  className="rounded-full bg-black px-4 py-4 text-sm font-medium text-white hover:bg-black/90 sm:px-5 sm:py-5 lg:px-8 lg:py-6 lg:text-lg"
                >
                  <a href="https://download.tiles.run/" className="flex items-center gap-2 sm:gap-3">
                    <Image
                      src="/apple-logo-white.svg"
                      alt="Apple"
                      width={20}
                      height={20}
                      className="h-4 w-4 lg:h-6 lg:w-6"
                    />
                    <span>Download</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="ml-2 h-4 w-4 sm:ml-3 lg:h-6 lg:w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] lg:justify-start lg:text-sm">
                <span className="rounded-full border border-black/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black/60 lg:text-xs">
                  Alpha
                </span>
                <span className="text-black/50">for macOS 14+ with Apple Silicon (M1+).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Image on Right, Mobile: Hidden */}
        <div className="hidden flex-[0.5] items-center justify-center bg-white px-6 lg:flex">
          <div className="relative h-full w-full">
            <Image
              src="/images/network-graph.png"
              alt="Network graph visualization showing data relationships"
              width={1200}
              height={1200}
              className="h-full w-full object-contain"
              priority
              loading="eager"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="z-10 flex shrink-0 flex-col gap-3 bg-white px-4 pb-3 pt-4 text-xs text-black/60 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:px-6 lg:py-4 lg:text-sm">
        <a
          href="https://www.blog.tiles.run/p/how-tiles-works"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-black/60 transition-colors hover:text-black"
        >
          How it works
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-2.5 w-2.5">
            <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <Link
          href="/about"
          className="text-black/60 transition-colors hover:text-black"
        >
          About
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-black/60">© 2025 Tiles Privacy</span>
          <div className="flex items-center gap-2.5 lg:gap-4">
          <a
            href="https://x.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="X (Twitter)"
          >
            <FaXTwitter className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://bsky.app/profile/tiles.run"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="Bluesky"
          >
            <FaBluesky className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://www.blog.tiles.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="Substack"
          >
            <SiSubstack className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://www.instagram.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="Instagram"
          >
            <FaInstagram className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://go.tiles.run/discord"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="Discord"
          >
            <FaDiscord className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://www.reddit.com/r/tilesprivacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="Reddit"
          >
            <FaReddit className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://github.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="GitHub"
          >
            <FaGithub className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://huggingface.co/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/60 transition-colors hover:text-black"
            aria-label="Hugging Face"
          >
              <SiHuggingface className="h-4 w-4 lg:h-5 lg:w-5" />
          </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
