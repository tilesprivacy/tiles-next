<script lang="ts">
  import "../fonts.css"
  import "../app.css"
  import { page } from "$app/state"
  import { pageThemeFor } from "#lib/page-theme"
  import { theme } from "#lib/theme.svelte"

  let { children } = $props()

  $effect(() => {
    theme.init()
  })

  // The server sets data-page-theme on first load; keep it right on client navigation.
  $effect(() => {
    const value = pageThemeFor(page.url.pathname)
    if (value) document.documentElement.dataset.pageTheme = value
    else delete document.documentElement.dataset.pageTheme
  })
</script>

{@render children()}
