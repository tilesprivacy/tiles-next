<script lang="ts">
  // Logo and banner previews shared by /brand and /press-kit. Each pairs a
  // light-surface and a dark-surface asset; CSS shows the one for the theme.
  let { outline = false }: { outline?: boolean } = $props()

  const bannerClass = "h-auto w-full object-contain [content-visibility:visible]"

  const banners = $derived([
    {
      light: { src: "/tiles_tlogo_banner_v1.2/svg/tiles_banner_fill_blk.svg", alt: "Tiles filled banner preview on light theme" },
      dark: { src: "/tiles_tlogo_banner_v1.2/svg/tiles_banner_fill_wht.svg", alt: "Tiles filled banner preview on dark theme" },
      caption: "Tiles filled banner treatment for light and dark surfaces.",
    },
    ...(outline
      ? [
          {
            light: { src: "/tiles_banner_outline_blk.svg", alt: "Tiles outline banner preview on light theme" },
            dark: { src: "/tiles_banner_outline_wht.svg", alt: "Tiles outline banner preview on dark theme" },
            caption: "Tiles outline banner treatment for light and dark surfaces.",
          },
        ]
      : []),
  ])
</script>

<div>
  <div class="flex justify-center">
    <img
      src="/lighticon.png"
      alt="Tiles logo preview on light theme"
      width="280"
      height="280"
      loading="lazy"
      decoding="async"
      class="h-[200px] w-[200px] object-contain [content-visibility:visible] dark:hidden md:h-[280px] md:w-[280px]"
    />
    <img
      src="/grey.png"
      alt="Tiles logo preview on dark theme"
      width="280"
      height="280"
      loading="lazy"
      decoding="async"
      class="hidden h-[200px] w-[200px] object-contain [content-visibility:visible] dark:block md:h-[280px] md:w-[280px]"
    />
  </div>
  <p class="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
    Tiles logo, including light and dark mark variants.
  </p>
</div>

{#each banners as banner (banner.caption)}
  <div>
    <div class="mx-auto flex w-full max-w-3xl justify-center">
      <img
        src={banner.light.src}
        alt={banner.light.alt}
        width="1200"
        height="220"
        loading="lazy"
        decoding="async"
        class={`${bannerClass} dark:hidden`}
      />
      <img
        src={banner.dark.src}
        alt={banner.dark.alt}
        width="1200"
        height="220"
        loading="lazy"
        decoding="async"
        class={`hidden ${bannerClass} dark:block`}
      />
    </div>
    <p class="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
      {banner.caption}
    </p>
  </div>
{/each}
