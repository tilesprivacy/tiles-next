import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"

export function BookFooter() {
  return (
    <footer className="z-10 flex shrink-0 flex-col gap-3 bg-background px-4 pb-3 pt-4 text-xs text-foreground/60 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:px-6 lg:py-4 lg:text-sm">
      <Link href="/book" className="font-medium text-foreground/60 transition-colors hover:text-foreground">
        Book
      </Link>
      <Link href="/blog" className="font-medium text-foreground/60 transition-colors hover:text-foreground">
        Blog
      </Link>
      <Link href="/about" className="font-medium text-foreground/60 transition-colors hover:text-foreground">
        About
      </Link>
      <div className="flex items-center justify-between">
        <span className="text-foreground/60">© 2026 Tiles Privacy</span>
        <div className="flex items-center gap-2.5 lg:gap-4">
          <a
            href="https://x.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="X (Twitter)"
          >
            <FaXTwitter className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-foreground dark:group-hover:text-foreground group-active:text-foreground dark:group-active:text-foreground lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://bsky.app/profile/tiles.run"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="Bluesky"
          >
            <FaBluesky className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0085FF] group-active:text-[#0085FF] lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://www.instagram.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="Instagram"
          >
            <FaInstagram className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#E4405F] group-active:text-[#E4405F] lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://go.tiles.run/discord"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="Discord"
          >
            <FaDiscord className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#5865F2] group-active:text-[#5865F2] lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://www.reddit.com/r/tilesprivacy/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="Reddit"
          >
            <FaReddit className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FF4500] group-active:text-[#FF4500] lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://github.com/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="GitHub"
          >
            <FaGithub className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-foreground dark:group-hover:text-foreground group-active:text-foreground dark:group-active:text-foreground lg:h-5 lg:w-5" />
          </a>
          <a
            href="https://huggingface.co/tilesprivacy"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="Hugging Face"
          >
            <SiHuggingface className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-[#FFD21E] group-active:text-[#FFD21E] lg:h-5 lg:w-5" />
          </a>
          <a
            href="/api/rss"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center"
            aria-label="RSS Feed"
          >
            <FaRss className="h-4 w-4 text-foreground/60 transition-all duration-300 group-hover:scale-110 group-hover:text-orange-500 group-active:text-orange-500 lg:h-5 lg:w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

