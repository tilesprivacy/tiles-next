"use client"

import { useState, useEffect } from "react"
import { SiteFooter } from "@/components/site-footer"
import { useTheme } from 'next-themes'
import { FaBook, FaDiscord } from "react-icons/fa6"

export function DownloadContent() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Theme-aware colors - matching book dark theme (#121212 bg, #E6E6E6 text)
  const bgColor = 'bg-background'
  const textColor = 'text-foreground'
  const textColorMuted = isDark ? 'text-[#B3B3B3]' : 'text-black/70'
  const textColorSubtle = isDark ? 'text-[#8A8A8A]' : 'text-black/50'
  const textColorLink = isDark ? 'text-[#8A8A8A] hover:text-[#E6E6E6]' : 'text-black/60 hover:text-black'
  const codeBg = isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
  const codeText = isDark ? 'text-[#E6E6E6]' : 'text-black/80'
  const copyButtonBg = isDark ? 'bg-[#1a1a1a] hover:bg-[#252525]' : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
  const copyIconColor = isDark ? 'text-[#8A8A8A] hover:text-[#E6E6E6]' : 'text-black/50 hover:text-black/80'

  const CodeBlock = ({ code, compact = false }: { code: string; compact?: boolean }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className={`inline-flex items-center rounded-xl ${codeBg} max-w-full ${compact ? "" : ""}`}>
        <div className={`overflow-x-auto ${compact ? "px-4 py-2.5" : "px-4 py-3 lg:px-5 lg:py-3.5"}`}>
          <code className={`font-mono ${codeText} whitespace-nowrap ${compact ? "text-sm" : "text-sm lg:text-base"}`}>
            {code}
          </code>
        </div>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 flex items-center justify-center ${copyButtonBg} rounded-r-xl transition-colors ${compact ? "px-3 py-2.5" : "px-3 py-3 lg:px-4 lg:py-3.5"}`}
          aria-label="Copy to clipboard"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-green-600 lg:h-[18px] lg:w-[18px]"
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
              className={`h-4 w-4 ${copyIconColor} transition-colors lg:h-[18px] lg:w-[18px]`}
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className={`relative flex min-h-[100dvh] flex-col ${bgColor}`}>
      {/* Main Content - Split Screen */}
      <main className="flex flex-1 flex-col lg:flex-row min-h-0">
        {/* Left Side - Installation Instructions */}
        <div className="flex w-full lg:w-full flex-col items-center justify-start pt-36 pb-28 lg:justify-center lg:py-32 px-6 lg:px-12">
          <div className="flex w-full max-w-md flex-col gap-14 text-left lg:max-w-xl lg:gap-20">
            {/* Title */}
            <div className="space-y-4 pb-8 lg:pt-8 lg:pb-0">
              <h1 className={`font-sans text-3xl font-bold leading-tight tracking-tight ${textColor} sm:text-4xl lg:text-5xl`}>
                You're about to
                <br />
                get Tiles for Mac
              </h1>
            </div>

            {/* Install Section */}
            <div className="space-y-6 lg:space-y-8">
              <p className={`text-sm ${textColorMuted} sm:text-base lg:text-lg`}>Paste this in terminal:</p>

              {/* Code Block */}
              <div className="flex flex-col items-start gap-4 lg:gap-5">
                <CodeBlock code="curl -fsSL https://tiles.run/install.sh | sh" />
              </div>

              {/* Alpha Badge and Requirements */}
              <p className={`text-xs leading-relaxed ${textColorMuted} max-w-[20rem]`}>
                <span className="block">
                  <span className="inline-flex shrink-0 align-middle rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#7c7ca8] border-[#7c7ca8]/60 bg-[#7c7ca8]/15 dark:text-[#a5a5c4] dark:border-[#a5a5c4]/50 dark:bg-[#a5a5c4]/20 mr-1.5">
                    Alpha
                  </span>
                  for macOS 14+ on Apple Silicon Macs (M1 or newer). Recommended: 16 GB unified memory or more.
                </span>
                <span className="block">
                  iOS, Android, Linux, and Windows support coming later.
                </span>
              </p>

              {/* Older Versions Note */}
              <p className={`text-xs ${textColorMuted} sm:text-sm lg:text-base`}>
                Want to check out older versions? You can find installation scripts for previous releases on the{" "}
                <a
                  href="/changelog"
                  className={`${textColorLink} underline underline-offset-2 transition-colors`}
                >
                  changelog page
                </a>
                .
              </p>
            </div>

            {/* Manual, Join Discord - same flow as install */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {/* Manual */}
              <div className="flex flex-col gap-4">
                <div className={`flex h-6 w-6 items-center justify-start shrink-0 ${textColorSubtle}`}>
                  <FaBook className="h-5 w-5" />
                </div>
                <h2 className={`font-sans text-base font-medium tracking-tight ${textColor}`}>
                  Manual
                </h2>
                <p className={`text-sm sm:text-base ${textColorMuted} leading-relaxed`}>
                  Need usage instructions? Check out the{" "}
                  <a
                    href="https://tiles.run/book/manual"
                    className={`${textColorLink} underline underline-offset-2 transition-colors`}
                  >
                    Manual
                  </a>
                  {" "}in the book for step by step guidance.
                </p>
              </div>

              {/* Join Discord */}
              <div className="flex flex-col gap-4">
                <div className={`flex h-6 w-6 items-center justify-start shrink-0 ${textColorSubtle}`}>
                  <FaDiscord className="h-5 w-5" />
                </div>
                <h2 className={`font-sans text-base font-medium tracking-tight ${textColor}`}>
                  Join Discord
                </h2>
                <p className={`text-sm sm:text-base ${textColorMuted} leading-relaxed`}>
                  Chat with the team and other users, get help, and share feedback.{" "}
                  <a
                    href="https://go.tiles.run/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${textColorLink} underline underline-offset-2 transition-colors`}
                  >
                    Join our Discord server
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      <SiteFooter />
    </div>
  )
}
