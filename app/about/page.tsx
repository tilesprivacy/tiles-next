import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiSubstack, SiHuggingface } from "react-icons/si"

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-3 pt-4 lg:fixed lg:px-6 lg:pb-4 lg:pt-6">
        <Link href="/" className="text-sm text-black/60 transition-colors hover:text-black lg:text-base">
          ← Back
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
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

      <div className="flex flex-col pt-16 lg:pt-24">
        {/* Content */}
        <main className="flex flex-col items-center px-6 pb-8 pt-4 lg:px-12 lg:pb-12 lg:pt-2">
          <div className="w-full max-w-2xl text-center">
            <Link href="/" className="mb-6 inline-flex flex-col items-center gap-3 lg:mb-10 lg:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9F9F9] shadow-sm lg:h-14 lg:w-14 lg:rounded-xl">
                <Image src="/logo.png" alt="Tiles Logo" width={40} height={40} className="h-6 w-6 lg:h-10 lg:w-10" />
              </div>
            </Link>

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
                  href="https://x.com/feynon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black underline underline-offset-2 hover:text-black/70"
                >
                  @feynon
                </a>
                ), an independent researcher and technologist focused on on-device AI and secure identity, Tiles is
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

        {/* Footer */}
        <div className="relative flex flex-col">
          {/* Gradient Section */}
          <div className="h-96 bg-gradient-to-b from-white to-black lg:h-[500px]" />
          
          {/* Black Section with Content */}
          <div className="bg-black">
            {/* Tiles Privacy Header */}
            <div className="flex flex-col items-center justify-center px-6 pb-8 pt-12 lg:px-12 lg:pb-12 lg:pt-16">
              <h2 className="text-5xl font-bold text-white sm:text-6xl lg:text-8xl">
                Tiles Privacy
              </h2>
              
              {/* Status Indicator */}
              <div className="mt-8 flex items-center justify-center lg:mt-12">
                <iframe
                  src="https://status.tiles.run/badge?theme=dark"
                  width="250"
                  height="30"
                  frameBorder="0"
                  scrolling="no"
                  style={{ colorScheme: "normal" }}
                />
              </div>
            </div>
            
            {/* Footer */}
            <footer className="z-10 flex shrink-0 flex-col gap-3 px-4 pb-3 pt-4 text-xs text-white/60 lg:px-6 lg:py-4 lg:text-sm">
              <a
                href="https://www.tilekit.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-white/60 transition-colors hover:text-white"
              >
                Tilekit SDK
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
              <Link href="/about" className="font-medium text-white/60 transition-colors hover:text-white">
                About
              </Link>
              <div className="flex items-center justify-between">
                <span className="text-white/60">© 2025 Tiles Privacy</span>
                <div className="flex items-center gap-2.5 lg:gap-4">
                  <a
                    href="https://x.com/tilesprivacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="X (Twitter)"
                  >
                    <FaXTwitter className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                  <a
                    href="https://bsky.app/profile/tiles.run"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="Bluesky"
                  >
                    <FaBluesky className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                  <a
                    href="https://www.blog.tiles.run/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="Substack"
                  >
                    <SiSubstack className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/tilesprivacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                  <a
                    href="https://go.tiles.run/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="Discord"
                  >
                    <FaDiscord className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                  <a
                    href="https://www.reddit.com/r/tilesprivacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="Reddit"
                  >
                    <FaReddit className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                  <a
                    href="https://github.com/tilesprivacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="GitHub"
                  >
                    <FaGithub className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                  <a
                    href="https://huggingface.co/tilesprivacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 transition-colors hover:text-white"
                    aria-label="Hugging Face"
                  >
                    <SiHuggingface className="h-4 w-4 lg:h-5 lg:w-5" />
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
