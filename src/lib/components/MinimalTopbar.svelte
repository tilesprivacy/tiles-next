<script lang="ts">
  import { page } from "$app/state"
  import DownloadTilesCta from "./DownloadTilesCta.svelte"
  import FaDiscord from "./icons/FaDiscord.svelte"
  import FaGithub from "./icons/FaGithub.svelte"
  import SiteSearch from "./SiteSearch.svelte"
  import ThemeSwitcher from "./ThemeSwitcher.svelte"
  import { SHOW_PRICING } from "#lib/feature-flags"

  let menuOpen = $state(false)

  // Sections with child pages stay highlighted on those pages too.
  const sectionRoots = new Set(["/book", "/plugins", "/blog", "/releases", "/help", "/pricing"])

  function isActive(href: string) {
    const pathname = page.url.pathname
    if (sectionRoots.has(href)) return pathname === href || pathname.startsWith(`${href}/`)
    return pathname === href
  }

  const centerLinks: ReadonlyArray<readonly [string, string]> = [
    ["/book", "Book"],
    ["/plugins", "Plugins"],
    ...(SHOW_PRICING ? [["/pricing", "Pricing"] as const] : []),
    ["/blog", "Blog"],
    ["/releases", "Releases"],
    ["/help", "Help"],
    ["/about", "About"],
    ["/sponsor", "Sponsor"],
  ]
</script>

<header class="minimal-topbar max-[767px]:gap-1" data-pagefind-ignore="all">
  <div class="minimal-topbar-left flex min-w-0 items-center gap-3 max-[520px]:gap-2">
    <a href="/" class="minimal-topbar-brand" aria-label="Tiles home">
      <span class="minimal-theme-logo">
        <img src="/lighticon-96.png" alt="" width="36" height="36" class="dark:hidden" loading="eager" decoding="async" />
        <img src="/grey-96.png" alt="" width="36" height="36" class="hidden dark:block" loading="eager" decoding="async" />
      </span>
      <span class="minimal-topbar-wordmark">
        <span>Tiles</span>
        <span class="minimal-topbar-alpha max-[428px]:hidden">alpha</span>
      </span>
    </a>
  </div>
  <nav class="minimal-topbar-center-nav" aria-label="Primary navigation">
    {#each centerLinks as [href, label] (href)}
      <a
        {href}
        class={isActive(href) ? "minimal-topbar-center-link is-active" : "minimal-topbar-center-link"}
        aria-current={isActive(href) ? "page" : undefined}>{label}</a
      >
    {/each}
  </nav>
  <nav class="minimal-topbar-actions max-[767px]:gap-1.5" aria-label="Site actions">
    <SiteSearch onOpenChange={(open) => open && (menuOpen = false)} />
    <a
      href="https://github.com/tilesprivacy/tiles"
      class="minimal-topbar-github"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"><FaGithub class="minimal-topbar-github-glyph" aria-hidden="true" /></a
    >
    <a
      href="https://discord.gg/PPSjcpZzvt"
      class="minimal-topbar-github"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discord"><FaDiscord class="minimal-topbar-github-glyph" aria-hidden="true" /></a
    >
    <div
      class="minimal-topbar-theme inline-flex h-9 w-9 shrink-0 items-center justify-center max-[767px]:h-8 max-[767px]:w-8"
    >
      <ThemeSwitcher />
    </div>
    <DownloadTilesCta size="nav" label="Download" ariaLabel="Download Tiles" className="minimal-topbar-download max-[767px]:hidden" />
    <button
      class="minimal-topbar-menu-button"
      type="button"
      aria-expanded={menuOpen}
      aria-controls="minimal-topbar-menu"
      aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
      onclick={() => (menuOpen = !menuOpen)}
    >
      {#if menuOpen}
        <span class="minimal-topbar-close-glyph" aria-hidden="true"><span></span><span></span></span>
      {:else}
        <span class="minimal-topbar-menu-glyph" aria-hidden="true"><span></span><span></span><span></span></span>
      {/if}
    </button>
  </nav>
  {#if menuOpen}
    <div id="minimal-topbar-menu" class="minimal-topbar-menu">
      <nav aria-label="Mobile navigation">
        {#each centerLinks as [href, label] (href)}
          <a {href} onclick={() => (menuOpen = false)}>{label}</a>
        {/each}
      </nav>
    </div>
  {/if}
</header>
