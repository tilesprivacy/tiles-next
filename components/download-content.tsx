"use client"

import { useState, useEffect } from "react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useTheme } from 'next-themes'

export function DownloadContent() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Theme-aware colors
  const bgColor = 'bg-background'
  const textColor = 'text-foreground'
  const textColorMuted = isDark ? 'text-white/70' : 'text-black/70'
  const textColorSubtle = isDark ? 'text-white/50' : 'text-black/50'
  const textColorLink = isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'
  const codeBg = isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
  const codeText = isDark ? 'text-white/80' : 'text-black/80'
  const copyButtonBg = isDark ? 'bg-[#1a1a1a] hover:bg-[#252525]' : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
  const copyIconColor = isDark ? 'text-white/50 hover:text-white/80' : 'text-black/50 hover:text-black/80'

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
      <SiteHeader themeAware />

      {/* Main Content - Split Screen */}
      <main className="flex flex-1 flex-col lg:flex-row min-h-0">
        {/* Left Side - Installation Instructions */}
        <div className="flex w-full lg:w-full flex-col items-center justify-start pt-36 pb-28 lg:justify-center lg:py-32 px-6 lg:px-12">
          <div className="flex w-full max-w-md flex-col gap-14 text-left lg:max-w-xl lg:gap-20">
            {/* Title */}
            <div className="space-y-4 pt-10 pb-8 lg:pt-0 lg:pb-0">
              <h1 className={`font-sans text-3xl font-bold leading-tight tracking-tight ${textColor} sm:text-4xl lg:text-5xl`}>
                You're about to
                <br />
                get Tiles for Mac
              </h1>
            </div>

            {/* Install Section */}
            <div className="space-y-6 lg:space-y-8">
              <p className={`text-sm ${textColorMuted} sm:text-base lg:text-lg`}>Install and run:</p>

              {/* Code Blocks */}
              <div className="flex flex-col items-start gap-4 lg:gap-5">
                <CodeBlock code="curl -fsSL https://tiles.run/install.sh | sh" />
                <CodeBlock code="tiles run" />
              </div>

              {/* Footer Links */}
              <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${textColorLink} pt-4 lg:pt-6 lg:gap-3 lg:text-sm`}>
                <a
                  href="https://tiles.run/install.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors"
                >
                  View script source
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-2.5 w-2.5"
                  >
                    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <span>•</span>
                <a
                  href="https://github.com/tilesprivacy/tiles/blob/main/HACKING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors"
                >
                  Manual install instructions
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-2.5 w-2.5"
                  >
                    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className={`pt-10 text-[11px] ${textColorSubtle} lg:pt-16 lg:text-sm`}>
                We also offer an Insiders build for early adopters. It includes the latest code changes and experimental features, such as offline memory models, and may occasionally be unstable. The Insiders build installs alongside the regular build, allowing you to use either independently.
              </div>
            </div>
          </div>
        </div>

      </main>

      <SiteFooter />
    </div>
  )
}
