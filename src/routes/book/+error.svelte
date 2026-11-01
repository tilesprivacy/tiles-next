<script lang="ts">
  import NotFoundContent from "#lib/components/NotFoundContent.svelte"
  import BookMobileBar from "#lib/components/book/BookMobileBar.svelte"
</script>

<svelte:head>
  <title>Tiles Book: Technical documentation for Tiles and Tilekit</title>
  <meta
    name="description"
    content="Technical documentation covering the models, infrastructure, and cryptography behind Tiles, the consumer product, and Tilekit, the developer-facing SDK written in Rust."
  />
  <meta name="robots" content="noindex" />
</svelte:head>

<BookMobileBar slug={null} />
<NotFoundContent variant="book" />
