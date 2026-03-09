"use client"

import { useState, useEffect } from "react"
import { SiteFooter } from "@/components/site-footer"
import { useTheme } from "next-themes"
import { FaBook, FaDiscord } from "react-icons/fa6"
import { triggerHaptic } from "@/lib/haptics"

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
  const [download, setDownload] = useState<DownloadMetadata>({
    version: "latest",
    downloadUrl: "",
    binarySizeLabel: "",
    sha256: "Unavailable",
    fileName: "tiles.pkg",
  })
  const [hasAutoStarted, setHasAutoStarted] = useState(false)
  const [copiedVerifyCommand, setCopiedVerifyCommand] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadDownloadMetadata() {
      try {
        const res = await fetch("/api/download-metadata")
        if (!res.ok) {
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
        // Keep fallback metadata if request fails.
      }
    }

    void loadDownloadMetadata()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!download.downloadUrl || hasAutoStarted) {
      return
    }

    setHasAutoStarted(true)
    window.location.assign(download.downloadUrl)
  }, [download.downloadUrl, hasAutoStarted])

  const isDark = mounted && resolvedTheme === "dark"

  // Theme-aware colors - matching book dark theme (#121212 bg, #E6E6E6 text)
  const bgColor = "bg-background"
  const textColor = "text-foreground"
  const textColorMuted = isDark ? "text-[#B3B3B3]" : "text-black/70"
  const textColorSubtle = isDark ? "text-[#8A8A8A]" : "text-black/50"
  const textColorLink = isDark
    ? "text-[#8A8A8A] hover:text-[#E6E6E6]"
    : "text-black/60 hover:text-black"
  const bodyTextClass = `text-sm sm:text-base leading-7 ${textColorMuted}`
  const codeBg = isDark ? "bg-[#1a1a1a]" : "bg-black/[0.04]"
  const codeText = isDark ? "text-[#E6E6E6]" : "text-black/80"
  const copyButtonBg = isDark ? "bg-[#1a1a1a] hover:bg-[#252525]" : "bg-[#f5f5f5] hover:bg-[#e5e5e5]"
  const copyIconColor = isDark ? "text-[#8A8A8A] hover:text-[#E6E6E6]" : "text-black/50 hover:text-black/80"
  const verifyCommand = `echo "${download.sha256} *${download.fileName}" | shasum -a 256 --check`
  const verifyOutput = `${download.fileName}: OK`

  const handleCopyVerifyCommand = async () => {
    await navigator.clipboard.writeText(verifyCommand)
    triggerHaptic()
    setCopiedVerifyCommand(true)
    setTimeout(() => setCopiedVerifyCommand(false), 2000)
  }
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
                Thank you for downloading Tiles Alpha {download.version}
              </h1>
            </div>

            {/* Install Section */}
            <div className="space-y-9">
              <p className={bodyTextClass}>
                Your download should start automatically. If it doesn&apos;t,{" "}
                <a
                  href={download.downloadUrl || "#"}
                  onClick={(event) => {
                    if (!download.downloadUrl) {
                      event.preventDefault()
                      return
                    }
                    triggerHaptic()
                  }}
                  className={`${textColorLink} underline underline-offset-2 transition-colors`}
                >
                  download now.
                </a>
              </p>

              <div className="space-y-4">
                <p className={bodyTextClass}>
                  Run this command in your terminal in the directory the package was downloaded to verify the SHA256
                  checksum:
                </p>
                <div className={`flex items-start rounded-xl ${codeBg} max-w-full overflow-hidden`}>
                  <div className="flex-1 min-w-0 overflow-x-auto px-4 py-2.5">
                    <code className={`font-mono text-sm whitespace-nowrap ${codeText}`}>{verifyCommand}</code>
                  </div>
                  <button
                    onClick={handleCopyVerifyCommand}
                    className={`flex-shrink-0 flex items-center justify-center ${copyButtonBg} rounded-r-xl transition-colors px-3 py-2.5`}
                    aria-label="Copy to clipboard"
                    title={copiedVerifyCommand ? "Copied!" : "Copy to clipboard"}
                  >
                    {copiedVerifyCommand ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4 text-green-600"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={`h-4 w-4 ${copyIconColor} transition-colors`}
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className={bodyTextClass}>You should get the following output:</p>
                <div className={`w-full overflow-x-auto rounded-md px-4 py-3 ${codeBg}`}>
                  <code className={`font-mono text-sm whitespace-nowrap ${codeText}`}>{verifyOutput}</code>
                </div>
              </div>

              {/* Manual and Community CTAs */}
              <div className="grid grid-cols-1 gap-10 pt-2 sm:pt-4">
                {/* Manual */}
                <div className="flex flex-col gap-4">
                  <div className={`flex h-6 w-6 items-center justify-start shrink-0 ${textColorSubtle}`}>
                    <FaBook className="h-5 w-5" />
                  </div>
                  <h2 className={`font-sans text-base font-medium tracking-tight ${textColor}`}>Manual</h2>
                  <p className={bodyTextClass}>
                    Need usage instructions? Check out the{" "}
                    <a
                      href="https://tiles.run/book/manual"
                      className={`${textColorLink} underline underline-offset-2 transition-colors`}
                    >
                      Manual
                    </a>{" "}
                    in the book for step by step guidance.
                  </p>
                </div>

                {/* Join Discord */}
                <div className="flex flex-col gap-4">
                  <div className={`flex h-6 w-6 items-center justify-start shrink-0 ${textColorSubtle}`}>
                    <FaDiscord className="h-5 w-5" />
                  </div>
                  <h2 className={`font-sans text-base font-medium tracking-tight ${textColor}`}>Join Discord</h2>
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
      </main>

      <SiteFooter />
    </div>
  )
}
