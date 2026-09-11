"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Download } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { CanaryReleaseData } from "@/lib/canary-release"
import {
  CANARY_FALLBACK_DOWNLOAD,
  CANARY_RELEASE_DESCRIPTION,
  CANARY_RELEASE_URL,
} from "@/lib/download-page-data"

export function CanaryReleaseContent({ initialRelease }: { initialRelease: CanaryReleaseData | null }) {
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

  // The pinned installer link keeps a direct Canary download on the page
  // whenever the GitHub release data is unavailable.
  const assets: Array<{ name: string; browser_download_url: string; size?: number }> =
    release?.assets?.length ? release.assets : [CANARY_FALLBACK_DOWNLOAD]
  const notes = (release?.body || "")
    .replace(/\r\n/g, "\n")
    .replace(/^Tiles canary\s*\n/i, "")
    .replace(/^(New|Added|Changed|Fixed|Build)\s*$/gm, "### $1")

  return (
    <section className="minimal-download-platform" aria-labelledby="canary-heading">
      <h2 id="canary-heading">Canary release</h2>
      <p>{CANARY_RELEASE_DESCRIPTION}</p>
      {release?.updated_at && (
        <p>
          Pre-release · Updated{" "}
          <time dateTime={release.updated_at}>
            {new Date(release.updated_at).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
            })}
          </time>
        </p>
      )}
      <ul className="mt-6 grid list-none gap-4 p-0" aria-label="Canary downloads">
        {assets.map((asset) => (
          <li key={asset.name} className="min-w-0">
            <a
              href={asset.browser_download_url}
              className="inline-flex max-w-full items-start gap-2 underline underline-offset-4"
            >
              <Download size={16} className="mt-1 shrink-0" aria-hidden />
              <span className="min-w-0 break-all">{asset.name}</span>
            </a>
            {typeof asset.size === "number" && (
              <span className="mt-1 block pl-6 text-xs text-muted-foreground">
                {asset.size < 1024
                  ? `${asset.size} bytes`
                  : asset.size < 1024 * 1024
                  ? `${Math.round(asset.size / 1024)} KB`
                  : `${(asset.size / (1024 * 1024)).toFixed(1)} MB`}
              </span>
            )}
          </li>
        ))}
      </ul>
      {notes && (
        <div className="minimal-download-release-notes minimal-download-release-notes--markdown">
          <div>
            <ReactMarkdown>{notes}</ReactMarkdown>
          </div>
        </div>
      )}
      <p className="minimal-note">
        <a href={CANARY_RELEASE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
          {release ? "View Canary on GitHub" : "Downloads and release notes on GitHub"}
          <ArrowUpRight size={16} aria-hidden />
        </a>
      </p>
    </section>
  )
}
