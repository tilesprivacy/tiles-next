import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiSubstack, SiHuggingface } from "react-icons/si"
import { StatusIndicator } from "@/components/status-indicator"

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* Header - Fixed across full width */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 lg:fixed lg:px-6 lg:py-6">
        <Link href="/" className="text-sm text-black/60 transition-colors hover:text-black lg:text-base">
          ← Back
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 overflow-hidden rounded-full bg-neutral-700 p-0 text-xs font-medium text-white hover:bg-neutral-600 lg:h-10 lg:text-sm"
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
            className="h-8 rounded-full bg-neutral-700 px-3 text-xs font-medium text-white hover:bg-neutral-600 lg:h-10 lg:px-4 lg:text-sm"
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
                fill="currentColor"
                className="h-3.5 w-3.5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500 group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Left Section - Content */}
      <div className="relative flex flex-col lg:w-1/2 lg:min-h-0 lg:h-full lg:overflow-y-auto">

        <div className="flex flex-col pt-16 lg:pt-24 lg:pb-24">
          {/* Content */}
          <main className="flex flex-col items-start px-6 pb-8 pt-4 lg:px-12 lg:pb-32 lg:pt-2">
            <div className="w-full max-w-2xl text-left">
              <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:mb-10 lg:text-5xl xl:text-6xl">
                Tiles Privacy
              </h1>

              <div className="space-y-6 text-sm leading-relaxed text-black/80 sm:text-base lg:space-y-8 lg:text-xl lg:leading-relaxed">
                <p className="text-base font-medium text-black sm:text-lg lg:text-2xl">
                  Our mission is to shape the future of software personalization with decentralized memory networks.
                </p>

                <p>
                  Tiles Privacy was born from the
                  <a
                    href="https://userandagents.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black underline underline-offset-2 hover:text-black/70"
                  >
                    {" "}
                    User &amp; Agents
                  </a>{" "}
                  community with a simple idea: software should understand you without taking anything from you. We strive
                  to deliver the best privacy-focused engineering while also offering unmatched convenience in our
                  consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both
                  through your personal user agent.
                </p>

                <p>
                  Founded by Ankesh Bharti (
                  <a
                    href="https://x.com/feynon_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black underline underline-offset-2 hover:text-black/70"
                  >
                    @feynon
                  </a>
                  ), an independent researcher and technologist, Tiles is
                  built for privacy conscious users who want intelligence without renting their memory to centralized
                  providers. Our first product is an on-device memory management system paired with an SDK that lets
                  developers securely access user memory and create deeply personalized agent experiences.
                </p>

                <p>
                  We are seeking design partners for training workloads that align with our goal of ensuring a verifiable
                  privacy perimeter. If you're interested, please reach out to us at{" "}
                  <a
                    href="mailto:hello@tiles.run"
                    className="text-black underline underline-offset-2 hover:text-black/70"
                  >
                    hello@tiles.run
                  </a>
                  .
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Footer - only visible on mobile */}
        <footer className="z-10 flex shrink-0 flex-col gap-3 bg-white px-4 pb-3 pt-4 text-xs text-black/60 lg:hidden">
          <a
            href="https://book.tiles.run"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-black/60 transition-colors hover:text-black"
          >
            Tiles Book
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-2.5 w-2.5"
            >
              <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <Link href="/about" className="font-medium text-black/60 transition-colors hover:text-black">
            About
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-black/60">© 2025 Tiles Privacy</span>
              <StatusIndicator />
            </div>
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
                href="https://www.blog.tiles.run/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center"
                aria-label="Substack"
              >
                <SiSubstack className="h-4 w-4 text-black/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF6719] group-active:text-[#FF6719] lg:h-5 lg:w-5" />
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

        {/* Desktop Footer - Scrollable within left section */}
        <footer className="z-10 hidden shrink-0 flex-col gap-3 bg-white px-6 py-4 text-sm text-black/60 lg:flex">
          <a
            href="https://book.tiles.run"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-black/60 transition-colors hover:text-black"
          >
            Tiles Book
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-2.5 w-2.5"
            >
              <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <Link href="/about" className="font-medium text-black/60 transition-colors hover:text-black">
            About
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-black/60">© 2025 Tiles Privacy</span>
            <StatusIndicator />
          </div>
        </footer>
      </div>

      {/* Right Section - Logo Hero (Desktop only) */}
      <aside className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#0E0E0C]">
        <div className="flex flex-col items-center gap-10">
          <Image 
            src="/dark.jpeg" 
            alt="Tiles Logo" 
            width={140} 
            height={140} 
            className="h-32 w-32"
          />
          <p className="text-white/90 text-xl font-medium tracking-tight text-center px-8">
            Your private AI assistant with offline memory
          </p>
        </div>
      </aside>


      {/* Social Icons - Fixed at bottom right */}
      <div className="z-30 hidden lg:flex fixed bottom-0 right-0 w-1/2 items-center justify-end gap-4 px-6 py-4">
        <a
          href="https://x.com/tilesprivacy"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="X (Twitter)"
        >
          <FaXTwitter className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-white group-active:text-white" />
        </a>
        <a
          href="https://bsky.app/profile/tiles.run"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="Bluesky"
        >
          <FaBluesky className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0085FF] group-active:text-[#0085FF]" />
        </a>
        <a
          href="https://www.blog.tiles.run/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="Substack"
        >
          <SiSubstack className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF6719] group-active:text-[#FF6719]" />
        </a>
        <a
          href="https://www.instagram.com/tilesprivacy"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="Instagram"
        >
          <FaInstagram className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-[#E4405F] group-active:text-[#E4405F]" />
        </a>
        <a
          href="https://go.tiles.run/discord"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="Discord"
        >
          <FaDiscord className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-[#5865F2] group-active:text-[#5865F2]" />
        </a>
        <a
          href="https://www.reddit.com/r/tilesprivacy/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="Reddit"
        >
          <FaReddit className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF4500] group-active:text-[#FF4500]" />
        </a>
        <a
          href="https://github.com/tilesprivacy"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="GitHub"
        >
          <FaGithub className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-white group-active:text-white" />
        </a>
        <a
          href="https://huggingface.co/tilesprivacy"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center"
          aria-label="Hugging Face"
        >
          <SiHuggingface className="h-5 w-5 text-white/70 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FFD21E] group-active:text-[#FFD21E]" />
        </a>
      </div>
    </div>
  )
}
