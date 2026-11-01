<script lang="ts">
  import { Check } from "@lucide/svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import { INDIAFOSS_GIVEAWAY_PATH } from "#lib/indiafoss-giveaway"

  const title = "IndiaFOSS 2026 ticket and travel grant giveaway"
  const description = "Applications are closed because all 10 IndiaFOSS 2026 giveaway slots have been booked."
  const pageUrl = `https://www.tiles.run${INDIAFOSS_GIVEAWAY_PATH}`
  const ogImage = "https://www.tiles.run/indiafoss-2026-giveaway-og.png"
  const linkClass = "underline underline-offset-4"
</script>

<svelte:head>
  <title>{title} | Tiles</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Tiles, Solstone, IndiaFOSS 2026, and OSDC giveaway" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
</svelte:head>

{#snippet requirementCheck()}
  <Check class="mt-1 h-4 w-4 shrink-0 text-black dark:text-[#f7ff61]" aria-hidden="true" />
{/snippet}

<div class="minimal-product-page">
  <main
    class="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-[calc(var(--site-announcement-height)+7rem)] sm:px-8 sm:pb-32 lg:px-10 lg:pt-[calc(var(--site-announcement-height)+9rem)]"
  >
    <div class="grid items-start gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16">
      <aside class="lg:sticky lg:top-32">
        <div
          class="relative aspect-[4/5] overflow-hidden rounded-xl border border-black/10 bg-black dark:border-white/10"
        >
          <img
            src="/indiafoss-2026-giveaway.webp"
            srcset="/indiafoss-2026-giveaway-640.webp 640w, /indiafoss-2026-giveaway.webp 1080w"
            width="1080"
            height="1350"
            alt="Tiles, Solstone, IndiaFOSS 2026, and OSDC"
            fetchpriority="high"
            loading="eager"
            decoding="async"
            sizes="(min-width: 1024px) 42vw, 100vw"
            class="object-contain"
            style="position:absolute;height:100%;width:100%;inset:0;color:transparent"
          />
        </div>
      </aside>

      <article>
        <p class="text-sm font-medium text-black dark:text-[#f7ff61]">Tiles × Solstone × IndiaFOSS 2026</p>
        <h1 class="mt-4 max-w-2xl text-4xl font-semibold leading-[1.06] tracking-[-0.045em] sm:text-5xl">
          IndiaFOSS 2026 ticket and travel grant giveaway
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          The giveaway offers 10 spots for OSDC members. Five include an <a
            href="https://fossunited.org/indiafoss/2026"
            target="_blank"
            rel="noopener noreferrer"
            class={linkClass}>IndiaFOSS</a
          > ticket and a $100 travel grant, while the other five include a conference ticket. All 10 also include swag.
        </p>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          <a href="https://osdc.dev" target="_blank" rel="noopener noreferrer" class={linkClass}>OSDC</a> is a student-run
          open-source club based at JIIT in Noida.
        </p>
        <p class="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">
          Swag includes three T-shirts, one each from Tiles, Solstone, and IndiaFOSS, plus additional stickers. Conference
          ticket codes and flight tickets will be sent to selected recipients by email. The T-shirts and additional swag
          will be provided at the venue.
        </p>

        <section
          class="mt-10 rounded-2xl border border-black/10 bg-black/[0.025] p-5 dark:border-white/10 dark:bg-white/[0.025] sm:p-6"
          aria-labelledby="requirements-heading"
        >
          <h2 id="requirements-heading" class="text-lg font-semibold tracking-[-0.02em]">Giveaway requirements</h2>
          <ul class="mt-4 space-y-3">
            <li class="flex gap-3 text-sm leading-6 text-muted-foreground">
              {@render requirementCheck()}
              <span>
                Be a member of <a href="https://osdc.dev" target="_blank" rel="noopener noreferrer" class={linkClass}
                  >OSDC</a
                >.
              </span>
            </li>
            <li class="flex gap-3 text-sm leading-6 text-muted-foreground">
              {@render requirementCheck()}
              <span>
                Download and install the <a href="/download" class={linkClass}>Tiles Canary version</a> on your device.
              </span>
            </li>
            <li class="flex gap-3 text-sm leading-6 text-muted-foreground">
              {@render requirementCheck()}
              <span>
                Use the <a href="https://solstone.app/install" target="_blank" rel="noopener noreferrer" class={linkClass}
                  >Solstone download page</a
                > to install both journal and the menu bar app on your devices.
              </span>
            </li>
          </ul>
        </section>

        <div class="mt-12 border-t border-black/10 pt-10 dark:border-white/10">
          <section
            class="rounded-2xl border border-black/10 bg-black/[0.025] p-6 dark:border-white/10 dark:bg-white/[0.035] sm:p-8"
            aria-labelledby="applications-closed-heading"
            role="status"
          >
            <h2 id="applications-closed-heading" class="text-2xl font-semibold tracking-[-0.03em]">
              Applications are closed
            </h2>
            <p class="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              All giveaway slots have been booked, so the application form is no longer accepting entries.
            </p>
          </section>
        </div>

        <p class="mt-8 text-xs leading-5 text-muted-foreground">
          Entries were limited to one per person and reviewed by the organizers. Selected applicants may be asked to verify
          eligibility.
        </p>
      </article>
    </div>
  </main>
  <SiteFooter showDownloadCta={false} />
</div>
