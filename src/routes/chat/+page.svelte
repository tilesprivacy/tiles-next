<script lang="ts">
  import FaBluesky from "#lib/components/icons/FaBluesky.svelte"
  import FaDiscord from "#lib/components/icons/FaDiscord.svelte"
  import FaGithub from "#lib/components/icons/FaGithub.svelte"
  import FaXTwitter from "#lib/components/icons/FaXTwitter.svelte"
  import SiHuggingface from "#lib/components/icons/SiHuggingface.svelte"
  import TangledIcon from "#lib/components/TangledIcon.svelte"
  import { SITE_ORIGIN } from "#lib/absolute-url"

  const bannerAlt = "@tmopsheric — Atmospheric sessions wordmark floating above the clouds"

  const socialLinks = [
    { href: "https://x.com/tilesprivacy", label: "X (Twitter)", Icon: FaXTwitter },
    { href: "https://bsky.app/profile/tiles.run", label: "Bluesky", Icon: FaBluesky },
    { href: "https://go.tiles.run/discord", label: "Discord", Icon: FaDiscord },
    { href: "https://github.com/tilesprivacy", label: "GitHub", Icon: FaGithub },
    { href: "https://tangled.org/tiles.run", label: "Tangled", Icon: TangledIcon },
    { href: "https://huggingface.co/tilesprivacy", label: "Hugging Face", Icon: SiHuggingface },
  ]
</script>

<svelte:head>
  <title>Tiles Share | Shared chat links</title>
  <meta name="description" content="View and share Tiles chat sessions through AT Protocol-backed public and private links." />
</svelte:head>

<main class="relative h-dvh w-full overflow-hidden bg-[#bdd8f3]">
  <!-- The same image, blurred, fills whatever the sharp copy doesn't cover. -->
  <img src="/atmospheric-banner.webp" alt="" width="1536" height="1024" class="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl" />

  <!-- Portrait: the whole banner, centred, its edges fading into the blur. -->
  <div class="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 portrait:block">
    <img
      src="/atmospheric-banner.webp"
      alt={bannerAlt}
      width="1536"
      height="1024"
      class="h-auto w-full [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
    />
  </div>

  <!-- Landscape: full-bleed cover, never cropped past the wordmark. -->
  <img src="/atmospheric-banner.webp" alt={bannerAlt} width="1536" height="1024" class="absolute inset-0 hidden h-full w-full object-cover landscape:block" />

  <header class="absolute inset-x-0 top-0 z-10 px-5 pt-5 md:px-6 md:pt-6">
    <a href={SITE_ORIGIN} aria-label="Tiles home" class="inline-flex items-center gap-1.5 text-base font-bold text-black">
      <img src="/lighticon-96.png" alt="" width="24" height="24" />
      <span>Tiles</span>
    </a>
  </header>

  <!-- Below the wordmark baked into the art at every size: 62% down on tall
       screens, further once the cover-scaled art outgrows the viewport height. -->
  <div class="absolute inset-x-0 top-[max(62%,50%_+_6.7vw)] flex justify-center px-6">
    <a
      href="{SITE_ORIGIN}/blog/atmospheric-sessions"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block px-3 py-2.5 text-center text-sm font-semibold text-black underline decoration-transparent underline-offset-4 transition hover:decoration-current sm:px-5 sm:text-base"
      >Learn more about Atmospheric sessions&nbsp;↗</a
    >
  </div>

  <footer
    class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-white/70 via-white/35 to-transparent px-5 pb-6 pt-10 text-sm leading-[21px] text-black md:px-6 md:pb-4"
  >
    <div class="relative mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
      <div class="flex flex-col gap-2">
        <p>© 2026 Tiles Privacy Technologies Pvt. Ltd.</p>
        <address class="text-xs not-italic leading-normal text-black/60 md:absolute md:bottom-0 md:left-0 md:text-left">
          WeWork Prestige Atlanta, 80 Feet Rd<br />Koramangala<br />Bengaluru, IN 560034
        </address>
      </div>
      <nav aria-label="Social links" class="flex flex-wrap items-center justify-center gap-1 text-black/60 md:absolute md:bottom-0 md:right-0">
        {#each socialLinks as { href, label, Icon } (label)}
          <a
            {href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            class="flex size-11 items-center justify-center rounded-md transition hover:bg-black/5 hover:text-black active:scale-95"
          >
            <Icon aria-hidden="true" class="size-4" />
          </a>
        {/each}
      </nav>
    </div>
  </footer>
</main>
