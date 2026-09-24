"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, Download } from "lucide-react"
import { FaApple, FaLinux } from "react-icons/fa6"
import {
  CanaryDownloadAction,
  CanaryReleaseContent,
  useCanaryRelease,
} from "@/components/canary-release-content"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { SiteFooter } from "@/components/site-footer"
import type { CanaryReleaseData } from "@/lib/canary-release"
import { LINUX_CANARY_INSTALL_COMMAND, LINUX_INSTALL_COMMAND, OFFLINE_INSTALLER } from "@/lib/download-page-data"
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
  initialCanaryRelease,
}: {
  initialDownload?: DownloadMetadata
  initialLatestReleaseVersion?: string | null
  initialCanaryRelease: CanaryReleaseData | null
  sponsorsGoal?: SponsorsGoalData
}) {
  const [copied, setCopied] = useState<string | null>(null)
  const canaryRelease = useCanaryRelease(initialCanaryRelease)
  const copyLinuxCommand = (command: string) => {
    // navigator.clipboard is missing or rejects in some browsers/webviews;
    // fall back to a hidden textarea so the copy still lands.
    const copyWithTextArea = () => {
      const textArea = document.createElement("textarea")
      textArea.value = command
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
      void navigator.clipboard.writeText(command).catch(copyWithTextArea)
    }

    setCopied(command)
    window.setTimeout(() => setCopied(null), 1400)
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
            <p>Apple Silicon · macOS 14+ · 16 GB unified memory recommended</p>
            {/*
              One stanza per installer: the action (with its Recommended tag),
              then a one-line caption underneath naming the route and its size.
              The longer offline explanation lives in the detail paragraph
              below the actions, scoped by the same flag as the offline action.
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
                    className={`group minimal-primary-button minimal-download-action ${themeAwareHeaderPrimaryCtaClasses} ${downloadButtonMotionClasses}`}
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
              <CanaryDownloadAction release={canaryRelease} />
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
            <button className="minimal-command" type="button" onClick={() => copyLinuxCommand(LINUX_INSTALL_COMMAND)}>
              <code>{LINUX_INSTALL_COMMAND}</code>
              {copied === LINUX_INSTALL_COMMAND ? <Check aria-label="Copied" /> : <Copy aria-label="Copy command" />}
            </button>
            <p className="minimal-note">Paste this command in your terminal.</p>
            <p className="minimal-note">
              Canary, for early testers: the latest build of the canary branch, which can be unstable.
              The chat opens in your browser at <code>http://127.0.0.1:1729</code>.
            </p>
            <button className="minimal-command" type="button" onClick={() => copyLinuxCommand(LINUX_CANARY_INSTALL_COMMAND)}>
              <code>{LINUX_CANARY_INSTALL_COMMAND}</code>
              {copied === LINUX_CANARY_INSTALL_COMMAND ? <Check aria-label="Copied" /> : <Copy aria-label="Copy command" />}
            </button>
            <p className="minimal-note">The offline installer for Linux is a work in progress.</p>
          </section>

          <p className="minimal-legal">
            By downloading and using Tiles, you agree to the <Link href="/terms">terms</Link> and <Link href="/privacy">privacy statement</Link>.
          </p>

          <section className="minimal-download-platform" aria-labelledby="changelog-heading">
            <h2 id="changelog-heading">Release changelogs</h2>
            <div className="minimal-download-changelogs">
              <div className="minimal-download-changelog" aria-labelledby="latest-release-heading">
                <h3 id="latest-release-heading">Latest release</h3>
                <p>
                  {LATEST_RELEASE_TITLE} · Version {latestReleaseVersion}
                  <br />
                  Released <time dateTime={LATEST_RELEASE_DATE_ISO}>{LATEST_RELEASE_DATE_LABEL}</time>
                </p>
                <div className="minimal-download-release-notes">
                  {LATEST_RELEASE_SECTIONS.map((section) => (
                    <div key={section.title}>
                      <h4>{section.title}</h4>
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
              </div>
              <CanaryReleaseContent release={canaryRelease} />
            </div>
          </section>
        </article>
      </main>
      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
