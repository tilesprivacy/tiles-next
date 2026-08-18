import { DownloadTilesCta } from "@/components/download-tiles-cta"
import { DownloadPlatformSubtext } from "@/components/download-platform-subtext"

export function MinimalDownload({
  platformSize = "hero",
}: {
  platformSize?: "hero" | "footer"
}) {
  return (
    <div className="minimal-download-cta">
      <DownloadTilesCta size={platformSize} label="Download for free" />
      <div className="minimal-download-details flex flex-col items-center gap-2.5">
        <DownloadPlatformSubtext size={platformSize} />
      </div>
    </div>
  )
}
