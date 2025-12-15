import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiSubstack, SiHuggingface } from "react-icons/si"

export default function AboutPage() {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-3 pt-4 lg:px-6 lg:pb-4 lg:pt-6">
        <Link
          href="/"
          className="text-sm text-black/60 transition-colors hover:text-black lg:text-base"
        >
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

      <div className="flex h-full flex-col pt-16 lg:pt-24">
        {/* Content */}
        <main className="flex flex-1 flex-col items-center overflow-y-auto px-6 pb-8 pt-4 lg:overflow-visible lg:px-12 lg:pb-10 lg:pt-2">
          <div className="w-full max-w-2xl text-center">
            <Link href="/" className="mb-6 inline-flex flex-col items-center gap-3 lg:mb-10 lg:gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9F9F9] shadow-sm lg:h-14 lg:w-14 lg:rounded-xl">
                <Image
                  src="/logo.png"
                  alt="Tiles Logo"
                  width={40}
                  height={40}
                  className="h-6 w-6 lg:h-10 lg:w-10"
                />
              </div>
              <h1 className="text-3xl font-bold text-black lg:text-5xl">Tiles Privacy</h1>
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
                </a>
                {" "}
                community with a simple idea: software should understand you without taking anything from you. We strive to deliver the best privacy-focused engineering while also offering unmatched convenience in our consumer products. We believe identity and memory belong together, and Tiles gives you a way to own both through your personal user agent.
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
                ), an independent researcher and technologist focused on on-device AI and secure identity, Tiles is built for privacy conscious users who want intelligence without renting their memory to centralized providers. Our first product is an on-device memory management system paired with an SDK that lets developers securely access user memory and create deeply personalized agent experiences.
              </p>

              <p>
                We are seeking design partners for training workloads that align with our goal of ensuring a verifiable privacy perimeter. If you're interested, please reach out to us at{" "}
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
        <footer className="z-10 flex shrink-0 flex-col gap-3 bg-white px-6 pb-4 pt-4 text-xs text-black/60 lg:gap-3 lg:px-6 lg:pb-6 lg:pt-6 lg:text-sm">
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
    </div>
  )
}

