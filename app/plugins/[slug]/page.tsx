import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PluginDetailContent } from "@/components/plugin-detail-content"
import { getTilesPlugin, getTilesPluginSkills, getTilesPlugins } from "@/lib/plugins"

interface PluginPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const plugins = await getTilesPlugins()

  return plugins.map((plugin) => ({
    slug: plugin.slug,
  }))
}

export async function generateMetadata({ params }: PluginPageProps): Promise<Metadata> {
  const { slug } = await params
  const plugin = await getTilesPlugin(slug)

  if (!plugin) {
    return {
      title: "Plugin not found | Tiles",
    }
  }

  return {
    title: `${plugin.name} | Tiles Plugins`,
    description: plugin.description,
    openGraph: {
      title: `${plugin.name} | Tiles Plugins`,
      description: plugin.description,
      type: "website",
      images: [
        {
          url: "https://www.tiles.run/api/og",
          width: 1200,
          height: 630,
          alt: `${plugin.name} | Tiles Plugins`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${plugin.name} | Tiles Plugins`,
      description: plugin.description,
      images: ["https://www.tiles.run/api/og"],
    },
  }
}

export default async function PluginPage({ params }: PluginPageProps) {
  const { slug } = await params
  const plugin = await getTilesPlugin(slug)

  if (!plugin) {
    notFound()
  }

  const skills = await getTilesPluginSkills(slug)

  return <PluginDetailContent plugin={plugin} skills={skills} />
}
