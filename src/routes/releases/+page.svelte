<script lang="ts">
  import ChangelogContent from "#lib/components/ChangelogContent.svelte"
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"

  let { data } = $props()
</script>

<PageHeadMeta
  title="Releases | Tiles"
  description="All notable changes and releases for Tiles."
  imageTitle="Releases"
  ogUrl="https://www.tiles.run/releases"
/>

<ChangelogContent releases={data.releases} error={data.error} />
