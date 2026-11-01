<script lang="ts">
  import BrandAssetsButton from "#lib/components/BrandAssetsButton.svelte"
  import BrandPreviews from "#lib/components/BrandPreviews.svelte"
  import DarkshapesCredit from "#lib/components/DarkshapesCredit.svelte"
  import PageHeadMeta from "#lib/components/PageHeadMeta.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import {
    marketingPageSectionTitleClass,
    marketingPageSubsectionTitleClass,
    marketingPageTitleClass,
  } from "#lib/marketing-page-title-classes"
</script>

<PageHeadMeta
  title="Brand | Tiles"
  description="Resources to represent Tiles consistently and accurately."
  imageTitle="Brand"
/>

<div class="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground lg:overflow-visible">
  <main class="flex flex-1 flex-col overflow-x-clip pt-[calc(7rem+env(safe-area-inset-top,0px))] lg:pt-[calc(7.5rem+env(safe-area-inset-top,0px))]">
    <section class="mx-auto w-full max-w-4xl overflow-x-clip px-6 pb-16 pt-8 lg:pb-24">
      <h1 class={`max-w-[22ch] ${marketingPageTitleClass}`}>
        Tiles brand guidelines
      </h1>
      <p class="mt-4 max-w-2xl text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        Resources to represent Tiles consistently and accurately.
      </p>
      <BrandAssetsButton marginClass="mt-8" />
      <DarkshapesCredit marginClass="mt-6" />

      <h2 class={`mt-16 ${marketingPageSectionTitleClass}`}>Brand assets</h2>
      <div class="mt-4 max-w-3xl space-y-2 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        <p>
          <strong class="font-semibold text-foreground">Logos</strong> are available as icon mark and logo
          variants, in light and dark versions.
        </p>
        <p>
          <strong class="font-semibold text-foreground">Banners</strong> are available as outline and full
          banner treatments for both light and dark surfaces.
        </p>
        <p>
          <strong class="font-semibold text-foreground">Wallpaper</strong> is available as a desktop
          background.
        </p>
      </div>

      <div class="mt-10 space-y-10">
        <BrandPreviews outline />

        <div>
          <h3 class={marketingPageSubsectionTitleClass}>Wallpaper</h3>
          <div class="mx-auto mt-4 flex w-full max-w-3xl justify-center">
            <div class="w-full overflow-hidden rounded-sm border border-black/10 dark:border-white/10">
              <img
                src="/wallpaper.png"
                alt="Tiles wallpaper preview"
                width="1362"
                height="1082"
                loading="lazy"
                decoding="async"
                class="mx-auto h-auto w-full object-contain [content-visibility:visible]"
              />
            </div>
          </div>
          <p class="mt-3 text-center text-xs leading-relaxed text-black/50 dark:text-[#8A8A8A]">
            Cyberpunk themed Tiles wallpaper.
          </p>
        </div>
      </div>

      <h2 class={`mt-14 ${marketingPageSectionTitleClass}`}>Name</h2>
      <p class="mt-4 text-base leading-[1.7] text-black/80 dark:text-[#D0D0D3]">
        Refer to us as Tiles Privacy. Not Tiles Assistant or Tiles AI .
      </p>
    </section>
  </main>

  <SiteFooter />
</div>
