<script lang="ts">
  import { page } from "$app/state"
  import { absoluteUrl } from "#lib/absolute-url"

  let { path, ogUrl }: { path?: string; ogUrl?: string } = $props()

  // Use the page path, never tracking parameters or the serving host.
  const canonical = $derived(absoluteUrl(path ?? page.url.pathname))
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <meta property="og:url" content={ogUrl ? absoluteUrl(ogUrl) : canonical} />
</svelte:head>
