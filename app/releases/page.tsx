import { fetchReleases, Release } from "@/lib/releases"
import { ChangelogContent } from "@/components/changelog-content"
import type { Metadata } from "next"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Releases | Tiles",
  description: "All notable changes and releases for Tiles.",
  openGraph: {
    title: "Releases | Tiles",
    description: "All notable changes and releases for Tiles.",
    url: "https://www.tiles.run/releases",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Releases | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Releases | Tiles",
    description: "All notable changes and releases for Tiles.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default async function ReleasesPage() {
  let releases: Release[] = []
  let error: string | null = null

  try {
    releases = await fetchReleases()
  } catch (e) {
    error = "Failed to load releases. Please try again later."
  }

  return <ChangelogContent releases={releases} error={error} />
}
