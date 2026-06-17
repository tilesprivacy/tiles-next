"use client"

import { type FormEvent, useState, useEffect } from "react"
import { SiteFooter } from "@/components/site-footer"
import { useTheme } from "next-themes"
import { FaApple, FaBook, FaClockRotateLeft, FaDiscord, FaLinux } from "react-icons/fa6"
import { Check, Copy } from "lucide-react"
import { triggerHaptic } from "@/lib/haptics"
import {
  downloadButtonIconMotionClasses,
  downloadButtonLabelMotionClasses,
  downloadButtonMotionClasses,
  themeAwareHeaderPrimaryCtaClasses,
} from "@/lib/header-primary-cta-classes"
import { marketingPageTitleClass } from "@/lib/marketing-page-title-classes"
import Link from "next/link"
import Image from "next/image"
import { OFFLINE_INSTALLER, LINUX_INSTALL_COMMAND, LINUX_INSTALL_SCRIPT_URL, LINUX_INSTALL_VERSION, LINUX_MODEL_NAME, LINUX_MODEL_URL, OFFLINE_MODEL_NAME, OFFLINE_MODEL_URL } from "@/lib/download-page-data"
import { DOWNLOAD_PLATFORM_LINUX_LABEL, DOWNLOAD_PLATFORM_MACOS_LABEL } from "@/lib/product-description"

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

const DEFAULT_DOWNLOAD_METADATA: DownloadMetadata = {
  version: "latest",
  downloadUrl: "",
  binarySizeLabel: "",
  sha256: "Unavailable",
  fileName: "tiles.pkg",
}

/** Matches site header Download CTA (same `Button` palette, flat surface like the nav pill) */
const primaryDownloadButtonClass = `group inline-flex h-10 w-fit items-center justify-center gap-2 rounded-sm px-5 text-sm font-medium ${downloadButtonMotionClasses} ${themeAwareHeaderPrimaryCtaClasses}`

const downloadButtonAppleIconClass =
  `origin-right h-3.5 w-auto ${downloadButtonIconMotionClasses}`

const downloadButtonLabelClass = `origin-left ${downloadButtonLabelMotionClasses}`

export function DownloadContent({ initialDownload }: DownloadContentProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileClient, setIsMobileClient] = useState(false)
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(!Boolean(initialDownload?.downloadUrl))
  const [metadataLoadFailed, setMetadataLoadFailed] = useState(false)
  const [download, setDownload] = useState<DownloadMetadata>(initialDownload ?? DEFAULT_DOWNLOAD_METADATA)
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [emailMessage, setEmailMessage] = useState("")
  const [copiedLinuxCommand, setCopiedLinuxCommand] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userAgent = window.navigator.userAgent
    const matchesMobileUa =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
    const isSmallViewport = window.matchMedia("(max-width: 1024px)").matches
    setIsMobileClient(matchesMobileUa || (isCoarsePointer && isSmallViewport))
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

  const bgColor = "bg-background"
  const textColor = "text-foreground"
  const textColorMuted = isDark ? "text-secondary-foreground" : "text-muted-foreground"
  const textColorSubtle = "text-muted-foreground"
  const textColorLink =
    "text-foreground underline decoration-foreground/35 underline-offset-2 transition-colors hover:decoration-foreground"
  const bodyTextClass = `text-sm sm:text-base leading-7 ${textColorMuted}`
  const codeSurfaceClass = isDark
    ? "border border-border bg-secondary text-foreground"
    : "border border-border bg-card text-card-foreground"
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
  const offlineShortenedSha256 = `${OFFLINE_INSTALLER.sha256.slice(0, 12)}...${OFFLINE_INSTALLER.sha256.slice(-12)}`
  const offlineChecksumFileUrl = `https://download.tiles.run/checksums/${OFFLINE_INSTALLER.fileName}.sha256`
  const installerOptionTitleClass = `font-sans text-base font-medium tracking-tight ${textColor}`
  const platformSectionTitleClass = `font-sans text-xl font-medium tracking-tight sm:text-2xl ${textColor}`
  const downloadButtonLabel = isLoadingMetadata
    ? "Loading installer..."
    : hasDownloadUrl
      ? "Download network installer"
      : "Download unavailable"

  async function onSendDownloadLinkEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    triggerHaptic()

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

      if (!response.ok) {
        throw new Error(data.error || "Unable to send the download link.")
      }

      setEmailStatus("success")
      setEmailMessage("Sent. Check your inbox on desktop.")
    } catch (error) {
      setEmailStatus("error")
      setEmailMessage(error instanceof Error ? error.message : "Unable to send the download link.")
    }
  }

  function onEmailChange(value: string) {
    setEmail(value)
    if (emailStatus !== "idle") {
      setEmailStatus("idle")
      setEmailMessage("")
    }
  }

  function onCopyLinuxInstallCommand() {
    if (typeof window === "undefined") {
      return
    }

    const copyToClipboard = (text: string) => {
      triggerHaptic()
      setCopiedLinuxCommand(true)
      window.setTimeout(() => setCopiedLinuxCommand(false), 1400)
    }

    if (navigator?.clipboard?.writeText) {
      void navigator.clipboard.writeText(LINUX_INSTALL_COMMAND).then(copyToClipboard)
      return
    }

    const textArea = document.createElement("textarea")
    textArea.value = LINUX_INSTALL_COMMAND
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
    copyToClipboard(LINUX_INSTALL_COMMAND)
  }

  return (
    <div className={`relative flex min-h-[100dvh] flex-col ${bgColor}`}>
      {/* Main Content - Split Screen */}
      <main className="flex flex-1 flex-col min-h-0">
        {/* Left Side - Installation Instructions */}
        <div className="flex w-full flex-col items-center justify-start px-6 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] pb-24 lg:px-12 lg:pt-[calc(9.5rem+env(safe-area-inset-top,0px))] lg:pb-28">
          <div className="flex w-full max-w-xl flex-col gap-12 text-left lg:gap-14">
            {/* Title */}
            <div className="space-y-4">
              <h1 className={`${marketingPageTitleClass} ${textColor}`}>
                Download Tiles Alpha
              </h1>
              <p className={bodyTextClass}>
                Public alpha for macOS and Linux. Choose your platform below.
              </p>
              {displayVersion && <p className={`text-sm ${textColorSubtle}`}>Current build: {displayVersion}</p>}
              {metadataLoadFailed && (
                <p className={`text-sm ${textColorSubtle}`}>
                  Live download metadata is temporarily unavailable. The page is showing fallback details.
                </p>
              )}
            </div>

            <div className="space-y-10 lg:space-y-12">
              <section aria-labelledby="download-macos-heading" className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <FaApple className={`h-5 w-5 shrink-0 ${textColorSubtle}`} aria-hidden />
                    <h2 id="download-macos-heading" className={platformSectionTitleClass}>
                      macOS
                    </h2>
                  </div>
                  <p className={bodyTextClass}>{DOWNLOAD_PLATFORM_MACOS_LABEL}.</p>
                </div>

                <p className={bodyTextClass}>
                  Uses{" "}
                  <a
                    href={OFFLINE_MODEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 underline-offset-2 transition-opacity hover:opacity-80 ${codeSurfaceClass}`}
                  >
                    <Image src="/openai-logo.svg" alt="OpenAI logo" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono text-sm">{OFFLINE_MODEL_NAME}</span>
                  </a>{" "}
                  as the default model.
                </p>

                <div className="space-y-8">
                  <article className="space-y-3">
                    <h3 className={installerOptionTitleClass}>Network installer</h3>
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
                    <div className="pt-1">
                      {hasDownloadUrl ? (
                        <a
                          href={download.downloadUrl}
                          onClick={() => {
                            triggerHaptic()
                          }}
                          download={download.fileName}
                          data-skip-mobile-download-prompt="true"
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
                          className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-sm border border-border bg-muted px-5 text-sm font-medium text-muted-foreground"
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
                  </article>

                  <article className="space-y-3 border-t border-border pt-8">
                    <h3 className={installerOptionTitleClass}>Offline installer</h3>
                    <p className={bodyTextClass}>
                      Full installer with the default model bundled for air-gapped use.
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
                    <div className="pt-1">
                      <a
                        href={OFFLINE_INSTALLER.downloadUrl}
                        onClick={() => {
                          triggerHaptic()
                        }}
                        download={OFFLINE_INSTALLER.fileName}
                        data-skip-mobile-download-prompt="true"
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
                  </article>
                </div>

                <p className={`text-xs leading-relaxed ${textColorSubtle}`}>
                  Offline installer builds aren&apos;t published for every release. Check the release version above to
                  confirm which build each installer includes.
                </p>

                {isMobileClient ? (
                  <div className="border-t border-border pt-6">
                    <div className="space-y-2">
                      <p className={`font-medium ${textColor}`}>Send installer links to email</p>
                      <p className={bodyTextClass}>On mobile right now? Send download links to your inbox and continue on desktop.</p>
                    </div>
                    <form onSubmit={onSendDownloadLinkEmail} className="mt-3 flex flex-col gap-2">
                      <label htmlFor="mobile-download-email-inline" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="mobile-download-email-inline"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(event) => onEmailChange(event.target.value)}
                        disabled={emailStatus === "loading" || emailStatus === "success"}
                        className="h-10 min-w-0 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground selection:bg-blue-500 selection:text-white focus:border-foreground/25 focus:ring-2 focus:ring-foreground/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={emailStatus === "loading" || emailStatus === "success"}
                        className="h-10 w-full rounded-sm bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white dark:text-black dark:hover:bg-[#F2F2F2] dark:focus-visible:ring-white/30"
                      >
                        {emailStatus === "loading"
                          ? "Sending..."
                          : emailStatus === "success"
                            ? "Link sent"
                            : "Send link"}
                      </button>
                      {emailMessage ? (
                        <p
                          role="status"
                          aria-live="polite"
                          className={`text-xs leading-relaxed ${
                            emailStatus === "error" ? "text-red-600 dark:text-red-300" : "text-muted-foreground"
                          }`}
                        >
                          {emailMessage}
                        </p>
                      ) : null}
                    </form>
                  </div>
                ) : null}
              </section>

              <section aria-labelledby="download-linux-heading" className="space-y-6 border-t border-border pt-10 lg:pt-12">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <FaLinux className={`h-5 w-5 shrink-0 ${textColorSubtle}`} aria-hidden />
                    <h2 id="download-linux-heading" className={platformSectionTitleClass}>
                      Linux
                    </h2>
                  </div>
                  <p className={bodyTextClass}>{DOWNLOAD_PLATFORM_LINUX_LABEL}.</p>
                </div>

                <p className={bodyTextClass}>
                  Uses{" "}
                  <a
                    href={LINUX_MODEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 underline-offset-2 transition-opacity hover:opacity-80 ${codeSurfaceClass}`}
                  >
                    <Image src="/openai-logo.svg" alt="OpenAI logo" width={14} height={14} className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono text-sm">{LINUX_MODEL_NAME}</span>
                  </a>{" "}
                  as the default model.
                </p>

                <article className="space-y-3">
                  <h3 className={installerOptionTitleClass}>Network installer</h3>
                  <p className={bodyTextClass}>
                    About 1 GB download with CUDA bundled. The script also downloads the default model. Requires NVIDIA compute capability 5.0+ and driver 531+ (570+ for CC 5.0 through 6.2). Check your{" "}
                    <a
                      href="https://developer.nvidia.com/cuda-gpus"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${textColorLink} underline underline-offset-2 transition-colors`}
                    >
                      compute compatibility
                    </a>{" "}
                    to see if your card is supported.
                  </p>
                  <p className={`text-sm ${textColorSubtle}`}>Release: v{LINUX_INSTALL_VERSION}</p>
                  <div className="pt-0.5">
                    <div
                      className={`relative overflow-hidden rounded-lg border sm:flex sm:items-stretch ${
                        isDark ? "border-white/8 bg-white/[0.04]" : "border-black/6 bg-black/[0.02]"
                      }`}
                    >
                      <code className="block overflow-x-auto whitespace-nowrap px-4 py-3 pr-12 font-mono text-[0.82rem] text-foreground [-webkit-overflow-scrolling:touch] sm:min-w-0 sm:flex-1 sm:px-4 sm:py-3.5 sm:pr-4 sm:text-sm">
                        {LINUX_INSTALL_COMMAND}
                      </code>
                      <button
                        type="button"
                        onClick={onCopyLinuxInstallCommand}
                        aria-label={copiedLinuxCommand ? "Install command copied" : "Copy Linux install command"}
                        className={`absolute inset-y-0 right-0 z-10 flex items-center px-3.5 text-muted-foreground transition-colors hover:text-foreground ${
                          isDark ? "bg-[#191919]/92" : "bg-white/92"
                        } sm:static sm:z-auto sm:shrink-0 sm:border-l sm:border-black/6 dark:sm:border-white/8 sm:bg-transparent sm:px-4`}
                      >
                        {copiedLinuxCommand ? (
                          <Check className="h-4 w-4" aria-hidden />
                        ) : (
                          <Copy className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    </div>
                    <div className={`mt-1.5 text-[0.72rem] ${textColorSubtle}`}>
                      <a
                        href={LINUX_INSTALL_SCRIPT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-3 transition-colors hover:text-foreground"
                      >
                        View script source
                      </a>
                    </div>
                  </div>
                </article>
              </section>

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

              {/* Manual and Community CTAs */}
              <div className="border-t border-border pt-10">
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
                      <Link href="/releases#releases" className={`${textColorLink} underline underline-offset-2 transition-colors`}>
                        releases page
                      </Link>{" "}
                      to download previous versions.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
      </main>

      <SiteFooter showDownloadCta={false} />
    </div>
  )
}
