import Image from "next/image"
import Link from "next/link"

export function MinimalTopbar() {
  return (
    <header className="minimal-topbar">
      <Link href="/" className="minimal-topbar-brand" aria-label="Tiles home">
        <Image src="/lighticon.png" alt="" width={36} height={36} priority />
        <span>Tiles</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/manual">Manual</Link>
        <Link href="/sponsor" className="minimal-topbar-sponsor">Sponsor</Link>
      </nav>
    </header>
  )
}
