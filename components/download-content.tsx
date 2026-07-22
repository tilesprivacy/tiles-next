"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { MinimalTopbar } from "@/components/minimal-topbar"
import {
  LINUX_INSTALL_COMMAND,
  LINUX_INSTALL_SCRIPT_URL,
  LINUX_INSTALL_VERSION,
  LINUX_MODEL_NAME,
  LINUX_MODEL_URL,
  OFFLINE_INSTALLER,
  OFFLINE_MODEL_NAME,
  OFFLINE_MODEL_URL,
} from "@/lib/download-page-data"
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
  initialLatestReleaseVersion,
}: {
  initialDownload?: DownloadMetadata
  initialLatestReleaseVersion?: string | null
  sponsorsGoal?: SponsorsGoalData
}) {
  const [copied, setCopied] = useState(false)
  const network = initialDownload
  const currentVersion = initialLatestReleaseVersion || network?.version
  const shortHash = (hash?: string) => hash && hash !== "Unavailable" ? `${hash.slice(0, 12)}…${hash.slice(-12)}` : "Unavailable"

  const copyLinuxCommand = async () => {
    await navigator.clipboard.writeText(LINUX_INSTALL_COMMAND)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <main className="minimal-inner-page">
      <MinimalTopbar />
      <article className="minimal-inner-content">
        <header className="minimal-page-intro">
          <p className="minimal-eyebrow">Public alpha {currentVersion ? `· v${currentVersion}` : ""}</p>
          <h1>Download Tiles</h1>
          <p>Available for macOS and Linux. We recommend 16 GB of unified memory or VRAM.</p>
        </header>

        <section className="minimal-section" aria-labelledby="macos-heading">
          <div className="minimal-section-heading">
            <h2 id="macos-heading">macOS</h2>
            <p>Apple Silicon (M1+) · macOS 14+</p>
          </div>
          <p>
            Uses <a href={OFFLINE_MODEL_URL}><Image src="/openai-logo.svg" alt="" width={14} height={14} /> {OFFLINE_MODEL_NAME}</a> as the default model.
          </p>

          <div className="minimal-option">
            <h3>Network installer</h3>
            <p>Small package with the required runtime. Tiles prompts you to download the default model during onboarding.</p>
            <p className="minimal-meta">Release: v{network?.version || "latest"} · Size: {network?.binarySizeLabel || "Unavailable"} · SHA256: {shortHash(network?.sha256)}</p>
            {network?.downloadUrl ? <a className="minimal-primary-button" href={network.downloadUrl}>Download free for Mac</a> : <span className="minimal-disabled-button">Download unavailable</span>}
          </div>

          <div className="minimal-option">
            <h3>Offline installer</h3>
            <p>Full installer with the default model bundled for air-gapped use.</p>
            <p className="minimal-meta">Size: {OFFLINE_INSTALLER.binarySizeLabel} · SHA256: {shortHash(OFFLINE_INSTALLER.sha256)}</p>
            <a className="minimal-secondary-button" href={OFFLINE_INSTALLER.downloadUrl}>Download offline installer</a>
          </div>
          <p className="minimal-note">Offline builds are not published for every release. Check the version before downloading.</p>
        </section>

        <section className="minimal-section" aria-labelledby="linux-heading">
          <div className="minimal-section-heading">
            <h2 id="linux-heading">Linux</h2>
            <p>NVIDIA · CUDA 12.8+</p>
          </div>
          <p>
            Uses <a href={LINUX_MODEL_URL}><Image src="/openai-logo.svg" alt="" width={14} height={14} /> {LINUX_MODEL_NAME}</a> as the default model.
          </p>
          <div className="minimal-option">
            <h3>Network installer</h3>
            <p>Requires an NVIDIA GPU with supported CUDA compute capability. The default model is selected during onboarding.</p>
            <p className="minimal-meta">Release: v{LINUX_INSTALL_VERSION}</p>
            <button className="minimal-command" type="button" onClick={copyLinuxCommand}>
              <code>{LINUX_INSTALL_COMMAND}</code>
              {copied ? <Check aria-label="Copied" /> : <Copy aria-label="Copy command" />}
            </button>
            <p className="minimal-note">Paste this in Terminal. <a href={LINUX_INSTALL_SCRIPT_URL}>View script source</a>.</p>
          </div>
        </section>

        <section className="minimal-section minimal-resources" aria-labelledby="resources-heading">
          <h2 id="resources-heading">Resources</h2>
          <div>
            <Link href="/manual"><strong>User Manual</strong><span>Install, configure, and use Tiles.</span></Link>
            <a href="https://go.tiles.run/discord"><strong>Join Discord</strong><span>Get help and meet the community.</span></a>
            <Link href="/releases"><strong>Releases</strong><span>Read what changed in each build.</span></Link>
          </div>
        </section>

        <p className="minimal-legal">By downloading and using Tiles, you agree to the <Link href="/terms">terms</Link> and <Link href="/privacy">privacy statement</Link>.</p>
      </article>
    </main>
  )
}
