<script lang="ts">
  import { STANDARD_SITE_PUBLICATION_URI } from "#lib/standard-site"

  // Bluesky builds rich previews for standard.site posts from these tags, so
  // they must be in the served HTML.
  let {
    documentUri,
    includePublication = true,
  }: { documentUri?: string; includePublication?: boolean } = $props()
</script>

<svelte:head>
  {#if includePublication}<link rel="site.standard.publication" href={STANDARD_SITE_PUBLICATION_URI} />{/if}
  {#if documentUri}<link rel="site.standard.document" href={documentUri} />{/if}
</svelte:head>
