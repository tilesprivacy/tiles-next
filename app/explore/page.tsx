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
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white lg:h-auto lg:min-h-screen lg:overflow-visible">
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

      <div className="flex h-full flex-col pt-14 lg:h-auto lg:pt-20">
        {/* Content */}
        <main className="flex flex-1 flex-col items-center overflow-y-auto px-5 pb-6 pt-4 sm:px-6 lg:overflow-visible lg:px-12 lg:pb-16 lg:pt-4">
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
          <Link
            href="/explore"
            className="text-black/60 transition-colors hover:text-black"
          >
            Explore
          </Link>
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
    </div>
  )
}
