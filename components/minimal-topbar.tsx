import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

export function MinimalTopbar({ hideBrand = false }: { hideBrand?: boolean }) {
  return (
    <header className="minimal-topbar">
      {hideBrand ? <span aria-hidden /> : (
        <Link href="/" className="minimal-topbar-brand" aria-label="Tiles home">
          <Image src="/lighticon.png" alt="" width={36} height={36} priority />
          <span>Tiles</span>
        </Link>
      )}
      <nav aria-label="Primary navigation">
        <Link href="/manual">Manual</Link>
        <Link href="/sponsor" className="minimal-topbar-sponsor"><Heart aria-hidden />Sponsor</Link>
      </nav>
    </header>
  )
}
