import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiSubstack, SiHuggingface } from "react-icons/si"

export default function Page() {
  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Desktop: Split Layout, Mobile: Stacked with image on top */}
      <div className="flex h-full flex-col lg:flex-row">
        {/* Mobile: Image at top - 50% height */}
        <div className="flex h-[50vh] items-center justify-center bg-white lg:hidden">
          <div className="relative h-full w-full max-w-lg">
            <Image
              src="/images/network-graph.png"
              alt="Network graph visualization showing data relationships"
              width={1000}
              height={800}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex h-[50vh] flex-col justify-start bg-white px-6 pb-8 lg:h-full lg:flex-[0.5] lg:justify-center lg:px-12 lg:pb-16">
          <div className="mx-auto w-full max-w-md space-y-3 lg:space-y-6">
            <div className="flex justify-center lg:justify-start">
              <Image
                src="/logo.png"
                alt="Tiles Logo"
                width={72}
                height={72}
                className="h-[58px] w-[58px] rounded-xl lg:h-24 lg:w-24 lg:rounded-2xl"
              />
            </div>

            <div className="space-y-1 text-center lg:space-y-3 lg:text-left">
              <h1 className="font-sans text-4xl font-bold leading-tight tracking-tight text-black lg:text-5xl">
                Tiles
              </h1>
              <p className="text-base text-black/70 lg:text-lg">Your private AI assistant with offline memory</p>
            </div>

            {/* Platform Buttons */}
            <div className="space-y-3 lg:space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="rounded-full bg-black px-6 py-5 text-sm font-medium text-white hover:bg-black/90 lg:px-8 lg:py-5 lg:text-base"
                >
                  <a href="https://download.tiles.run/">
                    <Image
                      src="/apple-logo-white.svg"
                      alt="Apple"
                      width={20}
                      height={20}
                      className="mr-2 h-4 w-4 lg:h-5 lg:w-5"
                    />
                    Download Tiles
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-2 border-black bg-white px-6 py-5 text-sm font-medium text-black hover:bg-black/5 lg:px-8 lg:py-5 lg:text-base"
                >
                  <a href="https://www.blog.tiles.run/p/how-tiles-works">How it works</a>
                </Button>
              </div>

              {/* ALPHA badge with description - Desktop only */}
              <div className="hidden items-center gap-2 text-sm lg:flex">
                <span className="rounded-full border-2 border-black/20 bg-white px-3 py-1 font-medium text-black">
                  ALPHA
                </span>
                <span className="text-black/50">for macOS 14+ with Apple Silicon (M1 or better).</span>
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
              width={1400}
              height={1400}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-white px-4 py-2 text-xs text-black/60 lg:px-6 lg:py-4 lg:text-sm">
        <div>
          © 2025 Tiles
          <a href="#" className="ml-2 text-black/60 hover:text-black">
            Privacy
          </a>
        </div>

        <div className="flex items-center gap-4">
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
      </footer>
    </div>
  )
}
