<script lang="ts">
  import { absoluteUrl } from "#lib/absolute-url"
  import { getSocialImage } from "#lib/social-image"

  let {
    title,
    description,
    imageTitle,
    canonical,
    ogUrl,
    siteName,
  }: {
    title: string
    description: string
    /** Page name used for the social image alt text. */
    imageTitle: string
    canonical?: string
    ogUrl?: string
    siteName?: string
  } = $props()

  const image = $derived(getSocialImage(imageTitle))
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if canonical}<link rel="canonical" href={absoluteUrl(canonical)} />{/if}
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {#if ogUrl}<meta property="og:url" content={absoluteUrl(ogUrl)} />{/if}
  {#if siteName}<meta property="og:site_name" content={siteName} />{/if}
  <meta property="og:image" content={absoluteUrl(image.url)} />
  <meta property="og:image:type" content={image.type} />
  <meta property="og:image:width" content={String(image.width)} />
  <meta property="og:image:height" content={String(image.height)} />
  <meta property="og:image:alt" content={image.alt} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={absoluteUrl(image.url)} />
</svelte:head>
