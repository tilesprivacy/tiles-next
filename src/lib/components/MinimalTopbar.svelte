<script lang="ts">
  import { page } from "$app/state"
  import DownloadTilesCta from "./DownloadTilesCta.svelte"
  import TilesSocialLinks from "./TilesSocialLinks.svelte"
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
    <div class="minimal-topbar-social" role="group" aria-label="Social links">
      <TilesSocialLinks includeGithub />
    </div>
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
      <div class="minimal-topbar-menu-social" role="group" aria-label="Social links">
        <TilesSocialLinks includeGithub onclick={() => (menuOpen = false)} />
      </div>
    </div>
  {/if}
</header>

<style>
  /* Keep the full social row clear of the page links as the header narrows. */
  header.minimal-topbar nav.minimal-topbar-center-nav {
    position: static;
    transform: none;
    flex: 1;
    justify-content: center;
    gap: clamp(0.875rem, 1.25vw, 1.5rem);
  }

  header.minimal-topbar nav.minimal-topbar-actions {
    flex: none;
    gap: 0.75rem;
  }

  .minimal-topbar-social {
    display: flex;
    flex: none;
    align-items: center;
  }

  .minimal-topbar-social :global(a),
  .minimal-topbar-menu-social :global(a) {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: var(--muted-foreground);
    transition: background-color 160ms ease, color 160ms ease;
  }

  .minimal-topbar-social :global(a) {
    width: 28px;
    height: 36px;
  }

  .minimal-topbar-social :global(svg),
  .minimal-topbar-menu-social :global(svg) {
    width: 16px;
    height: 16px;
  }

  .minimal-topbar-social :global(a:hover),
  .minimal-topbar-menu-social :global(a:hover) {
    background: var(--muted);
    color: var(--foreground);
  }

  .minimal-topbar-social :global(a:focus-visible),
  .minimal-topbar-menu-social :global(a:focus-visible) {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .minimal-topbar-menu-social {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    margin-top: 2rem;
  }

  .minimal-topbar-menu-social :global(a) {
    width: 44px;
    height: 44px;
  }

  @media (min-width: 1200px) and (max-width: 1439px) {
    header.minimal-topbar :global(.site-search-trigger) {
      width: 36px;
      gap: 0;
      padding: 0;
    }

    header.minimal-topbar :global(.site-search-trigger-kbd) {
      display: none;
    }
  }

  @media (max-width: 1199px) {
    .minimal-topbar-social {
      display: none;
    }
  }

  @media (max-width: 767px) {
    header.minimal-topbar nav.minimal-topbar-actions {
      gap: 0.5rem;
    }
  }

  @media (max-width: 382px) {
    header.minimal-topbar nav.minimal-topbar-actions {
      gap: 0.25rem;
    }
  }
</style>
