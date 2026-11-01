<script lang="ts">
  import ResearchExplorationContent from "#lib/components/ResearchExplorationContent.svelte"
  import { absoluteUrl } from "#lib/absolute-url"
  import { getSocialImage } from "#lib/social-image"

  let { data } = $props()
  const entry = $derived(data.entry)
  const title = $derived(`${entry.title} | Research | Tiles`)
  const url = $derived(absoluteUrl(`/research/${entry.id}`))
  const image = $derived(getSocialImage(entry.title))
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={entry.description} />
  <link rel="canonical" href={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={entry.description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={absoluteUrl(image.url)} />
  <meta property="og:image:type" content={image.type} />
  <meta property="og:image:width" content={String(image.width)} />
  <meta property="og:image:height" content={String(image.height)} />
  <meta property="og:image:alt" content={title} />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={entry.description} />
  <meta name="twitter:image" content={absoluteUrl(image.url)} />
</svelte:head>

<ResearchExplorationContent {entry} toc={data.toc} markdown={!!data.Body}>
  {#if data.Body}
    <data.Body />
  {:else}
    <p>{entry.body ?? entry.description}</p>
  {/if}
</ResearchExplorationContent>
