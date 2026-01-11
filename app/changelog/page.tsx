import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { fetchReleases, Release } from "@/lib/releases"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Tiles Changelog",
  description: "Track releases and notable changes for Tiles, including version history and highlights.",
  openGraph: {
    title: "Tiles Changelog",
    description: "Track releases and notable changes for Tiles, including version history and highlights.",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Changelog",
    description: "Track releases and notable changes for Tiles, including version history and highlights.",
    images: ["/api/og"],
  },
}

// SVG icon for external links (matching mdx-components.tsx)
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

export default async function ChangelogPage() {
  let releases: Release[] = []
  let error: string | null = null

  try {
    releases = await fetchReleases()
  } catch (e) {
    error = "Failed to load releases. Please try again later."
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 px-4 pb-16 pt-24 lg:px-8 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-black lg:mb-5 lg:text-4xl">
            Changelog
          </h1>
          <p className="mb-10 text-base text-black/60 lg:mb-12 lg:text-lg">
            All notable changes and releases for Tiles.
          </p>

          {error ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[124px] top-0 hidden h-full w-px bg-gray-200 md:block" />

              <div className="space-y-10 md:space-y-12">
                {releases.map((release, index) => (
                  <div key={release.version} className="relative">
                    {/* Mobile layout */}
                    <div className="md:hidden">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg font-semibold text-black">
                          {release.version}
                        </span>
                        {index === 0 && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                            Latest
                          </span>
                        )}
                        {release.isPrerelease && (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            Pre-release
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{release.date}</p>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">
                        {release.title !== release.version ? release.title : `Alpha ${releases.length - index}`}
                      </h2>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <a
                          href={release.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 inline-flex items-center gap-0.5"
                        >
                          github
                          <ExternalLinkIcon />
                        </a>
                        {release.compareUrl && (
                          <a
                            href={release.compareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 inline-flex items-center gap-0.5"
                          >
                            changelog
                            <ExternalLinkIcon />
                          </a>
                        )}
                      </div>
                      {release.changes.length > 0 && (
                        <ul className="space-y-2 text-sm text-gray-600">
                          {release.changes.map((change, i) => (
                            <li key={i}>
                              <div className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                <span>{change.text}</span>
                              </div>
                              {change.subItems && change.subItems.length > 0 && (
                                <ul className="ml-4 mt-1 space-y-1">
                                  {change.subItems.map((subItem, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                                      <span className="text-gray-500">{subItem}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid md:grid-cols-[100px_16px_1fr] md:gap-4">
                      {/* Left column: version and date */}
                      <div className="text-right">
                        <span className="text-lg font-semibold text-black">
                          {release.version}
                        </span>
                        <p className="text-sm text-gray-400">{release.date}</p>
                      </div>

                      {/* Center column: dot */}
                      <div className="relative flex justify-center items-start">
                        <div className="relative z-10 h-3 w-3 rounded-full bg-black mt-2 ring-4 ring-white" />
                      </div>

                      {/* Right column: content */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {release.title !== release.version
                              ? release.title
                              : `Alpha ${releases.length - index}`}
                          </h2>
                          {index === 0 && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                              Latest
                            </span>
                          )}
                          {release.isPrerelease && (
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              Pre-release
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 mb-4">
                          <a
                            href={release.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 inline-flex items-center gap-0.5"
                          >
                            github
                            <ExternalLinkIcon />
                          </a>
                          {release.compareUrl && (
                            <a
                              href={release.compareUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-gray-900 inline-flex items-center gap-0.5"
                            >
                              changelog
                              <ExternalLinkIcon />
                            </a>
                          )}
                        </div>

                        {release.changes.length > 0 && (
                          <ul className="space-y-2 text-sm text-gray-600">
                            {release.changes.map((change, i) => (
                              <li key={i}>
                                <div className="flex items-start gap-2">
                                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                                  <span>{change.text}</span>
                                </div>
                                {change.subItems && change.subItems.length > 0 && (
                                  <ul className="ml-4 mt-1 space-y-1">
                                    {change.subItems.map((subItem, j) => (
                                      <li key={j} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                                        <span className="text-gray-500">{subItem}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
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
