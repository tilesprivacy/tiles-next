"use client"

import { useState, useEffect } from "react"
import { SiteFooter } from "@/components/site-footer"
import { useTheme } from "next-themes"
import { FaBook, FaDiscord } from "react-icons/fa6"
import { triggerHaptic } from "@/lib/haptics"
import Link from "next/link"
import Image from "next/image"

interface DownloadMetadata {
  version: string
  downloadUrl: string
  binarySizeLabel: string
  sha256: string
  fileName: string
}

export function DownloadContent() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true)
  const [metadataLoadFailed, setMetadataLoadFailed] = useState(false)
  const [download, setDownload] = useState<DownloadMetadata>({
    version: "latest",
    downloadUrl: "",
    binarySizeLabel: "",
    sha256: "Unavailable",
    fileName: "tiles.pkg",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadDownloadMetadata() {
      setIsLoadingMetadata(true)
      setMetadataLoadFailed(false)
      try {
        const res = await fetch("/api/download-metadata")
        if (!res.ok) {
          if (isMounted) {
            setMetadataLoadFailed(true)
          }
          return
        }

        const data = (await res.json()) as DownloadMetadata
        if (!isMounted) {
          return
        }

        const fileNameFromUrl = data.downloadUrl
          ? (() => {
              try {
                return new URL(data.downloadUrl).pathname.split("/").pop() || "tiles.pkg"
              } catch {
                return data.downloadUrl.split("/").pop() || "tiles.pkg"
              }
            })()
          : "tiles.pkg"

        setDownload({
          version: data.version || "latest",
          downloadUrl: data.downloadUrl || "",
          binarySizeLabel: data.binarySizeLabel || "",
          sha256: data.sha256 || "Unavailable",
          fileName: data.fileName || fileNameFromUrl,
        })
      } catch {
        if (isMounted) {
          setMetadataLoadFailed(true)
        }
        // Keep fallback metadata if request fails.
      } finally {
        if (isMounted) {
          setIsLoadingMetadata(false)
        }
      }
    }

    void loadDownloadMetadata()

    return () => {
      isMounted = false
    }
  }, [])

  const isDark = mounted && resolvedTheme === "dark"

  // Theme-aware colors - matching book dark theme (#121212 bg, #E6E6E6 text)
  const bgColor = "bg-background"
  const textColor = "text-foreground"
  const textColorMuted = isDark ? "text-[#B3B3B3]" : "text-black/70"
  const textColorSubtle = isDark ? "text-[#8A8A8A]" : "text-black/50"
  const textColorLink = isDark
    ? "text-[#8A8A8A] hover:text-[#E6E6E6]"
    : "text-black/60 hover:text-black"
  const stepLabelClass = isDark ? "text-[#8A8A8A]" : "text-black/45"
  const bodyTextClass = `text-sm sm:text-base leading-7 ${textColorMuted}`
  const codeBg = isDark ? "bg-[#1a1a1a]" : "bg-black/[0.04]"
  const codeText = isDark ? "text-[#E6E6E6]" : "text-black/80"
  const hasDownloadUrl = Boolean(download.downloadUrl)
  const displayVersion = download.version && download.version !== "latest" ? `v${download.version}` : null
  const checksumFileUrl = download.fileName
    ? `https://download.tiles.run/checksums/${download.fileName}.sha256`
    : "https://download.tiles.run/checksums"
  const shortenedSha256 =
    download.sha256 !== "Unavailable"
      ? `${download.sha256.slice(0, 12)}...${download.sha256.slice(-12)}`
      : "Unavailable"
  const downloadButtonLabel = isLoadingMetadata
    ? "Loading installer..."
    : hasDownloadUrl
      ? "Download network installer"
      : "Download unavailable"
  return (
    <div className={`relative flex min-h-[100dvh] flex-col ${bgColor}`}>
      {/* Main Content - Split Screen */}
      <main className="flex flex-1 flex-col min-h-0">
        {/* Left Side - Installation Instructions */}
        <div className="flex w-full flex-col items-center justify-start px-6 pt-32 pb-24 lg:px-12 lg:pt-36 lg:pb-28">
          <div className="flex w-full max-w-xl flex-col gap-12 text-left lg:gap-14">
            {/* Title */}
            <div className="space-y-4">
              <h1
                className={`font-sans text-[1.75rem] font-semibold leading-tight tracking-tight ${textColor} sm:text-3xl lg:text-[2.2rem]`}
              >
                Download Tiles Alpha
              </h1>
              <p className={bodyTextClass}>
                Public Alpha for macOS 14+ on Apple Silicon Macs (M1 or newer). Recommended: 16 GB unified memory or
                more.
              </p>
              {displayVersion && <p className={`text-sm ${textColorSubtle}`}>Current build: {displayVersion}</p>}
              {metadataLoadFailed && (
                <p className={`text-sm ${textColorSubtle}`}>
                  Live download metadata is temporarily unavailable. The page is showing fallback details.
                </p>
              )}
            </div>

            {/* Install Section */}
            <div className="space-y-9">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className={`text-xs font-medium uppercase tracking-[0.14em] ${stepLabelClass}`}>Step 1</p>
                  <h2 className={`font-sans text-lg font-medium tracking-tight ${textColor}`}>Download your installer</h2>
                  <p className={bodyTextClass}>Choose the installer that best fits your setup.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="py-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${textColor}`}>Network installer</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                            isDark ? "text-[#8A8A8A] ring-1 ring-white/15" : "text-black/45 ring-1 ring-black/15"
                          }`}
                        >
                          Recommended
                        </span>
                      </div>
                      <p className={bodyTextClass}>
                        Small package that includes the required runtime. You will be prompted to download the model
                        during onboarding.
                      </p>
                      <p className={`text-sm ${textColorSubtle}`}>
                        Size: {download.binarySizeLabel || "Unavailable"} | SHA256:{" "}
                        {shortenedSha256 !== "Unavailable" ? (
                          <a
                            href={checksumFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${textColorLink} underline underline-offset-2 transition-colors`}
                          >
                            {shortenedSha256}
                          </a>
                        ) : (
                          shortenedSha256
                        )}
                      </p>
                    </div>
                    <div className="pt-4">
                      {hasDownloadUrl ? (
                        <a
                          href={download.downloadUrl}
                          onClick={() => {
                            triggerHaptic()
                          }}
                          download={download.fileName}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                        >
                          <Image
                            src="/apple-logo-white.svg"
                            alt="Apple"
                            width={16}
                            height={20}
                            className="h-3.5 w-auto dark:hidden"
                          />
                          <Image
                            src="/apple-logo.svg"
                            alt="Apple"
                            width={16}
                            height={20}
                            className="hidden h-3.5 w-auto dark:block"
                          />
                          {downloadButtonLabel}
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-black/10 px-5 text-sm font-medium text-black/40 dark:bg-white/10 dark:text-white/40"
                          aria-disabled="true"
                        >
                          <Image
                            src="/apple-logo.svg"
                            alt="Apple"
                            width={16}
                            height={20}
                            className="h-3.5 w-auto opacity-50 dark:hidden"
                          />
                          <Image
                            src="/apple-logo-white.svg"
                            alt="Apple"
                            width={16}
                            height={20}
                            className="hidden h-3.5 w-auto opacity-50 dark:block"
                          />
                          {downloadButtonLabel}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${textColor}`}>Offline installer</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                            isDark ? "text-[#8A8A8A] ring-1 ring-white/15" : "text-black/45 ring-1 ring-black/15"
                          }`}
                        >
                          Coming soon
                        </span>
                      </div>
                      <p className={bodyTextClass}>
                        Includes the default{" "}
                        <span className={`rounded px-1.5 py-0.5 font-mono text-sm ${codeBg} ${codeText}`}>gpt-oss-20b</span>{" "}
                        model bundled for fully offline setup with no additional downloads.
                      </p>
                      <p className={`text-sm ${textColorSubtle}`}>Size: ~5GB | SHA256: Coming soon</p>
                    </div>
                    <div className="pt-4">
                      <button
                        type="button"
                        disabled
                        className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white opacity-40 dark:bg-white dark:text-black"
                        aria-disabled="true"
                      >
                        <Image
                          src="/apple-logo-white.svg"
                          alt="Apple"
                          width={16}
                          height={20}
                          className="h-3.5 w-auto dark:hidden"
                        />
                        <Image
                          src="/apple-logo.svg"
                          alt="Apple"
                          width={16}
                          height={20}
                          className="hidden h-3.5 w-auto dark:block"
                        />
                        Download offline installer
                      </button>
                    </div>
                  </div>
                </div>
                <p className={bodyTextClass}>
                  Installation options for earlier releases of Tiles are available on the{" "}
                  <Link href="/changelog" className={`${textColorLink} underline underline-offset-2 transition-colors`}>
                    Changelog page
                  </Link>
                  .
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-2 border-t border-black/10 pt-6 dark:border-white/10">
                  <p className={`text-xs font-medium uppercase tracking-[0.14em] ${stepLabelClass}`}>Step 2</p>
                  <h2 className={`font-sans text-lg font-medium tracking-tight ${textColor}`}>Go through the installer setup</h2>
                  <p className={bodyTextClass}>
                    Open the downloaded installer and complete the install wizard. The installer adds the{" "}
                    <code className={`rounded px-1.5 py-0.5 ${codeBg} ${codeText}`}>tiles</code> command to your system.
                  </p>
                </div>
                <div className="space-y-2 border-t border-black/10 pt-6 dark:border-white/10">
                  <p className={`text-xs font-medium uppercase tracking-[0.14em] ${stepLabelClass}`}>Step 3</p>
                  <h2 className={`font-sans text-lg font-medium tracking-tight ${textColor}`}>Run tiles command</h2>
                  <p className={bodyTextClass}>
                    Open Terminal and run <code className={`rounded px-1.5 py-0.5 ${codeBg} ${codeText}`}>tiles</code>.
                    Then complete CLI onboarding to set up your account. If you chose the network installer, select the
                    model you want to download.
                  </p>
                </div>
              </div>

              {/* Manual and Community CTAs */}
              <div className="space-y-5 border-t border-black/10 pt-8 dark:border-white/10">
                <h2 className={`font-sans text-2xl font-medium tracking-tight sm:text-3xl ${textColor}`}>Resources</h2>
                <div className="grid grid-cols-1 gap-10">
                  {/* Manual */}
                  <div className="flex flex-col gap-4">
                    <div className={`flex h-6 w-6 items-center justify-start shrink-0 ${textColorSubtle}`}>
                      <FaBook className="h-5 w-5" />
                    </div>
                    <h3 className={`font-sans text-lg font-medium tracking-tight ${textColor}`}>Manual</h3>
                    <p className={bodyTextClass}>
                      Need usage instructions? Check out the{" "}
                      <a
                        href="https://tiles.run/book/manual"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${textColorLink} underline underline-offset-2 transition-colors`}
                      >
                        Manual
                      </a>{" "}
                      in the book for step-by-step guidance.
                    </p>
                  </div>

                  {/* Join Discord */}
                  <div className="flex flex-col gap-4">
                    <div className={`flex h-6 w-6 items-center justify-start shrink-0 ${textColorSubtle}`}>
                      <FaDiscord className="h-5 w-5" />
                    </div>
                    <h3 className={`font-sans text-lg font-medium tracking-tight ${textColor}`}>Join Discord</h3>
                    <p className={bodyTextClass}>
                      Chat with the team and other users, get help, and share feedback. Join us in the #tiles channel
                      hosted by the{" "}
                      <a
                        href="https://go.tiles.run/discord"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${textColorLink} underline underline-offset-2 transition-colors`}
                      >
                        User &amp; Agents community
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
