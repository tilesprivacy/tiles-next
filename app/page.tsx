import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { fetchReleases } from "@/lib/releases"

export const metadata: Metadata = {
  title: "Tiles: Your private and secure AI assistant for everyday use",
  openGraph: {
    title: "Tiles",
    description: "Your private and secure AI assistant for everyday use",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Tiles - Your private and secure AI assistant for everyday use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tiles",
    description: "Your private and secure AI assistant for everyday use",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default async function Page() {
  let latestVersion = "0.0.0"

  try {
    const releases = await fetchReleases()
    if (releases.length > 0) {
      latestVersion = releases[0].version
    }
  } catch (error) {
    // Fallback to default version if fetch fails
  }

  return <HomeContent latestVersion={latestVersion} />
}
