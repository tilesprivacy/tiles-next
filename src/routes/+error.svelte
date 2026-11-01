<script lang="ts">
  import { page } from "$app/state"
  import NotFoundContent from "#lib/components/NotFoundContent.svelte"
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import { absoluteUrl } from "#lib/absolute-url"
  import { marketingPageMetaClass, marketingPageTitleClass } from "#lib/marketing-page-title-classes"
  import { getSocialImageUrl } from "#lib/social-image"

  const notFound = $derived(page.status === 404)
  const title = $derived(notFound ? "Page not found | Tiles" : "Something went wrong | Tiles")
  const description = $derived(
    notFound ? "The page you requested could not be found." : "Something went wrong loading this page.",
  )
  const image = absoluteUrl(getSocialImageUrl())
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content="noindex, follow" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={title} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>

{#if notFound}
  <NotFoundContent />
{:else}
  <div class="relative flex min-h-screen flex-col bg-background">
    <main
      class="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]"
    >
      <div class="mx-auto w-full max-w-md text-center">
        <p class={`mb-3 tabular-nums ${marketingPageMetaClass}`}>{page.status}</p>
        <h1 class={marketingPageTitleClass}>Something went wrong</h1>
        <p class="mt-8">
          <a href="/" class="text-sm text-foreground underline-offset-4 transition-opacity hover:underline hover:opacity-80"
            >Back to home</a
          >
        </p>
      </div>
    </main>
    <SiteFooter showDownloadCta={false} />
  </div>
{/if}
