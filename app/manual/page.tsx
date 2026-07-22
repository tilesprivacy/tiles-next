import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import ManualContent from "@/content/manual.mdx"

export const metadata: Metadata = {
  title: "User Manual | Tiles",
  description: "Install, configure, and use Tiles.",
}

export default function ManualPage() {
  return (
    <main className="minimal-manual-page">
      <header>
        <Link href="/" className="minimal-manual-brand" aria-label="Tiles home">
          <Image src="/lighticon.png" alt="" width={38} height={38} priority />
          <span>Tiles</span>
        </Link>
        <Link href="/">Back to product</Link>
      </header>
      <article className="minimal-manual-prose">
        <ManualContent />
      </article>
      <footer>
        <Link href="/">Tiles</Link>
        <span>Copyright © 2026 Tiles Privacy</span>
      </footer>
    </main>
  )
}
