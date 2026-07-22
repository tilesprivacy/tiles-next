import type { Metadata } from "next"
import Link from "next/link"
import ManualContent from "@/content/manual.mdx"
import { MinimalTopbar } from "@/components/minimal-topbar"

export const metadata: Metadata = {
  title: "User Manual | Tiles",
  description: "Install, configure, and use Tiles.",
}

export default function ManualPage() {
  return (
    <main className="minimal-manual-page">
      <MinimalTopbar />
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
