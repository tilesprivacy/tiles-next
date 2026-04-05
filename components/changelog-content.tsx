'use client'

import { SiteFooter } from "@/components/site-footer"
import type { Release } from "@/lib/releases"
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { formatBinarySize } from "@/lib/format-binary-size"

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

const getReleaseAnchorId = (version: string) => version.replace(/^v/, "")

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
  const sectionHeadingClass = `mb-3 text-lg font-semibold tracking-tight ${textColor} lg:mb-4 lg:text-xl`
  const paragraphClass = `text-sm leading-relaxed ${textColorBody} lg:text-base`
  const releaseBodyClass = `space-y-2 text-sm leading-relaxed ${textColorBody}`
  const releaseSectionHeadingClass = `text-xs font-semibold uppercase tracking-wide ${textColorMuted}`
  const tarballMetaClass = `text-xs ${textColorBodyLight} lg:text-sm`

  const DownloadArtifacts = ({ release }: { release: Release }) => {
    const hasTarballs = release.tarballs.length > 0
    const hasInstaller = Boolean(release.installer)
    const hasFullInstaller = Boolean(release.fullInstaller)

    if (!hasTarballs && !hasInstaller && !hasFullInstaller) {
      return null
    }

    return (
      <div className={`mb-4 mt-1 space-y-2 ${tarballMetaClass}`}>
        {release.installer && (
          <div className={`rounded-xl ${codeBg} px-3 py-2.5`}>
            <div className="flex flex-wrap items-center gap-x-2">
              <span>Network installer:</span>
              <a
                href={release.installer.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-0.5 font-medium ${linkColor} underline underline-offset-2`}
              >
                {release.installer.name}
                <ExternalLinkIcon />
              </a>
              <span>({formatBinarySize(release.installer.sizeBytes, { unknownLabel: "Unknown size" })})</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span>SHA256:</span>
              <span className="font-mono text-[11px] break-all">{release.installer.sha256}</span>
            </div>
          </div>
        )}

        {release.fullInstaller && (
          <div className={`rounded-xl ${codeBg} px-3 py-2.5`}>
            <div className="flex flex-wrap items-center gap-x-2">
              <span>Full installer:</span>
              <a
                href={release.fullInstaller.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-0.5 font-medium ${linkColor} underline underline-offset-2`}
              >
                {release.fullInstaller.name}
                <ExternalLinkIcon />
              </a>
              <span>({formatBinarySize(release.fullInstaller.sizeBytes, { unknownLabel: "Unknown size" })})</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span>SHA256:</span>
              <span className="font-mono text-[11px] break-all">{release.fullInstaller.sha256}</span>
            </div>
          </div>
        )}

        {release.tarballs.map((tarball) => (
          <div key={tarball.name} className={`rounded-xl ${codeBg} px-3 py-2.5`}>
            <div className="flex flex-wrap items-center gap-x-2">
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
              <span>({formatBinarySize(tarball.sizeBytes, { unknownLabel: "Unknown size" })})</span>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span>SHA256:</span>
              <span className="font-mono text-[11px] break-all">{tarball.sha256}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative flex min-h-screen flex-col ${bgColor}`}>
      <main className="flex-1 px-4 pb-16 pt-[calc(8rem+env(safe-area-inset-top,0px))] lg:px-8 lg:pt-[calc(11rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto max-w-3xl">
          <h1 className={`mb-4 text-3xl font-bold tracking-tight ${textColor} lg:mb-5 lg:text-5xl`}>
            Changelog
          </h1>
          <p className={`mb-10 text-base ${textColorMuted} lg:mb-12 lg:text-xl`}>
            All notable changes and releases for Tiles.
          </p>

          {/* Status */}
          <section
            id="status"
            className="mb-10 border-b border-black/5 pb-10 dark:border-white/10 scroll-mt-28 lg:mb-12 lg:pb-12 lg:scroll-mt-40"
          >
            <h2 className={sectionHeadingClass}>
              <a href="#status">
                Status
              </a>
            </h2>
            <p className={paragraphClass}>
              Tiles is currently in alpha. We are focused on making the assistant faster, more reliable, and genuinely useful in daily workflows. Alongside improving the core experience, we are steadily expanding its capabilities and exposing more control through the Tilekit SDK so developers can shape and extend what Tiles can do. Expect rapid iteration with security and correctness as the baseline.
            </p>
          </section>

          {/* Roadmap */}
          <section
            id="roadmap"
            className="mb-10 border-b border-black/5 pb-10 dark:border-white/10 scroll-mt-28 lg:mb-12 lg:pb-12 lg:scroll-mt-40"
          >
            <h2 className={sectionHeadingClass}>
              <a href="#roadmap">
                Roadmap
              </a>
            </h2>
            <h3 className={`mb-3 text-sm font-medium ${textColorMuted} lg:text-base`}>
              H1 2026
            </h3>
            <ul className={`mb-5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed ${textColorBody} lg:text-base`}>
              <li>ATProto-based identity with support for Personal Data Servers (PDS)</li>
              <li className={`line-through ${textColorBodyLight}`}>
                Peer-to-peer encrypted sync
              </li>
              <li>Agentic harness built with Pi</li>
              <li>MLS-based group chats</li>
              <li>Chunk-based deduplication and caching for Modelfile-generated models</li>
            </ul>
            <p className={`mb-5 ${paragraphClass}`}>
              If you would like to influence how we implement this roadmap, join the discussion in our RFCs.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/orgs/tilesprivacy/projects/4"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 rounded-2xl bg-black/[0.03] px-5 py-3 text-sm font-medium transition-colors dark:bg-white/[0.05] ${linkColor} hover:underline lg:text-base`}
              >
                Track progress
                <ExternalLinkIcon />
              </a>
              <a
                href="https://github.com/orgs/tilesprivacy/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 rounded-2xl bg-black/[0.03] px-5 py-3 text-sm font-medium transition-colors dark:bg-white/[0.05] ${linkColor} hover:underline lg:text-base`}
              >
                View the RFCs
                <ExternalLinkIcon />
              </a>
            </div>
          </section>

          <section
            id="releases"
            className="mb-8 scroll-mt-28 lg:mb-10 lg:scroll-mt-40"
          >
            <h2 className={sectionHeadingClass}>
              <a href="#releases">
                Releases
              </a>
            </h2>
            <p className={`text-sm leading-relaxed ${textColorBodyLight} lg:text-base`}>
              The format is based on{" "}
              <a
                href="https://keepachangelog.com/en/1.1.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-0.5 font-medium ${linkColor} underline underline-offset-2`}
              >
                Keep a Changelog convention
                <ExternalLinkIcon />
              </a>
              .
            </p>
          </section>

          {error ? (
            <div className={`rounded-lg ${errorBg} p-4 ${errorText}`}>{error}</div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-[124px] top-0 hidden h-full w-px ${timelineBg} md:block`} />

              <div className="space-y-10 md:space-y-12">
                {releases.map((release, index) => {
                  const releaseAnchorId = getReleaseAnchorId(release.version)
                  return (
                  <div
                    key={release.version}
                    id={releaseAnchorId}
                    className="relative scroll-mt-28 border-b border-black/5 pb-10 last:border-b-0 last:pb-0 dark:border-white/10 lg:scroll-mt-40"
                  >
                    {/* Mobile layout */}
                    <div className="md:hidden">
                      <div className="mb-3 flex items-center gap-3">
                        <a
                          href={`#${releaseAnchorId}`}
                          className={`text-base font-semibold ${linkColor} lg:text-lg`}
                        >
                          {release.version}
                        </a>
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
                      <DownloadArtifacts release={release} />
                      {release.sections.length > 0 && (
                        <div className="space-y-5">
                          {release.sections.map((section, sectionIndex) => (
                            <section key={`${release.version}-${section.title}-${sectionIndex}`} className="space-y-2">
                              <h3 className={releaseSectionHeadingClass}>{section.title}</h3>
                              <ul className={releaseBodyClass}>
                                {section.changes.map((change, i) => (
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
                            </section>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid md:grid-cols-[100px_16px_1fr] md:gap-4">
                      {/* Left column: version and date */}
                      <div className="text-right">
                        <a
                          href={`#${releaseAnchorId}`}
                          className={`text-base font-semibold ${linkColor} lg:text-lg`}
                        >
                          {release.version}
                        </a>
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
                        <DownloadArtifacts release={release} />

                        {release.sections.length > 0 && (
                          <div className="space-y-5">
                            {release.sections.map((section, sectionIndex) => (
                              <section key={`${release.version}-${section.title}-${sectionIndex}`} className="space-y-2">
                                <h3 className={releaseSectionHeadingClass}>{section.title}</h3>
                                <ul className={releaseBodyClass}>
                                  {section.changes.map((change, i) => (
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
                              </section>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
