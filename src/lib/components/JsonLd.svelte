<script lang="ts">
  // Structured data for search engines. It is data, not script, so the CSP
  // leaves it alone; escaping "<" stops the content from closing the tag.
  let { data }: { data: Record<string, unknown> } = $props()

  const tag = $derived(
    `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</` + `script>`,
  )
</script>

<svelte:head>
  {@html tag}
</svelte:head>
