import type { Metadata } from "next"
import { HomeContent } from "@/components/home-content"
import { fetchReleases } from "@/lib/releases"

export const metadata: Metadata = {
  title: "Tiles: Your private AI assistant for everyday use",
  openGraph: {
    title: "Tiles",
  },
  twitter: {
    title: "Tiles",
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
