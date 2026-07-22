import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { FaBluesky, FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6"
import { SiHuggingface } from "react-icons/si"
import { TangledIcon } from "@/components/tangled-icon"

export function MinimalFooter() {
  return (
    <footer className="minimal-footer">
      <Link href="/" className="minimal-footer-brand" aria-label="Tiles home">
        <Image src="/lighticon.png" alt="" width={32} height={32} />
        <span>Tiles</span>
      </Link>
      <p>Copyright © 2026 Tiles Privacy</p>
      <p>
        Embed Tiles into your product with <Link href="/book/tilekit">Tilekit</Link>.
      </p>
      <nav className="minimal-footer-links" aria-label="Footer links">
        <Link href="/sub-processors">Subprocessors</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/brand">Brand</Link>
        <a className="minimal-footer-status" href="https://status.tiles.run" target="_blank" rel="noopener noreferrer">
          Status
          <ArrowUpRight aria-hidden />
        </a>
      </nav>
      <nav className="minimal-footer-social" aria-label="Social links">
        <a href="https://x.com/tilesprivacy" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"><FaXTwitter aria-hidden /></a>
        <a href="https://bsky.app/profile/tiles.run" target="_blank" rel="noopener noreferrer" aria-label="Bluesky"><FaBluesky aria-hidden /></a>
        <a href="https://go.tiles.run/discord" target="_blank" rel="noopener noreferrer" aria-label="Discord"><FaDiscord aria-hidden /></a>
        <a href="https://github.com/tilesprivacy" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub aria-hidden /></a>
        <a href="https://tangled.org/tiles.run" target="_blank" rel="noopener noreferrer" aria-label="Tangled"><TangledIcon aria-hidden /></a>
        <a href="https://huggingface.co/tilesprivacy" target="_blank" rel="noopener noreferrer" aria-label="Hugging Face"><SiHuggingface aria-hidden /></a>
      </nav>
    </footer>
  )
}
