<script lang="ts">
  import StandardSiteLinkTags from "#lib/components/StandardSiteLinkTags.svelte"

  let { children } = $props()
</script>

<StandardSiteLinkTags />
{@render children()}
