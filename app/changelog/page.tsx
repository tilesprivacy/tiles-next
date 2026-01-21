import { fetchReleases, Release } from "@/lib/releases"
import { ChangelogContent } from "@/components/changelog-content"
import type { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Tiles Changelog",
  description: "All notable changes and releases for Tiles.",
  openGraph: {
    title: "Tiles Changelog",
    description: "All notable changes and releases for Tiles.",
    type: "website",
    images: [
      {
        url: "https://tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles Changelog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles Changelog",
    description: "All notable changes and releases for Tiles.",
    images: ["https://tiles.run/api/og"],
  },
}

export default async function ChangelogPage() {
  let releases: Release[] = []
  let error: string | null = null

  try {
    releases = await fetchReleases()
  } catch (e) {
    error = "Failed to load releases. Please try again later."
  }

  return <ChangelogContent releases={releases} error={error} />
}
