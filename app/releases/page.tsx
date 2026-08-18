import { fetchReleases, Release } from "@/lib/releases"
import { ChangelogContent } from "@/components/changelog-content"
import {
  LATEST_RELEASE_SECTIONS,
  LATEST_RELEASE_VERSION,
} from "@/lib/latest-release-copy"
import type { Metadata } from "next"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Releases | Tiles",
  description: "All notable changes and releases for Tiles.",
  openGraph: {
    title: "Releases | Tiles",
    description: "All notable changes and releases for Tiles.",
    url: "https://www.tiles.run/releases",
    type: "website",
    images: [socialImage("Releases | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Releases | Tiles",
    description: "All notable changes and releases for Tiles.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default async function ReleasesPage() {
  let releases: Release[] = []
  let error: string | null = null

  try {
    releases = (await fetchReleases()).map((release) =>
      release.version.replace(/^v/, "") === LATEST_RELEASE_VERSION
        ? { ...release, sections: LATEST_RELEASE_SECTIONS }
        : release
    )
  } catch (e) {
    error = "Failed to load releases. Please try again later."
  }

  return <ChangelogContent releases={releases} error={error} />
}
