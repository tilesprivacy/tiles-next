<script lang="ts">
  import HomeContent from "#lib/components/HomeContent.svelte"
  import CanonicalMeta from "#lib/components/CanonicalMeta.svelte"
  import { absoluteUrl } from "#lib/absolute-url"
  import { TILES_HOMEPAGE_DESCRIPTION, TILES_SITE_TITLE, TILES_SOCIAL_TITLE } from "#lib/product-description"
  import { getSocialImageUrl } from "#lib/social-image"

  const image = absoluteUrl(getSocialImageUrl())
</script>

<CanonicalMeta path="/" />

<svelte:head>
  <title>{TILES_SITE_TITLE}</title>
  <meta name="description" content={TILES_HOMEPAGE_DESCRIPTION} />
  <meta property="og:title" content={TILES_SOCIAL_TITLE} />
  <meta property="og:description" content={TILES_HOMEPAGE_DESCRIPTION} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={TILES_SOCIAL_TITLE} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={TILES_SOCIAL_TITLE} />
  <meta name="twitter:description" content={TILES_HOMEPAGE_DESCRIPTION} />
  <meta name="twitter:image" content={image} />
</svelte:head>

<HomeContent />
