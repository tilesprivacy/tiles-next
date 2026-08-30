"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, Download } from "lucide-react"
import { FaApple, FaLinux } from "react-icons/fa6"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { SiteFooter } from "@/components/site-footer"
import { LINUX_INSTALL_COMMAND, OFFLINE_INSTALLER } from "@/lib/download-page-data"
import {
  LATEST_RELEASE_DATE_ISO,
  LATEST_RELEASE_DATE_LABEL,
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
  initialLatestReleaseVersion,
}: {
  initialDownload?: DownloadMetadata
  initialLatestReleaseVersion?: string | null
  sponsorsGoal?: SponsorsGoalData
}) {
  const [copied, setCopied] = useState(false)
  const copyLinuxCommand = () => {
    // navigator.clipboard is missing or rejects in some browsers/webviews;
    // fall back to a hidden textarea so the copy still lands.
    const copyWithTextArea = () => {
      const textArea = document.createElement("textarea")
      textArea.value = LINUX_INSTALL_COMMAND
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    if (!navigator.clipboard?.writeText) {
      copyWithTextArea()
    } else {
      void navigator.clipboard.writeText(LINUX_INSTALL_COMMAND).catch(copyWithTextArea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  const latestReleaseVersion =
    initialLatestReleaseVersion?.replace(/^v/i, "") || LATEST_RELEASE_VERSION
  const networkInstallerReleaseLabel =
    initialDownload?.version === LATEST_RELEASE_VERSION
      ? LATEST_RELEASE_TITLE
      : initialDownload?.version
        ? `Version ${initialDownload.version}`
        : null

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
            {/*
              One stanza per installer: the action (with its Recommended tag),
              then a one-line caption underneath naming the route and its size.
              The longer offline explanation lives in the detail paragraph
              below the pair, scoped by the same flag as the offline action.
            */}
            <div className="minimal-download-actions">
              <div className="minimal-download-option">
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
                {initialDownload?.downloadUrl ? (
                  <span className="minimal-download-size">
                    {[
                      initialDownload.binarySizeLabel,
                      networkInstallerReleaseLabel,
                      "Recommended for most users",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                ) : null}
              </div>
              {SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE ? (
                <div className="minimal-download-option">
                  <a
                    className={`group minimal-secondary-button minimal-download-action minimal-download-action--secondary ${downloadButtonMotionClasses}`}
                    href={OFFLINE_INSTALLER.downloadUrl}
                  >
                    <span>Download offline installer</span>
                    <Download
                      className={`download-cta-icon minimal-download-action-icon ${downloadButtonIconMotionClasses}`}
                      aria-hidden
                    />
                  </a>
                  <span className="minimal-download-size">
                    {OFFLINE_INSTALLER.binarySizeLabel} · {OFFLINE_INSTALLER.releaseTitle} · For air-gapped systems
                  </span>
                </div>
              ) : null}
            </div>
            {SHOW_OFFLINE_INSTALLER_ON_DOWNLOAD_PAGE ? (
              <p className="minimal-download-detail">
                The offline installer is ideal for computers that cannot connect
                to the internet or operate in air-gapped environments. It is
                also useful for installing Tiles across a large number of
                computers at once. It includes the default{" "}
                <span className="minimal-model-label">
                  <img
                    src="https://ai.google.dev/gemma/images/gemma_sq.png"
                    alt="Gemma logo"
                    width={15}
                    height={15}
                    loading="lazy"
                  />
                  <a
                    href="https://huggingface.co/unsloth/gemma-4-12b-it-GGUF"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gemma-4-12b-it-GGUF
                  </a>
                </span>{" "}
                model for fully offline use.
                {initialDownload?.version &&
                initialDownload.version !== OFFLINE_INSTALLER.version ? (
                  <>
                    {" "}
                    Offline installer builds aren&apos;t published for every
                    release, whereas network installers always fetch the latest
                    version available.
                  </>
                ) : null}
              </p>
            ) : null}
          </section>

          <section className="minimal-download-platform" aria-labelledby="linux-heading">
            <h2 id="linux-heading">
              <FaLinux className="minimal-download-platform-icon" aria-hidden />
              Linux
            </h2>
            <p>16 GB VRAM recommended</p>
            <button className="minimal-command" type="button" onClick={copyLinuxCommand}>
              <code>{LINUX_INSTALL_COMMAND}</code>
              {copied ? <Check aria-label="Copied" /> : <Copy aria-label="Copy command" />}
            </button>
            <p className="minimal-note">Paste this command in your terminal.</p>
          </section>

          <p className="minimal-legal">
            By downloading and using Tiles, you agree to the <Link href="/terms">terms</Link> and <Link href="/privacy">privacy statement</Link>.
          </p>

          <section className="minimal-download-platform" aria-labelledby="latest-release-heading">
            <h2 id="latest-release-heading">Latest release</h2>
            <p>
              {LATEST_RELEASE_TITLE} · Version {latestReleaseVersion}
              <br />
              Released <time dateTime={LATEST_RELEASE_DATE_ISO}>{LATEST_RELEASE_DATE_LABEL}</time>
            </p>
            <div className="minimal-download-release-notes">
              {LATEST_RELEASE_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3>{section.title}</h3>
                  <ul>
                    {section.changes.map((change) => (
                      <li key={change.text}>{change.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="minimal-note">
              <Link href={`/releases#${latestReleaseVersion}`}>View full release details</Link>.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
