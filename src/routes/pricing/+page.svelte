<script lang="ts">
  import PricingContent from "#lib/components/PricingContent.svelte"
  import { PRICING_PAGE_DESCRIPTION } from "#lib/pricing-plans"
  import { getPricingSocialImageUrl } from "#lib/social-image"

  let { data } = $props()

  const title = "Pricing | Tiles"
  const canonicalUrl = "https://www.tiles.run/pricing"
  // The plans render into this card, so it stays in step with the page.
  const socialImageUrl = getPricingSocialImageUrl()
  const socialImageAlt = "Tiles pricing: Free, Plus, and Pro"
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={PRICING_PAGE_DESCRIPTION} />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={PRICING_PAGE_DESCRIPTION} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="Tiles Privacy" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content={socialImageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:alt" content={socialImageAlt} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@tilesprivacy" />
  <meta name="twitter:creator" content="@tilesprivacy" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={PRICING_PAGE_DESCRIPTION} />
  <meta name="twitter:image" content={socialImageUrl} />
  <meta name="twitter:image:alt" content={socialImageAlt} />
</svelte:head>

<PricingContent checkoutModes={data.checkoutModes} />
