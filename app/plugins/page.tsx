import type { Metadata } from "next"
import { PluginsContent } from "@/components/plugins-content"
import { getTilesPlugins } from "@/lib/plugins"
import { DEFAULT_SOCIAL_IMAGE_URL, socialImage } from "@/lib/social-image"

export const metadata: Metadata = {
  title: "Plugins | Tiles",
  description: "Use plugins in Tiles to add reusable workflows with skills.",
  openGraph: {
    title: "Plugins | Tiles",
    description: "Use plugins in Tiles to add reusable workflows with skills.",
    type: "website",
    images: [socialImage("Plugins | Tiles")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plugins | Tiles",
    description: "Use plugins in Tiles to add reusable workflows with skills.",
    images: [DEFAULT_SOCIAL_IMAGE_URL],
  },
}

export default async function PluginsPage() {
  const plugins = await getTilesPlugins()

  return <PluginsContent plugins={plugins} />
}
