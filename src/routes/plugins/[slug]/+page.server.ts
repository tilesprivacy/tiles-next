import { error } from "@sveltejs/kit"
import {
  getTilesPlugin,
  getTilesPluginMcpServers,
  getTilesPluginMetadata,
  getTilesPluginSkills,
  getTilesPlugins,
} from "#lib/plugins"
import type { EntryGenerator, PageServerLoad } from "./$types"

export const entries: EntryGenerator = async () =>
  (await getTilesPlugins()).map((plugin) => ({ slug: plugin.slug }))

export const load: PageServerLoad = async ({ params }) => {
  const plugin = await getTilesPlugin(params.slug)
  if (!plugin) error(404, "Plugin not found")

  const [metadata, mcpServers, skills] = await Promise.all([
    getTilesPluginMetadata(params.slug),
    getTilesPluginMcpServers(params.slug),
    getTilesPluginSkills(params.slug),
  ])

  return { plugin, metadata, mcpServers, skills }
}
