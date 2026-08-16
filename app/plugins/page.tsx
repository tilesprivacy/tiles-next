import type { Metadata } from "next"
import { PluginsContent } from "@/components/plugins-content"
import { getTilesPlugins } from "@/lib/plugins"

const DEFAULT_SOCIAL_IMAGE =
  "https://raw.githubusercontent.com/tilesprivacy/tiles-next/main/public/own-your-ai-og.png"

export const metadata: Metadata = {
  title: "Plugins | Tiles",
  description: "Use plugins in Tiles to add reusable workflows with skills.",
  openGraph: {
    title: "Plugins | Tiles",
    description: "Use plugins in Tiles to add reusable workflows with skills.",
    type: "website",
    images: [
      {
        url: DEFAULT_SOCIAL_IMAGE,
        width: 1672,
        height: 941,
        type: "image/png",
        alt: "Plugins | Tiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plugins | Tiles",
    description: "Use plugins in Tiles to add reusable workflows with skills.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
}

export default async function PluginsPage() {
  const plugins = await getTilesPlugins()

  return <PluginsContent plugins={plugins} />
}
