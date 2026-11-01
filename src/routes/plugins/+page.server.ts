import { getTilesPlugins } from "#lib/plugins"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async () => ({ plugins: await getTilesPlugins() })
