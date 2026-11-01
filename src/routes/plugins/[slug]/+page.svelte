<script lang="ts">
  import PluginDetailContent from "#lib/components/PluginDetailContent.svelte"
  import { getPluginSocialImage } from "#lib/social-image"

  let { data } = $props()

  const title = $derived(`${data.plugin.name} | Tiles Plugins`)
  const image = $derived(getPluginSocialImage(data.plugin))
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={data.plugin.description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={data.plugin.description} />
  <meta property="og:image" content={image.url} />
  <meta property="og:image:type" content={image.type} />
  <meta property="og:image:width" content={String(image.width)} />
  <meta property="og:image:height" content={String(image.height)} />
  <meta property="og:image:alt" content={image.alt} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={data.plugin.description} />
  <meta name="twitter:image" content={image.url} />
</svelte:head>

<PluginDetailContent plugin={data.plugin} metadata={data.metadata} mcpServers={data.mcpServers} skills={data.skills} />
