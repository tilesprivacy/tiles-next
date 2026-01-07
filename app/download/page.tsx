"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SiteFooter } from "@/components/site-footer"

const CodeBlock = ({ code, compact = false }: { code: string; compact?: boolean }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`inline-flex items-center rounded-xl bg-[#f5f5f5] max-w-full ${compact ? "" : ""}`}>
      <div className={`overflow-x-auto ${compact ? "px-4 py-2.5" : "px-4 py-3 lg:px-5 lg:py-3.5"}`}>
        <code className={`font-mono text-black/80 whitespace-nowrap ${compact ? "text-sm" : "text-sm lg:text-base"}`}>
          {code}
        </code>
      </div>
      <button
        onClick={handleCopy}
        className={`flex-shrink-0 flex items-center justify-center bg-[#f5f5f5] rounded-r-xl hover:bg-[#e5e5e5] transition-colors ${compact ? "px-3 py-2.5" : "px-3 py-3 lg:px-4 lg:py-3.5"}`}
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
            className="h-4 w-4 text-black/50 hover:text-black/80 transition-colors lg:h-[18px] lg:w-[18px]"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default function DownloadPage() {
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-white via-white/95 to-transparent px-4 pb-3 pt-4 lg:fixed lg:px-6 lg:pb-4 lg:pt-6">
        <div className="flex items-center gap-2 text-base font-medium text-black lg:text-lg">
          <Link href="/" className="transition-colors hover:text-black/70">
            <Image src="/lighticon.png" alt="Tiles" width={32} height={32} className="h-7 w-7 lg:h-8 lg:w-8" />
          </Link>
          <span className="text-black/30">/</span>
          <Link href="/download" className="font-bold transition-colors hover:text-black/70">
            Download
          </Link>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap lg:gap-3">
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <Link href="/download" className="group flex items-center gap-1.5 lg:gap-2">
              <Image
                src="/apple-logo-white.svg"
                alt="Apple"
                width={16}
                height={20}
                className="h-3.5 w-auto transition-transform duration-300 group-hover:scale-110 lg:h-4"
              />
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Download</span>
            </Link>
          </Button>
          <Button
            asChild
            className="h-8 rounded-full bg-black px-3 text-xs font-medium text-white hover:bg-black/90 lg:h-10 lg:px-4 lg:text-sm"
          >
            <a
              href="https://github.com/sponsors/tilesprivacy"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 lg:gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 fill-white transition-all duration-300 group-hover:scale-110 group-hover:fill-white/70 group-active:scale-110 lg:h-4 lg:w-4"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              <span className="transition-all duration-300 group-hover:scale-105 group-active:scale-105">Sponsor</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 pt-[15dvh] pb-20 lg:pt-[20dvh] lg:px-12 lg:pb-4">
        <div className="flex w-full max-w-md flex-col gap-4 text-left lg:max-w-2xl lg:gap-6">
          {/* Title */}
          <div className="space-y-1 lg:space-y-2 mb-8 lg:mb-12">
            <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight text-black sm:text-4xl lg:text-6xl">
              You're about to
              <br />
              get Tiles for Mac
            </h1>
          </div>

          {/* Install Section */}
          <div className="space-y-2 lg:space-y-3">
            <p className="text-sm text-black/70 sm:text-base lg:text-xl">Install and run:</p>

            {/* Code Blocks */}
            <div className="flex flex-col items-start gap-2 lg:gap-3 w-full lg:w-auto">
              <CodeBlock code="curl -fsSL https://tiles.run/install.sh | sh" />
              <CodeBlock code="tiles run" />
            </div>

            {/* Footer Links */}
            <div className="flex items-center gap-2 text-xs text-black/60 pt-2 lg:gap-3 lg:text-sm">
              <a
                href="https://tiles.run/install.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-black"
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
                className="inline-flex items-center gap-1 transition-colors hover:text-black"
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

            <div className="pt-4 text-xs text-black/50 lg:text-sm">
              A portable installer is under development for air-gapped deployments, prepackaged with offline memory models.{" "}
              <a
                href="https://github.com/tilesprivacy/tiles/issues/24"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-black/60 transition-colors hover:text-black"
              >
                Track the issue here
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
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
