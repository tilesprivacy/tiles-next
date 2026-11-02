<script lang="ts">
  import PricingSuccessContent from "#lib/components/PricingSuccessContent.svelte"
  import { PRICING_SUCCESS } from "#lib/pricing-plans"
  import { TILES_PRODUCT_DESCRIPTION } from "#lib/product-description"
  import { getSocialImage } from "#lib/social-image"

  let { data } = $props()

  const copy = $derived(PRICING_SUCCESS[data.plan])
  // The page sets no social card of its own, so it carries the site defaults.
  const image = getSocialImage()
</script>

<svelte:head>
  <title>{copy.title} | Tiles</title>
  <meta name="description" content={copy.description} />
  <!-- Post-checkout confirmation, not a page for search. -->
  <meta name="robots" content="noindex, nofollow" />
  <meta property="og:title" content="Tiles" />
  <meta property="og:description" content={TILES_PRODUCT_DESCRIPTION} />
  <meta property="og:url" content="https://tiles.run" />
  <meta property="og:site_name" content="Tiles Privacy" />
  <meta property="og:image" content={image.url} />
  <meta property="og:image:type" content={image.type} />
  <meta property="og:image:width" content={String(image.width)} />
  <meta property="og:image:height" content={String(image.height)} />
  <meta property="og:image:alt" content="Tiles" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Tiles" />
  <meta name="twitter:description" content={TILES_PRODUCT_DESCRIPTION} />
  <meta name="twitter:image" content={image.url} />
</svelte:head>

<PricingSuccessContent plan={data.plan} />
