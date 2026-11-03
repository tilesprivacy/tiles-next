<script lang="ts">
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"
  import AboutContent from "#lib/components/AboutContent.svelte"

  const description = "Learn about Tiles Privacy, our mission, and the team and advisors behind it."
</script>

<PageHeadMeta title="About | Tiles" {description} imageTitle="About" canonical="/about" ogUrl="/about" />

<AboutContent />
