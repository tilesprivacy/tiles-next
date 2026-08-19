import Link from "next/link"
import { DownloadTilesCta } from "@/components/download-tiles-cta"
import { DownloadPlatformSubtext } from "@/components/download-platform-subtext"
import {
  DOWNLOAD_PRICING_LINK_LABEL,
  DOWNLOAD_PRICING_NOTE_LABEL,
} from "@/lib/product-description"

const pricingNoteClasses: Record<"hero" | "footer", string> = {
  hero: "text-[0.79rem] sm:text-[0.83rem]",
  footer: "text-[0.74rem] sm:text-[0.79rem]",
}

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
        <p
          className={`font-medium leading-none text-black/48 dark:text-[#9A9A9A] ${pricingNoteClasses[platformSize]}`}
        >
          {DOWNLOAD_PRICING_NOTE_LABEL}{" "}
          <Link
            href="/pricing"
            className="underline underline-offset-2 hover:text-black/70 dark:hover:text-white/80"
          >
            {DOWNLOAD_PRICING_LINK_LABEL}
          </Link>
        </p>
      </div>
    </div>
  )
}
