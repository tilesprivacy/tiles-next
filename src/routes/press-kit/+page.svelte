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
  import { ownYourAiTalkRecording } from "#lib/own-your-ai-talk"
  import { TILES_PRODUCT_DESCRIPTION } from "#lib/product-description"
  import { DISCORD_URL } from "#lib/community-links"

  const externalLinkClasses =
    "text-foreground underline decoration-current underline-offset-2 transition-colors hover:text-black/80 dark:hover:text-[#E6E6E6]"

  const factSheet = [
    { label: "Product", value: "Tiles" },
    { label: "Company", value: "Tiles Privacy Technologies Pvt. Ltd." },
    { label: "Headquarters", value: "Bengaluru, India" },
    { label: "Status", value: "Public alpha" },
    { label: "Platforms", value: "macOS 14+ on Apple Silicon and Linux" },
    { label: "Website", value: "https://tiles.run" },
  ]

  const siteLinks: Array<{ label: string; href: string; external?: boolean }> = [
    { label: "Website", href: "https://tiles.run", external: true },
    { label: "Download", href: "/download" },
    { label: "Blog", href: "/blog" },
    { label: "Documentation", href: "/book" },
    { label: "GitHub", href: "https://github.com/tilesprivacy", external: true },
    { label: "X (Twitter)", href: "https://x.com/tilesprivacy", external: true },
    { label: "Bluesky", href: "https://bsky.app/profile/tiles.run", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/tilesprivacy/", external: true },
    { label: "Discord", href: DISCORD_URL, external: true },
    { label: "Hugging Face", href: "https://huggingface.co/tilesprivacy", external: true },
  ]

  const companyDetails = [
    { label: "Legal name", value: "Tiles Privacy Technologies Pvt. Ltd." },
    { label: "Date of incorporation", value: "21 August 2026" },
    { label: "GSTIN", value: "29AANCT5152A1ZB" },
    { label: "PAN", value: "AANCT5152A" },
    { label: "CIN", value: "U58200KA2026PTC226312" },
    { label: "TAN", value: "BLRT28790G" },
    { label: "IEC", value: "AANCT5152A" },
  ]

  const screenshotFrame =
    "flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-sm border border-black/10 bg-black/[0.025] p-2 dark:border-white/10 dark:bg-white/[0.03]"
  const screenshotImg = "h-full w-full object-contain [content-visibility:visible]"

  // Each screenshot is one image, or a light/dark pair swapped by CSS.
  const screenshots: Array<{
    caption: string
    images: Array<{ src: string; alt: string; width: number; height: number; theme?: "light" | "dark" }>
  }> = [
    {
      caption: "Tiles App.",
      images: [{ src: "/tiles-app.png", alt: "Tiles desktop app ready to start a conversation", width: 2654, height: 1908 }],
    },
    {
      caption: "Menu bar app.",
      images: [
        {
          src: "/tiles-menubar-app-v2.png",
          alt: "Tiles menu bar app showing accounts, model, chats, and remote inference settings",
          width: 1103,
          height: 1426,
        },
      ],
    },
    {
      caption: "A conversation shared from Tiles as a public link on tiles.run.",
      images: [
        {
          src: "/lightshare.png",
          alt: "A conversation shared from Tiles as a public link on tiles.run, light theme",
          width: 3126,
          height: 2172,
          theme: "light",
        },
        {
          src: "/darkshare.png",
          alt: "A conversation shared from Tiles as a public link on tiles.run, dark theme",
          width: 3118,
          height: 2162,
          theme: "dark",
        },
      ],
    },
    {
      caption: "Onboarding flow for the Tiles CLI.",
      images: [
        { src: "/clilight.png", alt: "Tiles CLI onboarding screen in the terminal, light theme", width: 875, height: 1798, theme: "light" },
        { src: "/clidark.png", alt: "Tiles CLI onboarding screen in the terminal, dark theme", width: 780, height: 1864, theme: "dark" },
      ],
    },
  ]

  const themeClass = (theme?: "light" | "dark") =>
    theme === "light" ? `${screenshotImg} dark:hidden` : theme === "dark" ? `hidden ${screenshotImg} dark:block` : screenshotImg
</script>

<PageHeadMeta
  title="Press Kit | Tiles"
  description="Editorial summary, brand files, screenshots, company details, and contact details for writing about Tiles."
  imageTitle="Press Kit"
/>

<div class="relative flex min-h-screen flex-col overflow-x-clip bg-background text-foreground lg:overflow-visible">
  <main class="flex flex-1 flex-col overflow-x-clip pt-[calc(7rem+env(safe-area-inset-top,0px))] lg:pt-[calc(7.5rem+env(safe-area-inset-top,0px))]">
    <section class="mx-auto w-full max-w-4xl overflow-x-clip px-6 pb-16 pt-8 lg:pb-24">
      <h1 class={`max-w-[22ch] ${marketingPageTitleClass}`}>
        Tiles press kit
      </h1>
      <p class="mt-4 max-w-2xl text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        Everything you need to write about Tiles: product background, team photo, screenshots, brand files,
        company details, and contact information.
      </p>

      <h2 id="product" class={`mt-16 ${marketingPageSectionTitleClass}`}>Product</h2>
      <div class="mt-4 max-w-2xl space-y-4 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        <p class="text-black/80 dark:text-[#D0D0D3]">{TILES_PRODUCT_DESCRIPTION}</p>
        <p>
          Tiles runs open models on your own device, so your conversations and data stay with you. Peer-to-peer
          encrypted sync connects your devices without a central server, and social features are built on the AT
          Protocol. Identity is user-owned through locally generated DIDs and UCANs, so your data and identity
          remain yours.
        </p>
        <p>
          Tiles is in public alpha for macOS and Linux. It is built by Tiles Privacy Technologies Pvt. Ltd., an
          independent team based in Bengaluru, India.
        </p>
      </div>

      <dl class="mt-8 max-w-2xl divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
        {#each factSheet as fact (fact.label)}
          <div class="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
            <dt class="w-36 shrink-0 text-sm font-medium leading-[1.7] text-foreground">{fact.label}</dt>
            <dd class="text-sm leading-[1.7] text-black/65 dark:text-[#B3B3B3]">{fact.value}</dd>
          </div>
        {/each}
      </dl>

      <h3 class={`mt-10 ${marketingPageSubsectionTitleClass}`}>Background talk</h3>
      <p class="mt-3 max-w-2xl text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        For the story behind Tiles, watch
        <a href={ownYourAiTalkRecording.watchUrl} target="_blank" rel="noopener noreferrer" class={externalLinkClasses}
          >Own your AI with local models and open protocols</a
        >, a talk given at Local-First Conf 2026 in Berlin, or read the
        <a href="/blog/own-your-ai" class={externalLinkClasses}>adapted blog post</a>.
      </p>

      <h2 id="team-photo" class={`mt-16 ${marketingPageSectionTitleClass}`}>Team photo</h2>
      <figure class="mt-6">
        <img
          src="/team.webp"
          alt="The five members of the Tiles Privacy team standing together outdoors."
          width="1600"
          height="1200"
          loading="lazy"
          decoding="async"
          class="h-auto w-full rounded-xl"
        />
        <figcaption class="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm leading-snug text-black/55 dark:text-[#929292]">
          <span>The Tiles Privacy team.</span>
          <a href="/team.webp" download="tiles-privacy-team.webp" class={externalLinkClasses}>Download team photo</a>
        </figcaption>
      </figure>

      <h2 id="screenshots" class={`mt-16 ${marketingPageSectionTitleClass}`}>Screenshots</h2>
      <p class="mt-4 max-w-2xl text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        Current product screenshots for use in articles and coverage of Tiles.
      </p>

      <div class="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2">
        {#each screenshots as shot (shot.caption)}
          <div>
            <div class="flex w-full">
              <div class={screenshotFrame}>
                {#each shot.images as image (image.src)}
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    class={themeClass(image.theme)}
                  />
                {/each}
              </div>
            </div>
            <p class="mt-3 text-sm leading-snug text-black/55 dark:text-[#929292]">
              {shot.caption}
            </p>
          </div>
        {/each}
      </div>

      <h2 id="brand-files" class={`mt-16 ${marketingPageSectionTitleClass}`}>Brand files</h2>
      <BrandAssetsButton marginClass="mt-6" />
      <div class="mt-6 max-w-2xl space-y-2 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        <p>
          <strong class="font-semibold text-foreground">Logos</strong> are available as icon mark and logo
          variants, in light and dark versions.
        </p>
        <p>
          <strong class="font-semibold text-foreground">Banners</strong> are available as outline and full
          banner treatments for both light and dark surfaces.
        </p>
        <p>
          Refer to us as <strong class="font-semibold text-foreground">Tiles Privacy</strong>. Not Tiles
          Assistant or Tiles AI. See the
          <a href="/brand" class={externalLinkClasses}>full brand guidelines</a>
          for details.
        </p>
      </div>

      <div class="mt-10 space-y-10">
        <BrandPreviews />
      </div>

      <DarkshapesCredit marginClass="mt-8" />

      <h2 id="company-details" class={`mt-16 ${marketingPageSectionTitleClass}`}>Company details</h2>
      <dl class="mt-4 max-w-2xl divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
        {#each companyDetails as detail (detail.label)}
          <div class="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
            <dt class="w-36 shrink-0 text-sm font-medium leading-[1.7] text-foreground">{detail.label}</dt>
            <dd class="text-sm leading-[1.7] text-black/65 dark:text-[#B3B3B3]">{detail.value}</dd>
          </div>
        {/each}
      </dl>

      <h2 id="contact" class={`mt-16 ${marketingPageSectionTitleClass}`}>Contact</h2>
      <div class="mt-4 max-w-2xl space-y-2 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        <p>
          <span class="font-medium text-foreground">Press and general inquiries:</span>
          <a href="mailto:hello@tiles.run" class={externalLinkClasses}>hello@tiles.run</a>
        </p>
        <p>
          <span class="font-medium text-foreground">Phone:</span>
          <a href="tel:+917338014129" class={externalLinkClasses}>+91 7338014129</a>
        </p>
        <address class="not-italic">
          <span class="font-medium text-foreground">Address:</span> WeWork Prestige Atlanta, 80 Feet Rd,
          Koramangala, Bengaluru, IN 560034
        </address>
      </div>

      <h2 id="links-and-contact" class={`mt-16 ${marketingPageSectionTitleClass}`}>Links</h2>
      <ul class="mt-4 max-w-2xl space-y-2 text-base leading-[1.7] text-black/65 dark:text-[#B3B3B3]">
        {#each siteLinks as link (link.label)}
          <li>
            <span class="font-medium text-foreground">{link.label}:</span>
            {#if link.external}
              <a href={link.href} target="_blank" rel="noopener noreferrer" class={externalLinkClasses}>{link.href}</a>
            {:else}
              <a href={link.href} class={externalLinkClasses}>{`https://tiles.run${link.href}`}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  </main>

  <SiteFooter />
</div>
