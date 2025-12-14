import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiSubstack, SiHuggingface } from "react-icons/si"

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white lg:h-screen lg:overflow-hidden">
      <div className="absolute right-4 top-4 z-10 lg:right-6 lg:top-6">
        <Button
          asChild
          variant="outline"
          className="rounded-full border-2 border-black bg-white px-5 py-2 text-sm font-medium text-black hover:bg-black/5 lg:px-6 lg:py-2"
        >
          <a href="https://registry.tiles.run/login">Login</a>
        </Button>
      </div>

      {/* Desktop: Split Layout, Mobile: Stacked with image on top */}
      <div className="flex flex-1 flex-col lg:h-full lg:flex-row">
        {/* Mobile: Image at top - flexible height */}
        <div className="flex flex-1 items-center justify-center bg-white lg:hidden">
          <div className="relative h-full w-full max-w-lg">
            <Image
              src="/images/network-graph.png"
              alt="Network graph visualization showing data relationships"
              width={800}
              height={640}
              className="h-full w-full object-contain"
              priority
              loading="eager"
              unoptimized
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-start bg-white px-6 pb-4 lg:h-full lg:flex-[0.5] lg:justify-center lg:px-12 lg:pb-16">
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
              <div className="flex justify-center lg:justify-start">
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
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs lg:justify-start lg:text-sm">
                <span className="rounded-full border border-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black/60 lg:text-xs">
                  Alpha
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
      <footer className="z-10 flex flex-col gap-2 bg-white px-4 py-3 text-xs text-black/60 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:px-6 lg:py-4 lg:text-sm">
        <a
          href="https://www.blog.tiles.run/p/how-tiles-works"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-black/60 transition-colors hover:text-black"
        >
          How it works
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3 w-3 lg:h-3.5 lg:w-3.5"
          >
            <path
              fillRule="evenodd"
              d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <div className="flex items-center justify-between">
          <div>
            © 2025 Tiles{" "}
            <a href="#" className="text-black/60 hover:text-black">
              Privacy
            </a>
          </div>
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
