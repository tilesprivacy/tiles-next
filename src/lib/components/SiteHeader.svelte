<script lang="ts">
  import { page } from "$app/state"
  import MinimalTopbar from "./MinimalTopbar.svelte"

  // These pages render their own topbar inside the page content.
  const pagesWithOwnTopbar = new Set(["/", "/download", "/about", "/sponsor"])
</script>

{#if !pagesWithOwnTopbar.has(page.url.pathname)}
  <MinimalTopbar />
{/if}
