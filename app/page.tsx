import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { getLatestDownloadArtifact } from "@/lib/download-artifact"
import { TILES_HOMEPAGE_DESCRIPTION, TILES_SITE_TITLE } from "@/lib/product-description"

export const metadata: Metadata = {
  title: TILES_SITE_TITLE,
  description: TILES_HOMEPAGE_DESCRIPTION,
  openGraph: {
    title: TILES_SITE_TITLE,
    description: TILES_HOMEPAGE_DESCRIPTION,
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: TILES_SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TILES_SITE_TITLE,
    description: TILES_HOMEPAGE_DESCRIPTION,
    images: ["https://www.tiles.run/api/og"],
  },
}

export default async function Page() {
  const artifact = await getLatestDownloadArtifact()
  return <HomeContent macDownloadUrl={artifact.downloadUrl} />
}
