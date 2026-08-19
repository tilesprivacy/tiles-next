import { fetchReleases, Release } from "@/lib/releases"
import { ChangelogContent } from "@/components/changelog-content"
import {
  LATEST_RELEASE_SECTIONS,
  LATEST_RELEASE_TITLE,
} from "@/lib/latest-release-copy"
import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"

const socialImage = getSocialImage("Releases")

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
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Releases | Tiles",
    description: "All notable changes and releases for Tiles.",
    images: [socialImage.url],
  },
}

export default async function ReleasesPage() {
  let releases: Release[] = []
  let error: string | null = null

  try {
    releases = (await fetchReleases()).map((release, index) =>
      index === 0
        ? {
            ...release,
            title: LATEST_RELEASE_TITLE,
            sections: LATEST_RELEASE_SECTIONS,
          }
        : release
    )
  } catch (e) {
    error = "Failed to load releases. Please try again later."
  }

  return <ChangelogContent releases={releases} error={error} />
}
