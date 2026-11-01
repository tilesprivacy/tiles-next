<script lang="ts">
  import SiteFooter from "./SiteFooter.svelte"
  import { marketingPageMetaClass, marketingPageTitleClass } from "#lib/marketing-page-title-classes"

  /** `book`: the book layout already renders its own footer. */
  let { variant = "default" }: { variant?: "default" | "book" } = $props()

  const isBook = $derived(variant === "book")
</script>

{#snippet main()}
  <main
    class={isBook
      ? "flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20"
      : "flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:pt-[calc(11.5rem+env(safe-area-inset-top,0px))]"}
  >
    <div class="mx-auto w-full max-w-md text-center">
      <p class={`mb-3 tabular-nums ${marketingPageMetaClass}`}>404</p>
      <h1 class={marketingPageTitleClass}>Page not found</h1>
      <p class="mt-8">
        <a href="/" class="text-sm text-foreground underline-offset-4 transition-opacity hover:underline hover:opacity-80"
          >Back to home</a
        >
      </p>
    </div>
  </main>
{/snippet}

{#if isBook}
  {@render main()}
{:else}
  <div class="relative flex min-h-screen flex-col bg-background">
    {@render main()}
    <SiteFooter showDownloadCta={false} />
  </div>
{/if}
