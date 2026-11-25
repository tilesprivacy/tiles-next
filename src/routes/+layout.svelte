<script lang="ts">
  import "../fonts.css"
  import "../app.css"
  import { onMount } from "svelte"
  import { page } from "$app/state"
  import ScrollAtTopMarker from "#lib/components/ScrollAtTopMarker.svelte"
  import SiteHeader from "#lib/components/SiteHeader.svelte"
  import ThemeFavicon from "#lib/components/ThemeFavicon.svelte"
  import { isChatRoute } from "#lib/chat/links"
  import { preview } from "#lib/deployment"
  import { pageThemeFor } from "#lib/page-theme"
  import { theme } from "#lib/theme.svelte"

  let { children } = $props()

  $effect(() => {
    theme.init()
  })

  // The shared-chat viewer (chat.tiles.run) has its own chrome.
  const chat = $derived(isChatRoute(page.route.id))

  // The server sets data-page-theme on first load; keep it right on client navigation.
  $effect(() => {
    const value = pageThemeFor(page.url.pathname, page.route.id)
    if (value) document.documentElement.dataset.pageTheme = value
    else delete document.documentElement.dataset.pageTheme
  })

  // The offline cache is for the site, not the chat viewer or previews (where
  // it would keep showing an old build). Older visits may still have the
  // previous site's workers and caches; clear those out once.
  onMount(() => {
    if (!("serviceWorker" in navigator)) return
    if (!chat && !preview) navigator.serviceWorker.register("/service-worker.js", { type: "module" }).catch(() => {})
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) =>
        Promise.all(
          registrations
            .filter((registration) => {
              const url =
                registration.active?.scriptURL ??
                registration.waiting?.scriptURL ??
                registration.installing?.scriptURL ??
                ""
              return url.endsWith("/site-sw.js") || url.endsWith("/book-sw.js")
            })
            .map((registration) => registration.unregister()),
        ),
      )
      .catch(() => {})
  })
</script>

<svelte:head>
  <meta name="generator" content="v0.app" />
</svelte:head>

<ThemeFavicon />
{#if !chat}
  <ScrollAtTopMarker />
  <SiteHeader />
{/if}
{@render children()}
