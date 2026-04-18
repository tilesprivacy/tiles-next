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
const renderTextWithCode = (text: string) => {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1)
      return (
        <code
          key={index}
          className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
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

  const bgColor = 'bg-background'
  const textColor = 'text-foreground'
  const textColorMuted = 'text-muted-foreground'
  const textColorSubtle = 'text-muted-foreground'
  const textColorBody = 'text-foreground/90'
  const textColorBodyLight = 'text-muted-foreground'
  const textColorHeading = 'text-foreground'
  const linkColor =
    'font-medium text-foreground underline decoration-foreground/35 underline-offset-2 transition-colors hover:decoration-foreground'
  const badgeBg = 'bg-muted'
  const badgeText = 'text-foreground'
  const badgeTextLight = 'text-muted-foreground'
  const timelineBg = 'bg-border'
  const dotBg = 'bg-foreground'
  const dotRing = 'ring-background'
  const bulletBg = 'bg-muted-foreground'
  const bulletBgLight = 'bg-border'
  const errorBg = isDark ? 'bg-red-900/30' : 'bg-red-50'
  const errorText = isDark ? 'text-red-400' : 'text-red-600'
  /** Legacy changelog card look: soft gray in light, charcoal in dark. */
  const artifactCardClass =
    'rounded-sm border border-black/5 bg-black/[0.035] px-3 py-2.5 text-sm text-foreground shadow-none dark:border-white/5 dark:bg-white/[0.06]'
  const artifactKindClass = 'text-xs font-medium text-muted-foreground'
  const artifactLinkClass = `${linkColor} inline-flex items-center gap-0.5 font-medium`
  const artifactShaBlockClass =
    'mt-2 text-[11px] leading-relaxed text-muted-foreground'
  const sectionHeadingClass = `mb-3 text-lg font-semibold tracking-tight ${textColor} lg:mb-4 lg:text-xl`
  const paragraphClass = `text-sm leading-relaxed ${textColorBody} lg:text-base`
  const releaseBodyClass = `space-y-2 text-sm leading-relaxed ${textColorBody}`
  const releaseSectionHeadingClass = `text-xs font-semibold uppercase tracking-wide ${textColorMuted}`
  const roadmapCtaClass =
    'inline-flex items-center gap-1 rounded-sm border border-black/5 bg-black/[0.045] px-4 py-2 text-sm font-medium text-foreground shadow-none transition-colors hover:bg-black/[0.08] dark:border-white/5 dark:bg-white/[0.08] dark:hover:bg-white/[0.14] lg:text-base'
  const DownloadArtifacts = ({ release }: { release: Release }) => {
    const hasTarballs = release.tarballs.length > 0
    const hasInstaller = Boolean(release.installer)
    const hasFullInstaller = Boolean(release.fullInstaller)

    if (!hasTarballs && !hasInstaller && !hasFullInstaller) {
      return null
    }

    return (
      <div className="mb-4 mt-1 space-y-2.5">
        {release.installer && (
          <div className={artifactCardClass}>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1">
              <span className={`shrink-0 ${artifactKindClass}`}>Network installer</span>
              <a
                href={release.installer.url}
                target="_blank"
                rel="noopener noreferrer"
                className={artifactLinkClass}
              >
                {release.installer.name}
                <ExternalLinkIcon />
              </a>
              <span className={`text-xs tabular-nums ${textColorMuted}`}>
                ({formatBinarySize(release.installer.sizeBytes, { unknownLabel: "Unknown size" })})
              </span>
            </div>
            <p className={artifactShaBlockClass}>
              <span className="select-none">SHA256 </span>
              <span className="break-all font-mono text-foreground">{release.installer.sha256}</span>
            </p>
          </div>
        )}

        {release.fullInstaller && (
          <div className={artifactCardClass}>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1">
              <span className={`shrink-0 ${artifactKindClass}`}>Offline installer</span>
              <a
                href={release.fullInstaller.url}
                target="_blank"
                rel="noopener noreferrer"
                className={artifactLinkClass}
              >
                {release.fullInstaller.name}
                <ExternalLinkIcon />
              </a>
              <span className={`text-xs tabular-nums ${textColorMuted}`}>
                ({formatBinarySize(release.fullInstaller.sizeBytes, { unknownLabel: "Unknown size" })})
              </span>
            </div>
            <p className={artifactShaBlockClass}>
              <span className="select-none">SHA256 </span>
              <span className="break-all font-mono text-foreground">{release.fullInstaller.sha256}</span>
            </p>
          </div>
        )}

        {release.tarballs.map((tarball) => (
          <div key={tarball.name} className={artifactCardClass}>
            <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1">
              <span className={`shrink-0 ${artifactKindClass}`}>Tarball</span>
              <a
                href={tarball.url}
                target="_blank"
                rel="noopener noreferrer"
                className={artifactLinkClass}
              >
                {tarball.name}
                <ExternalLinkIcon />
              </a>
              <span className={`text-xs tabular-nums ${textColorMuted}`}>
                ({formatBinarySize(tarball.sizeBytes, { unknownLabel: "Unknown size" })})
              </span>
            </div>
            <p className={artifactShaBlockClass}>
              <span className="select-none">SHA256 </span>
              <span className="break-all font-mono text-foreground">{tarball.sha256}</span>
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative flex min-h-screen flex-col ${bgColor}`}>
      <main className="flex-1 px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] lg:px-8 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]">
        <div className="mx-auto max-w-3xl">
          <h1 className={`mb-4 text-3xl font-bold tracking-tight ${textColor} lg:mb-5 lg:text-5xl`}>
            Changelog
          </h1>
          <p className={`mb-10 text-base ${textColorMuted} lg:mb-12 lg:text-xl`}>
            All notable changes and releases for Tiles.
          </p>

          {error ? (
            <div className={`rounded-sm ${errorBg} p-4 ${errorText}`}>{error}</div>
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
                                      <span>{renderTextWithCode(change.text)}</span>
                                    </div>
                                    {change.subItems && change.subItems.length > 0 && (
                                      <ul className="ml-4 mt-1.5 space-y-1.5">
                                        {change.subItems.map((subItem, j) => (
                                          <li key={j} className="flex items-start gap-2">
                                            <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletBgLight}`} />
                                            <span className={textColorBodyLight}>{renderTextWithCode(subItem)}</span>
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
                                        <span>{renderTextWithCode(change.text)}</span>
                                      </div>
                                      {change.subItems && change.subItems.length > 0 && (
                                        <ul className="ml-4 mt-1.5 space-y-1.5">
                                          {change.subItems.map((subItem, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                              <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${bulletBgLight}`} />
                                              <span className={textColorBodyLight}>{renderTextWithCode(subItem)}</span>
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
