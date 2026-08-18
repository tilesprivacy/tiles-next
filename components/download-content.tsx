"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, Download, Globe } from "lucide-react"
import { FaApple, FaChrome, FaFirefox, FaLinux, FaSafari } from "react-icons/fa6"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { SiteFooter } from "@/components/site-footer"
import { LINUX_INSTALL_COMMAND, OFFLINE_INSTALLER } from "@/lib/download-page-data"
import {
  LATEST_RELEASE_SECTIONS,
  LATEST_RELEASE_TITLE,
  LATEST_RELEASE_VERSION,
} from "@/lib/latest-release-copy"
import {
  downloadButtonIconMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"
import { SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE } from "@/lib/feature-flags"
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
                <a
                  className={`group minimal-primary-button minimal-download-action ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
                  href={initialDownload.downloadUrl}
                >
                  <span>Download network installer</span>
                  <Download
                    className={`download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`}
                    aria-hidden
                  />
                </a>
              ) : (
                <span className="minimal-disabled-button">Network installer unavailable</span>
              )}
              {SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE ? (
                <a
                  className={`group minimal-secondary-button minimal-download-action ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
                  href={OFFLINE_INSTALLER.downloadUrl}
                >
                  <span>Download offline installer</span>
                  <Download
                    className={`download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`}
                    aria-hidden
                  />
                </a>
              ) : null}
            </div>
            {SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE ? (
              <p className="minimal-download-detail">
                The offline installer includes the default{" "}
                <span className="minimal-model-label">
                  <img
                    src="https://ai.google.dev/gemma/images/gemma_sq.png"
                    alt="Gemma logo"
                    width={15}
                    height={15}
                  />
                  <a
                    href="https://huggingface.co/unsloth/gemma-4-12b-it-GGUF"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gemma-4-12b
                  </a>
                </span>{" "}
                model for air-gapped installation and use.
              </p>
            ) : null}
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

          <section className="minimal-download-platform" aria-labelledby="browser-heading">
            <h2 id="browser-heading">
              <span className="minimal-download-browser-logos" aria-hidden>
                <FaChrome className="minimal-download-platform-icon" />
                <FaFirefox className="minimal-download-platform-icon" />
                <FaSafari className="minimal-download-platform-icon" />
              </span>
              <span>Web Browser</span>
            </h2>
            <p>Coming soon on all modern browsers across platforms · Runs local models with remote inference.</p>
            <div
              className={`minimal-download-browser-badge minimal-download-browser-badge--coming-soon ${themeAwareHeaderPrimaryCtaClasses}`}
              role="status"
              aria-label="Web Browser coming soon"
            >
              <Globe className="minimal-download-browser-badge-globe" aria-hidden />
              <span className="minimal-download-browser-badge-copy">
                <span className="minimal-download-browser-badge-eyebrow">Use it on your</span>
                <span className="minimal-download-browser-badge-title">Web Browser</span>
              </span>
            </div>
          </section>

          <p className="minimal-legal">
            By downloading and using Tiles, you agree to the <Link href="/terms">terms</Link> and <Link href="/privacy">privacy statement</Link>.
          </p>

          <section className="minimal-download-platform" aria-labelledby="latest-release-heading">
            <h2
              id="latest-release-heading"
              className="!text-[1.0625rem] !font-semibold !leading-[1.35] !tracking-[-0.01em]"
            >
              Latest release · {LATEST_RELEASE_TITLE}
            </h2>
            <p className="minimal-note">
              Version {LATEST_RELEASE_VERSION} · Released{" "}
              <time dateTime="2026-08-18">Aug 18, 2026</time>
            </p>
            <div className="space-y-4">
              {LATEST_RELEASE_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-2 text-sm font-semibold">{section.title}</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-black/65 dark:text-white/65">
                    {section.changes.map((change) => (
                      <li key={change.text}>{change.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="minimal-note">
              <Link href={`/releases#${LATEST_RELEASE_VERSION}`}>View full release details</Link>.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
