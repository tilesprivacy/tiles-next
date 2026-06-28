import type { Metadata } from "next"
import { PluginsContent } from "@/components/plugins-content"
import { getTilesPlugins } from "@/lib/plugins"

export const metadata: Metadata = {
  title: "Plugins | Tiles",
  description: "Install workflow plugins for Tiles from the public plugin archive.",
  openGraph: {
    title: "Plugins | Tiles",
    description: "Install workflow plugins for Tiles from the public plugin archive.",
    type: "website",
    images: [
      {
        url: "https://www.tiles.run/api/og",
        width: 1200,
        height: 630,
        alt: "Plugins | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plugins | Tiles",
    description: "Install workflow plugins for Tiles from the public plugin archive.",
    images: ["https://www.tiles.run/api/og"],
  },
}

export default async function PluginsPage() {
  const plugins = await getTilesPlugins()

  return <PluginsContent plugins={plugins} />
}
