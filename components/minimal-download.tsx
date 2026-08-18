import { DownloadTilesCta } from "@/components/download-tiles-cta"
import { DownloadPlatformSubtext } from "@/components/download-platform-subtext"

function GemmaDefaultModelNote() {
  return (
    <p className="flex items-center justify-center gap-1.5 whitespace-nowrap text-sm text-black/55 dark:text-white/55">
      <span>Runs on</span>
      <img
        src="https://ai.google.dev/gemma/images/gemma_sq.png"
        alt=""
        width={18}
        height={18}
        className="drop-shadow-[0_0_5px_rgba(124,85,255,0.5)] dark:drop-shadow-[0_0_7px_rgba(166,137,255,0.75)]"
        aria-hidden
      />
      <span>Gemma 4 12B by default.</span>
    </p>
  )
}

export function MinimalDownload({
  platformSize = "hero",
  showGemmaNote = false,
}: {
  platformSize?: "hero" | "footer"
  showGemmaNote?: boolean
}) {
  return (
    <div className="minimal-download-cta">
      <DownloadTilesCta size={platformSize} label="Download for free" />
      <div className="flex flex-col items-center gap-1.5">
        <DownloadPlatformSubtext size={platformSize} />
        {showGemmaNote ? <GemmaDefaultModelNote /> : null}
      </div>
    </div>
  )
}
