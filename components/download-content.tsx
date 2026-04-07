"use client"

import { useState, useEffect } from "react"
import { SiteFooter } from "@/components/site-footer"
import { useTheme } from "next-themes"
import { FaBook, FaClockRotateLeft, FaDiscord } from "react-icons/fa6"
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

interface DownloadContentProps {
  initialDownload?: DownloadMetadata
}

function extractVersionFromFileName(fileName: string | undefined): string | null {
  if (!fileName) {
    return null
  }

  const match = fileName.match(/tiles-(\d+\.\d+\.\d+)(?:[.-]|$)/i)
  return match?.[1] ?? null
}

const OFFLINE_INSTALLER = {
  downloadUrl: "https://download.tiles.run/tiles-0.4.7-full-signed.pkg",
  fileName: "tiles-0.4.7-full-signed.pkg",
  binarySizeLabel: "10.31 GB",
  sha256: "e2fa2d5339d356c023fb1c13fba8a6cf099fedad07f684b7b090d59292c91032",
} as const

const DEFAULT_DOWNLOAD_METADATA: DownloadMetadata = {
  version: "latest",
  downloadUrl: "",
  binarySizeLabel: "",
  sha256: "Unavailable",
  fileName: "tiles.pkg",
}

/** Matches homepage primary download CTA (home-content) */
const primaryDownloadButtonClass =
  "group inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white shadow-sm ring-1 ring-black/5 transition-all duration-300 will-change-transform hover:scale-[1.02] hover:bg-black/90 active:scale-[0.98] dark:bg-white dark:text-black dark:ring-white/10 dark:hover:bg-white/90"

const downloadButtonAppleIconClass =
  "origin-right h-3.5 w-auto transition-transform duration-300 will-change-transform backface-hidden group-hover:scale-110"

const downloadButtonLabelClass =
  "origin-left transition-all duration-300 will-change-transform backface-hidden group-hover:scale-105"

export function DownloadContent({ initialDownload }: DownloadContentProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(!Boolean(initialDownload?.downloadUrl))
  const [metadataLoadFailed, setMetadataLoadFailed] = useState(false)
  const [download, setDownload] = useState<DownloadMetadata>(initialDownload ?? DEFAULT_DOWNLOAD_METADATA)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let isMounted = true
    const shouldShowLoadingState = !Boolean(initialDownload?.downloadUrl)

    async function loadDownloadMetadata() {
      if (!navigator.onLine) {
        if (isMounted) {
          setMetadataLoadFailed(true)
          if (shouldShowLoadingState) {
            setIsLoadingMetadata(false)
          }
        }
        return
      }

      if (shouldShowLoadingState) {
        setIsLoadingMetadata(true)
      }
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
        if (isMounted && shouldShowLoadingState) {
          setIsLoadingMetadata(false)
        }
      }
    }

    if (shouldShowLoadingState) {
      void loadDownloadMetadata()
    }

    window.addEventListener("online", loadDownloadMetadata)

    return () => {
      isMounted = false
      window.removeEventListener("online", loadDownloadMetadata)
    }
  }, [initialDownload?.downloadUrl])

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
  const networkReleaseVersion = extractVersionFromFileName(download.fileName) ?? (download.version && download.version !== "latest" ? download.version : null)
  const offlineReleaseVersion = extractVersionFromFileName(OFFLINE_INSTALLER.fileName)
  const displayVersion = networkReleaseVersion ? `v${networkReleaseVersion}` : null
  const checksumFileUrl = download.fileName
    ? `https://download.tiles.run/checksums/${download.fileName}.sha256`
    : "https://download.tiles.run/checksums"
  const shortenedSha256 =
    download.sha256 !== "Unavailable"
      ? `${download.sha256.slice(0, 12)}...${download.sha256.slice(-12)}`
      : "Unavailable"
  const offlineShortenedSha256 =
    OFFLINE_INSTALLER.sha256 !== "Unavailable"
      ? `${OFFLINE_INSTALLER.sha256.slice(0, 12)}...${OFFLINE_INSTALLER.sha256.slice(-12)}`
      : "Unavailable"
  const offlineChecksumFileUrl = `https://download.tiles.run/checksums/${OFFLINE_INSTALLER.fileName}.sha256`
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
        <div className="flex w-full flex-col items-center justify-start px-6 pt-[calc(8rem+env(safe-area-inset-top,0px))] pb-24 lg:px-12 lg:pt-[calc(9rem+env(safe-area-inset-top,0px))] lg:pb-28">
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
                    </div>
                      <p className={bodyTextClass}>
                        Small package that includes the required runtime. You will be prompted to download the model
                        during onboarding.
                      </p>
                      <p className={`text-sm ${textColorSubtle}`}>
                        Release: {networkReleaseVersion ? `v${networkReleaseVersion}` : "Unavailable"}
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
                          className={primaryDownloadButtonClass}
                        >
                          <Image
                            src="/apple-logo-white.svg"
                            alt="Apple"
                            width={16}
                            height={20}
                            className={`${downloadButtonAppleIconClass} dark:hidden`}
                          />
                          <Image
                            src="/apple-logo.svg"
                            alt="Apple"
                            width={16}
                            height={20}
                            className={`hidden ${downloadButtonAppleIconClass} dark:block`}
                          />
                          <span className={downloadButtonLabelClass}>{downloadButtonLabel}</span>
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
                      </div>
                      <p className={bodyTextClass}>
                        Includes the default{" "}
                        <span className={`rounded px-1.5 py-0.5 font-mono text-sm ${codeBg} ${codeText}`}>
                          gpt-oss-20b-MXFP4-Q4
                        </span>{" "}
                        model bundled for fully offline setup with no additional downloads.
                      </p>
                      <p className={`text-sm ${textColorSubtle}`}>
                        Release: {offlineReleaseVersion ? `v${offlineReleaseVersion}` : "Unavailable"}
                      </p>
                      <p className={`text-sm ${textColorSubtle}`}>
                        Size: {OFFLINE_INSTALLER.binarySizeLabel} | SHA256:{" "}
                        {offlineShortenedSha256 !== "Unavailable" ? (
                          <a
                            href={offlineChecksumFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${textColorLink} underline underline-offset-2 transition-colors`}
                          >
                            {offlineShortenedSha256}
                          </a>
                        ) : (
                          offlineShortenedSha256
                        )}
                      </p>
                    </div>
                    <div className="pt-4">
                      <a
                        href={OFFLINE_INSTALLER.downloadUrl}
                        onClick={() => {
                          triggerHaptic()
                        }}
                        download={OFFLINE_INSTALLER.fileName}
                        className={primaryDownloadButtonClass}
                      >
                        <Image
                          src="/apple-logo-white.svg"
                          alt="Apple"
                          width={16}
                          height={20}
                          className={`${downloadButtonAppleIconClass} dark:hidden`}
                        />
                        <Image
                          src="/apple-logo.svg"
                          alt="Apple"
                          width={16}
                          height={20}
                          className={`hidden ${downloadButtonAppleIconClass} dark:block`}
                        />
                        <span className={downloadButtonLabelClass}>Download offline installer</span>
                      </a>
                    </div>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${textColorSubtle}`}>
                  Offline installer builds aren&apos;t published for every release. Check the release version above to
                  confirm which build each installer includes.
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  By downloading and using Tiles, you agree to the{" "}
                  <Link href="/terms" className="underline underline-offset-4">
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-4">
                    privacy statement
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
                    Open Terminal and run{" "}
                    <code className={`rounded px-1.5 py-0.5 ${codeBg} ${codeText}`}>tiles</code>. Then follow the CLI
                    onboarding to set up your account and start using the chat interface. If you installed the network
                    version, you will be prompted to choose and download a model.
                  </p>
                </div>
              </div>

              {/* Manual and Community CTAs */}
              <div className="border-t border-black/10 pt-10 dark:border-white/10">
                <h2 className={`mb-6 font-sans text-2xl font-medium tracking-tight sm:text-3xl ${textColor}`}>Resources</h2>
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

                  {/* Releases */}
                  <div className="flex flex-col gap-4">
                    <div className={`flex h-6 w-6 items-center justify-start shrink-0 ${textColorSubtle}`}>
                      <FaClockRotateLeft className="h-5 w-5" />
                    </div>
                    <h3 className={`font-sans text-lg font-medium tracking-tight ${textColor}`}>Releases</h3>
                    <p className={bodyTextClass}>
                      Need an older build? Browse the{" "}
                      <Link href="/changelog#releases" className={`${textColorLink} underline underline-offset-2 transition-colors`}>
                        changelog page
                      </Link>{" "}
                      to download previous versions.
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
