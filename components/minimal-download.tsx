import Link from "next/link"
import { Download } from "lucide-react"
import { DownloadPlatformSubtext } from "@/components/download-platform-subtext"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"

export function MinimalDownload({ platformSize = "hero" }: { platformSize?: "hero" | "footer" }) {
  return (
    <div className="minimal-download-cta">
      <Link className={`minimal-download-link ${themeAwareHeaderPrimaryCtaClasses}`} href="/download">
        <Download className="minimal-download-icon" aria-hidden />
        Download for free
      </Link>
      <DownloadPlatformSubtext size={platformSize} />
    </div>
  )
}
