import type { Metadata } from "next"
import { getSocialImage } from "@/lib/social-image"
import { PluginsContent } from "@/components/plugins-content"
import { getTilesPlugins } from "@/lib/plugins"

const socialImage = getSocialImage("Plugins")

export const metadata: Metadata = {
  title: "Plugins | Tiles",
  description: "Use plugins in Tiles to add reusable workflows with skills.",
  openGraph: {
    title: "Plugins | Tiles",
    description: "Use plugins in Tiles to add reusable workflows with skills.",
    type: "website",
    images: [
      socialImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plugins | Tiles",
    description: "Use plugins in Tiles to add reusable workflows with skills.",
    images: [socialImage.url],
  },
}

export default async function PluginsPage() {
  const plugins = await getTilesPlugins()

  return <PluginsContent plugins={plugins} />
}
