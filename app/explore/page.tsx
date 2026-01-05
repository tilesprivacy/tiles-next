import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub } from "react-icons/fa6"
import { SiSubstack, SiHuggingface } from "react-icons/si"

const sections = [
  {
    id: "memory-graph",
    label: "Memory graph",
    heading: "View your memory graph in Obsidian",
    detail: "Interactive graph that lets you explore your memories in a clean, connected view.",
    image: "/obsidiangraph.png",
  },
  {
    id: "registry",
    label: "Registry",
    heading: "Download memory models and extensions",
    detail: "Download memory models and extensions from the Tiles Registry to enhance your experience.",
    image: "/tilesreg.png",
  },
  {
    id: "sdk",
    label: "SDK",
    heading: "Powered by Tilekit",
    detail: "Explore the design of our Rust based Modelfile SDK for private, cross-platform model customization and access.",
    image: "/mir.png",
  },
]

export default function ExplorePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white lg:overflow-visible">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-3 pt-4 lg:fixed lg:px-6 lg:pb-4 lg:pt-6">
        <Link
          href="/"
          className="text-sm text-black/60 transition-colors hover:text-black lg:text-base"
        >
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

      <div className="flex flex-col pt-14 lg:pt-20">
        {/* Content */}
        <main className="flex flex-col items-center px-5 pb-6 pt-4 sm:px-6 lg:px-12 lg:pb-16 lg:pt-4">
          <div className="w-full max-w-3xl">
            {/* Page Heading */}
            <h1 className="mb-6 text-center text-2xl font-bold text-black sm:text-3xl lg:mb-8 lg:text-4xl">
              Explore Tiles
            </h1>

            {/* Hero Section - CLI Image and Explainer */}
            <div className="mb-10 lg:mb-14">
              <div className="overflow-hidden rounded-lg border border-black/10 lg:rounded-xl">
                <Image
                  src="/tilescli.png"
                  alt="Tiles CLI Interface"
                  width={1200}
                  height={600}
                  className="w-full"
                  priority
                />
              </div>
              <p className="mt-3 text-center text-sm leading-relaxed text-black/60 lg:mt-4 lg:text-base">
                Tiles CLI runs on your device, remembers what you share, and helps you find it later. Memories are saved as Markdown and organized into a clear, connected graph that you and your agents can access.
              </p>
            </div>

            {/* Anchor Tabs */}
            <div className="mb-10 flex items-center justify-center gap-1.5 lg:mb-14 lg:gap-2">
              <span className="text-xs text-black/40 lg:text-sm">Explore</span>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full border border-black/15 px-3 py-0.5 text-xs text-black/60 transition-all hover:border-black/30 hover:text-black lg:px-4 lg:py-1 lg:text-sm"
                >
                  {section.label}
                </a>
              ))}
            </div>

            {/* All Sections */}
            <div className="space-y-12 lg:space-y-16">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 lg:scroll-mt-28"
                >
                  <h2 className="mb-3 text-center text-xl font-bold text-black sm:text-2xl lg:mb-4 lg:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="overflow-hidden rounded-lg border border-black/10 lg:rounded-xl">
                    <Image
                      src={section.image}
                      alt={section.heading}
                      width={1200}
                      height={700}
                      className="w-full"
                    />
                  </div>
                  <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-black/60 lg:mt-4 lg:text-base">
                    {section.detail}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="z-10 flex shrink-0 flex-col gap-2.5 bg-white px-5 pb-4 pt-6 text-xs text-black/60 sm:px-6 lg:gap-3 lg:px-6 lg:pb-6 lg:pt-8 lg:text-sm">
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
          <a
            href="https://status.tiles.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-black/60 transition-colors hover:text-black"
          >
            Status
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
            <span className="text-black/60">© 2026 Tiles Privacy</span>
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
