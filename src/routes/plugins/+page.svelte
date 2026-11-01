<script lang="ts">
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"
  import PluginsContent from "#lib/components/PluginsContent.svelte"

  let { data } = $props()
</script>

<PageHeadMeta
  title="Plugins | Tiles"
  description="Extend Tiles with portable skills and MCP servers using the open Agent Plugins standard."
  imageTitle="Plugins"
/>

<PluginsContent plugins={data.plugins} />
