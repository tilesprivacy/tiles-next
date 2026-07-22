"use client"

import { type FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { FaApple, FaLinux } from "react-icons/fa6"
import { MinimalTopbar } from "@/components/minimal-topbar"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { LINUX_INSTALL_COMMAND, OFFLINE_INSTALLER } from "@/lib/download-page-data"
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
  const [isMobileClient, setIsMobileClient] = useState(false)
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [emailMessage, setEmailMessage] = useState("")

  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const matchesMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
    const isSmallViewport = window.matchMedia("(max-width: 1024px)").matches
    setIsMobileClient(matchesMobileUa || (isCoarsePointer && isSmallViewport))
  }, [])

  const sendDownloadLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setEmailStatus("error")
      setEmailMessage("Enter an email address.")
      return
    }

    setEmailStatus("loading")
    setEmailMessage("")
    try {
      const response = await fetch("/api/send-download-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to send the download link.")
      setEmailStatus("success")
      setEmailMessage("Sent. Check your inbox on desktop.")
    } catch (error) {
      setEmailStatus("error")
      setEmailMessage(error instanceof Error ? error.message : "Unable to send the download link.")
    }
  }

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

          {isMobileClient ? (
            <section className="minimal-download-email" aria-labelledby="download-email-heading">
              <h2 id="download-email-heading">Send installer links to email</h2>
              <p>On mobile right now? Send download links to your inbox and continue on desktop.</p>
              <form onSubmit={sendDownloadLink}>
                <label htmlFor="mobile-download-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="mobile-download-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (emailStatus !== "idle") {
                      setEmailStatus("idle")
                      setEmailMessage("")
                    }
                  }}
                  disabled={emailStatus === "loading" || emailStatus === "success"}
                />
                <button type="submit" className="minimal-primary-button" disabled={emailStatus === "loading" || emailStatus === "success"}>
                  {emailStatus === "loading" ? "Sending..." : emailStatus === "success" ? "Link sent" : "Send link"}
                </button>
                {emailMessage ? (
                  <p role="status" aria-live="polite" className={emailStatus === "error" ? "minimal-download-email-error" : "minimal-download-email-status"}>
                    {emailMessage}
                  </p>
                ) : null}
              </form>
            </section>
          ) : null}

          <section className="minimal-download-platform" aria-labelledby="macos-heading">
            <h2 id="macos-heading">
              <FaApple className="minimal-download-platform-icon" aria-hidden />
              macOS
            </h2>
            <p>Apple Silicon (M1+) · macOS 14+ · 16 GB unified memory recommended</p>
            <div className="minimal-download-actions">
              {initialDownload?.downloadUrl ? (
                <a className="minimal-primary-button" href={initialDownload.downloadUrl}>
                  Download network installer
                </a>
              ) : (
                <span className="minimal-disabled-button">Network installer unavailable</span>
              )}
              <a className="minimal-secondary-button" href={OFFLINE_INSTALLER.downloadUrl}>
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
