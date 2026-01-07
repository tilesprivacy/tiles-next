import Link from "next/link"
import { FaXTwitter, FaBluesky, FaInstagram, FaDiscord, FaReddit, FaGithub, FaRss } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"

export function SiteFooter() {
  return (
    <footer className="relative z-20 shrink-0 h-[10dvh] border-t border-white/5 bg-black px-4 sm:px-6 overflow-hidden">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-2 sm:gap-3 lg:gap-4">
        {/* Main content - consistent layout on mobile and desktop */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Links - horizontal on all screens, always visible */}
          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm flex-shrink-0">
            <Link href="/book" className="text-white/50 transition-colors hover:text-white whitespace-nowrap">
              Book
            </Link>
            <Link href="/blog" className="text-white/50 transition-colors hover:text-white whitespace-nowrap">
              Blog
            </Link>
            <Link href="/manifesto" className="text-white/50 transition-colors hover:text-white whitespace-nowrap">
              Manifesto
            </Link>
          </nav>

          {/* Social icons - right aligned on all screens */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
            <a
              href="https://x.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-white/70" />
            </a>
            <a
              href="https://bsky.app/profile/tiles.run"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Bluesky"
            >
              <FaBluesky className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-[#0085FF]" />
            </a>
            <a
              href="https://www.instagram.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-[#E4405F]" />
            </a>
            <a
              href="https://go.tiles.run/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Discord"
            >
              <FaDiscord className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-[#5865F2]" />
            </a>
            <a
              href="https://www.reddit.com/r/tilesprivacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Reddit"
            >
              <FaReddit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-[#FF4500]" />
            </a>
            <a
              href="https://github.com/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="GitHub"
            >
              <FaGithub className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-white/70" />
            </a>
            <a
              href="https://huggingface.co/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="Hugging Face"
            >
              <SiHuggingface className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-[#FFD21E]" />
            </a>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center"
              aria-label="RSS Feed"
            >
              <FaRss className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/40 transition-colors group-hover:text-orange-500" />
            </a>
          </div>
        </div>

        {/* Bottom section - copyright and status */}
        <div className="flex flex-row items-center justify-between gap-2 border-t border-white/5 pt-1.5 sm:pt-2 text-[10px] sm:text-xs text-white/40">
          <p className="whitespace-nowrap">© 2026 Tiles Privacy</p>
          <a
            href="https://status.tiles.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/60 whitespace-nowrap"
          >
            Status
          </a>
        </div>
      </div>
    </footer>
  )
}
