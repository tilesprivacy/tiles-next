"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { FaApple, FaLinux } from "react-icons/fa6"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { LINUX_INSTALL_COMMAND, OFFLINE_INSTALLER } from "@/lib/download-page-data"
import { themeAwareHeaderPrimaryCtaClasses } from "@/lib/header-primary-cta-classes"
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
    <div className="minimal-product-page">
      <MinimalTopbar />
      <main className="minimal-inner-page minimal-download-page">
        <article className="minimal-inner-content">
          <header className="minimal-page-intro">
            <h1>Download Tiles</h1>
            <p>Public alpha for macOS and Linux.</p>
          </header>

          <section className="minimal-download-platform" aria-labelledby="macos-heading">
            <h2 id="macos-heading">
              <FaApple className="minimal-download-platform-icon" aria-hidden />
              macOS
            </h2>
            <p>Apple Silicon (M1+) · macOS 14+ · 16 GB unified memory recommended</p>
            <div className="minimal-download-actions">
              {initialDownload?.downloadUrl ? (
                <a className={`minimal-primary-button ${themeAwareHeaderPrimaryCtaClasses}`} href={initialDownload.downloadUrl}>
                  Download network installer
                </a>
              ) : (
                <span className="minimal-disabled-button">Network installer unavailable</span>
              )}
              <a className={`minimal-secondary-button ${themeAwareHeaderPrimaryCtaClasses}`} href={OFFLINE_INSTALLER.downloadUrl}>
                Download offline installer
              </a>
            </div>
            <p className="minimal-download-detail">
              Offline installer bundles the default model{" "}
              <span className="minimal-model-label">
                <Image src="/openai-logo.svg" alt="OpenAI" width={15} height={15} />
                <span>gpt-oss-20b</span>
              </span>
              .
            </p>
          </section>

          <section className="minimal-download-platform" aria-labelledby="linux-heading">
            <h2 id="linux-heading">
              <FaLinux className="minimal-download-platform-icon" aria-hidden />
              Linux
            </h2>
            <p>NVIDIA GPU · CUDA 12.8+ · 16 GB VRAM recommended</p>
            <button className="minimal-command" type="button" onClick={copyLinuxCommand}>
              <code>{LINUX_INSTALL_COMMAND}</code>
              {copied ? <Check aria-label="Copied" /> : <Copy aria-label="Copy command" />}
            </button>
            <p className="minimal-note">Paste this command in your terminal.</p>
          </section>

          <p className="minimal-legal">
            By downloading and using Tiles, you agree to the <Link href="/terms">terms</Link> and <Link href="/privacy">privacy statement</Link>.
          </p>
        </article>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
