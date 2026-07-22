"use client"

import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { LINUX_INSTALL_COMMAND } from "@/lib/download-page-data"
import type { SponsorsGoalData } from "@/lib/sponsors-goal"

interface DownloadMetadata {
  version: string
  downloadUrl: string
  binarySizeLabel: string
  sha256: string
  fileName: string
}

export function DownloadContent({
  initialDownload,
}: {
  initialDownload?: DownloadMetadata
  initialLatestReleaseVersion?: string | null
  sponsorsGoal?: SponsorsGoalData
}) {
  const [copied, setCopied] = useState(false)

  const copyLinuxCommand = async () => {
    await navigator.clipboard.writeText(LINUX_INSTALL_COMMAND)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <main className="minimal-inner-page minimal-download-page">
      <MinimalTopbar />
      <article className="minimal-inner-content">
        <header className="minimal-page-intro">
          <h1>Download Tiles</h1>
          <p>Public alpha for macOS and Linux.</p>
        </header>

        <section className="minimal-download-platform" aria-labelledby="macos-heading">
          <h2 id="macos-heading">macOS</h2>
          <p>Apple Silicon (M1+) · macOS 14+ · 16 GB unified memory recommended</p>
          {initialDownload?.downloadUrl ? (
            <a className="minimal-primary-button" href={initialDownload.downloadUrl}>Download for Mac</a>
          ) : (
            <span className="minimal-disabled-button">Download unavailable</span>
          )}
        </section>

        <section className="minimal-download-platform" aria-labelledby="linux-heading">
          <h2 id="linux-heading">Linux</h2>
          <p>NVIDIA GPU · CUDA 12.8+ · 16 GB VRAM recommended</p>
          <button className="minimal-command" type="button" onClick={copyLinuxCommand}>
            <code>{LINUX_INSTALL_COMMAND}</code>
            {copied ? <Check aria-label="Copied" /> : <Copy aria-label="Copy command" />}
          </button>
          <p className="minimal-note">Paste this command in your terminal.</p>
        </section>

        <p className="minimal-legal">By downloading and using Tiles, you agree to the <Link href="/terms">terms</Link> and <Link href="/privacy">privacy statement</Link>.</p>
      </article>
    </main>
  )
}
