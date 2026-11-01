<script lang="ts">
  import DownloadContent from "#lib/components/DownloadContent.svelte"
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"
  import { TILES_PRODUCT_DESCRIPTION } from "#lib/product-description"

  let { data } = $props()
</script>

<PageHeadMeta
  title="Download | Tiles"
  description={TILES_PRODUCT_DESCRIPTION}
  imageTitle="Download"
  ogUrl="https://www.tiles.run/download"
  siteName="Tiles Privacy"
/>

<DownloadContent initialDownload={data.download} initialCanaryRelease={data.canaryRelease} />
