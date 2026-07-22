import Image from "next/image"
import Link from "next/link"

export function AnnouncementBanner() {
  return (
    <aside className="site-announcement" aria-label="Announcement">
      <Link href="/blog/own-your-ai">
        <Image
          src="/localfirst-conf-mark.png"
          alt=""
          width={24}
          height={24}
          className="site-announcement-logo"
        />
        <span className="site-announcement-message">
          <span>Watch our talk at Local-First Conf 2026, Berlin</span>
          <span className="site-announcement-cta" aria-hidden>→</span>
        </span>
      </Link>
    </aside>
  )
}
