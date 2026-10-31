"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import type { CanaryReleaseData } from "@/lib/canary-release"
import { CANARY_FALLBACK_DOWNLOAD } from "@/lib/download-page-data"
import {
  downloadButtonIconMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"

export function useCanaryRelease(initialRelease: CanaryReleaseData | null) {
  const [release, setRelease] = useState(initialRelease)

  useEffect(() => {
    let activeRequest: AbortController | null = null

    const refresh = async () => {
      if (document.visibilityState !== "visible" || activeRequest) return
      const controller = new AbortController()
      activeRequest = controller
      try {
        const response = await fetch("/api/canary-release", { signal: controller.signal })
        if (!response.ok) return
        const latest: CanaryReleaseData = await response.json()
        if (!controller.signal.aborted && Array.isArray(latest.assets)) setRelease(latest)
      } catch {
        // Preserve the last release while offline or GitHub is unavailable.
      } finally {
        if (activeRequest === controller) activeRequest = null
      }
    }

    void refresh()
    const interval = window.setInterval(refresh, 5 * 60 * 1000)
    window.addEventListener("focus", refresh)
    window.addEventListener("online", refresh)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener("focus", refresh)
      window.removeEventListener("online", refresh)
      document.removeEventListener("visibilitychange", refresh)
      activeRequest?.abort()
    }
  }, [])

  return release
}

type CanaryAsset = {
  name: string
  browser_download_url: string
  size?: number
}

function getCanaryAssets(release: CanaryReleaseData | null): CanaryAsset[] {
  return release?.assets?.length ? release.assets : [CANARY_FALLBACK_DOWNLOAD]
}

export function CanaryDownloadAction({ release }: { release: CanaryReleaseData | null }) {
  const assets = getCanaryAssets(release)

  return (
    <>
      {assets.map((asset) => (
        <div key={asset.name} className="minimal-download-option">
          <a
            href={asset.browser_download_url}
            className={`group minimal-primary-button minimal-download-action ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
          >
            <span>Download canary installer</span>
            <Download
              className={`download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`}
              aria-hidden
            />
          </a>
          <span className="minimal-download-size">
            {typeof asset.size === "number"
              ? `${
                  asset.size < 1024
                    ? `${asset.size} bytes`
                    : asset.size < 1024 * 1024
                      ? `${Math.round(asset.size / 1024)} KB`
                      : `${(asset.size / (1024 * 1024)).toFixed(1)} MB`
                } · `
              : null}
            For early testers
          </span>
        </div>
      ))}
    </>
  )
}
