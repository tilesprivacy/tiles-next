<script lang="ts">
  import "#lib/components/chat/chat.css"

  let { children } = $props()
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

{@render children()}
