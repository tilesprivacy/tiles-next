import { DownloadTilesCta } from "@/components/download-tiles-cta"
import { DownloadPlatformSubtext } from "@/components/download-platform-subtext"

export function MinimalDownload({ platformSize = "hero" }: { platformSize?: "hero" | "footer" }) {
  return (
    <div className="minimal-download-cta">
      <DownloadTilesCta size={platformSize} label="Download for free" />
      <DownloadPlatformSubtext size={platformSize} />
    </div>
  )
}
