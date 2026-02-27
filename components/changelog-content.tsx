'use client'

import { SiteFooter } from "@/components/site-footer"
import type { Release } from "@/lib/releases"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ChangelogContentProps {
  releases: Release[]
  error: string | null
}

// SVG icon for external links
const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="h-2.5 w-2.5 inline-block ml-0.5 align-baseline"
    style={{ verticalAlign: 'baseline' }}
  >
    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Helper function to render text with inline code
const renderTextWithCode = (text: string, isDark: boolean) => {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1)
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 rounded text-sm font-mono ${
            isDark ? 'bg-[#1a1a1a] text-[#E6E6E6]' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {code}
        </code>
      )
    }
    return part
  })
}

const formatBinarySize = (sizeBytes: number) => {
  if (!Number.isFinite(sizeBytes) || sizeBytes < 0) {
    return "Unknown size"
  }

  const units = ["B", "KiB", "MiB", "GiB", "TiB"]
  let value = sizeBytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  const precision = unitIndex === 0 ? 0 : value >= 10 ? 1 : 2
  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

export function ChangelogContent({ releases, error }: ChangelogContentProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Theme-aware colors - matching book dark theme (#121212 bg, #E6E6E6 text)
  const bgColor = 'bg-background'
  const textColor = 'text-foreground'
  const textColorMuted = isDark ? 'text-[#B3B3B3]' : 'text-black/60'
  const textColorSubtle = isDark ? 'text-[#8A8A8A]' : 'text-gray-400'
  const textColorBody = isDark ? 'text-[#B3B3B3]' : 'text-gray-600'
  const textColorBodyLight = isDark ? 'text-[#8A8A8A]' : 'text-gray-500'
  const textColorHeading = isDark ? 'text-[#E6E6E6]' : 'text-gray-900'
  const linkColor = isDark ? 'text-[#B3B3B3] hover:text-[#E6E6E6]' : 'text-gray-700 hover:text-gray-900'
  const badgeBg = isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'
  const badgeText = isDark ? 'text-[#B3B3B3]' : 'text-gray-700'
  const badgeTextLight = isDark ? 'text-[#8A8A8A]' : 'text-gray-600'
  const timelineBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'
  const dotBg = isDark ? 'bg-[#E6E6E6]' : 'bg-black'
  const dotRing = isDark ? 'ring-[#121212]' : 'ring-white'
  const bulletBg = isDark ? 'bg-[#8A8A8A]' : 'bg-gray-400'
  const bulletBgLight = isDark ? 'bg-[#5a5a5a]' : 'bg-gray-300'
  const errorBg = isDark ? 'bg-red-900/30' : 'bg-red-50'
  const errorText = isDark ? 'text-red-400' : 'text-red-600'
  const codeBg = isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f5]'
  const codeText = isDark ? 'text-[#E6E6E6]' : 'text-black/80'
  const copyButtonBg = isDark ? 'bg-[#1a1a1a] hover:bg-[#252525]' : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
  const copyIconColor = isDark ? 'text-[#8A8A8A] hover:text-[#E6E6E6]' : 'text-black/50 hover:text-black/80'
  const sectionHeadingClass = `mb-3 text-lg font-semibold tracking-tight ${textColor} lg:mb-4 lg:text-xl`
  const paragraphClass = `text-sm leading-relaxed ${textColorBody} lg:text-base`
  const releaseBodyClass = `space-y-2 text-sm leading-relaxed ${textColorBody}`
  const tarballMetaClass = `text-xs ${textColorBodyLight} lg:text-sm`

  const CodeBlock = ({ code, version }: { code: string; version: string }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    return (
      <div className="mt-4">
        <div className={`flex items-start rounded-xl ${codeBg} max-w-full overflow-hidden`}>
          <div className="flex-1 min-w-0 px-4 py-2.5">
            <code className={`font-mono ${codeText} text-sm break-all`}>
              {code}
            </code>
          </div>
          <button
            onClick={handleCopy}
            className={`flex-shrink-0 flex items-center justify-center ${copyButtonBg} rounded-r-xl transition-colors px-3 py-2.5`}
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
        <div className={`mt-2 flex items-center gap-1 text-xs ${linkColor}`}>
          <a
            href={`https://github.com/tilesprivacy/tiles/blob/${version}/scripts/install.sh`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 transition-colors"
          >
            View script source
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
    )
  }

  const TarballList = ({ release }: { release: Release }) => {
    if (release.tarballs.length === 0) {
      return null
    }

    return (
      <div className={`mb-4 space-y-1 ${tarballMetaClass}`}>
        {release.tarballs.map((tarball) => (
          <div key={tarball.name} className="flex flex-wrap items-center gap-x-2">
            <span>Tarball:</span>
            <a
              href={tarball.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-0.5 font-medium ${linkColor} underline underline-offset-2`}
            >
              {tarball.name}
              <ExternalLinkIcon />
            </a>
            <span>({formatBinarySize(tarball.sizeBytes)})</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative flex min-h-screen flex-col ${bgColor}`}>
      <main className="flex-1 px-4 pb-16 pt-32 lg:px-8 lg:pt-44">
        <div className="mx-auto max-w-3xl">
          <h1 className={`mb-4 text-3xl font-bold tracking-tight ${textColor} lg:mb-5 lg:text-5xl`}>
            Changelog
          </h1>
          <p className={`mb-10 text-base ${textColorMuted} lg:mb-12 lg:text-xl`}>
            All notable changes and releases for Tiles.
          </p>

          {/* Status */}
          <section className="mb-10 border-b border-black/5 pb-10 dark:border-white/10 lg:mb-12 lg:pb-12">
            <h2 className={sectionHeadingClass}>
              Status
            </h2>
            <p className={paragraphClass}>
              Tiles is currently in alpha. We are focused on making the assistant faster, more reliable, and genuinely useful in daily workflows. Alongside improving the core experience, we are steadily expanding its capabilities and exposing more control through the Tilekit SDK so developers can shape and extend what Tiles can do. Expect rapid iteration with security and correctness as the baseline.
            </p>
          </section>

          {/* What's next */}
          <section className="mb-10 border-b border-black/5 pb-10 dark:border-white/10 lg:mb-12 lg:pb-12">
            <h2 className={sectionHeadingClass}>
              What's next
            </h2>
            <h3 className={`mb-3 text-sm font-medium ${textColorMuted} lg:text-base`}>
              H1 2026
            </h3>
            <ul className={`mb-5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed ${textColorBody} lg:text-base`}>
              <li>ATProto-based identity with support for Personal Data Servers (PDS)</li>
              <li>Peer-to-peer encrypted sync</li>
              <li>Connectors based on MCP and Agent Skills optimized for token efficiency</li>
              <li>MLS-based group chats</li>
            </ul>
            <p className={`mb-5 ${paragraphClass}`}>
              If you would like to influence how we implement this roadmap, join the discussion in our RFCs.
            </p>
            <a
              href="https://github.com/orgs/tilesprivacy/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 rounded-2xl bg-black/[0.03] px-5 py-3 text-sm font-medium transition-colors dark:bg-white/[0.05] ${linkColor} hover:underline lg:text-base`}
            >
              View the RFCs
              <ExternalLinkIcon />
            </a>
          </section>

          {error ? (
            <div className={`rounded-lg ${errorBg} p-4 ${errorText}`}>{error}</div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-[124px] top-0 hidden h-full w-px ${timelineBg} md:block`} />

              <div className="space-y-10 md:space-y-12">
                {releases.map((release, index) => (
                  <div
                    key={release.version}
                    className="relative border-b border-black/5 pb-10 last:border-b-0 last:pb-0 dark:border-white/10"
                  >
                    {/* Mobile layout */}
                    <div className="md:hidden">
                      <div className="mb-3 flex items-center gap-3">
                        <span className={`text-base font-semibold ${textColor} lg:text-lg`}>
                          {release.version}
                        </span>
                        {index === 0 && (
                          <span className={`rounded-full ${badgeBg} px-2 py-0.5 text-xs font-medium ${badgeText}`}>
                            Latest
                          </span>
                        )}
                        {release.isPrerelease && (
                          <span className={`rounded-full ${badgeBg} px-2 py-0.5 text-xs font-medium ${badgeTextLight}`}>
                            Pre-release
                          </span>
                        )}
                      </div>
                      <p className={`mb-2 text-sm ${textColorSubtle}`}>{release.date}</p>
                      <h2 className={`mb-3 text-base font-semibold tracking-tight ${textColorHeading} lg:text-lg`}>
                        {release.title !== release.version ? release.title : `Alpha ${releases.length - index}`}
                      </h2>
                      <div className="mb-4 flex flex-wrap gap-3">
                        <a
                          href={release.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-0.5 text-sm font-medium capitalize ${linkColor} underline underline-offset-2`}
                        >
                          github
                          <ExternalLinkIcon />
                        </a>
                        {release.compareUrl && (
                          <a
                            href={release.compareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-0.5 text-sm font-medium capitalize ${linkColor} underline underline-offset-2`}
                          >
                            changelog
                            <ExternalLinkIcon />
                          </a>
                        )}
                      </div>
                      <TarballList release={release} />
                      {release.changes.length > 0 && (
                        <ul className={releaseBodyClass}>
                          {release.changes.map((change, i) => (
                            <li key={i}>
                              <div className="flex items-start gap-2">
                                <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletBg}`} />
                                <span>{renderTextWithCode(change.text, isDark)}</span>
                              </div>
                              {change.subItems && change.subItems.length > 0 && (
                                <ul className="ml-4 mt-1.5 space-y-1.5">
                                  {change.subItems.map((subItem, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                      <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletBgLight}`} />
                                      <span className={textColorBodyLight}>{renderTextWithCode(subItem, isDark)}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      <CodeBlock code={`curl -fsSL https://raw.githubusercontent.com/tilesprivacy/tiles/${release.version}/scripts/install.sh | sh`} version={release.version} />
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid md:grid-cols-[100px_16px_1fr] md:gap-4">
                      {/* Left column: version and date */}
                      <div className="text-right">
                        <span className={`text-base font-semibold ${textColor} lg:text-lg`}>
                          {release.version}
                        </span>
                        <p className={`text-sm ${textColorSubtle}`}>{release.date}</p>
                      </div>

                      {/* Center column: dot */}
                      <div className="relative flex justify-center items-start">
                        <div className={`relative z-10 h-3 w-3 rounded-full ${dotBg} mt-2 ring-4 ${dotRing}`} />
                      </div>

                      {/* Right column: content */}
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <h2 className={`text-lg font-semibold tracking-tight ${textColorHeading}`}>
                            {release.title !== release.version
                              ? release.title
                              : `Alpha ${releases.length - index}`}
                          </h2>
                          {index === 0 && (
                            <span className={`rounded-full ${badgeBg} px-2 py-0.5 text-xs font-medium ${badgeText}`}>
                              Latest
                            </span>
                          )}
                          {release.isPrerelease && (
                            <span className={`rounded-full ${badgeBg} px-2 py-0.5 text-xs font-medium ${badgeTextLight}`}>
                              Pre-release
                            </span>
                          )}
                        </div>

                        <div className="mb-4 flex flex-wrap gap-4">
                          <a
                            href={release.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-0.5 text-sm font-medium capitalize ${linkColor} underline underline-offset-2`}
                          >
                            github
                            <ExternalLinkIcon />
                          </a>
                          {release.compareUrl && (
                            <a
                              href={release.compareUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-0.5 text-sm font-medium capitalize ${linkColor} underline underline-offset-2`}
                            >
                              changelog
                              <ExternalLinkIcon />
                            </a>
                          )}
                        </div>
                        <TarballList release={release} />

                        {release.changes.length > 0 && (
                          <ul className={releaseBodyClass}>
                            {release.changes.map((change, i) => (
                              <li key={i}>
                                <div className="flex items-start gap-2">
                                  <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletBg}`} />
                                  <span>{renderTextWithCode(change.text, isDark)}</span>
                                </div>
                                {change.subItems && change.subItems.length > 0 && (
                                  <ul className="ml-4 mt-1.5 space-y-1.5">
                                    {change.subItems.map((subItem, j) => (
                                      <li key={j} className="flex items-start gap-2">
                                        <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletBgLight}`} />
                                        <span className={textColorBodyLight}>{renderTextWithCode(subItem, isDark)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                        <CodeBlock code={`curl -fsSL https://raw.githubusercontent.com/tilesprivacy/tiles/${release.version}/scripts/install.sh | sh`} version={release.version} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
