<script lang="ts">
  import SiteFooter from "#lib/components/SiteFooter.svelte"
  import { themeAwareHeaderPrimaryCtaClasses } from "#lib/header-primary-cta-classes"
  import { marketingPageBodyClass, marketingPageTitleClass } from "#lib/marketing-page-title-classes"

  let { data, form } = $props()

  const state = $derived(form?.state ?? (data.token ? "confirm" : "expired"))

  const copy = {
    confirm: {
      title: "Confirm your subscription",
      body: "One click and you'll start getting product notes, privacy research, release updates, and engineering notes from the Tiles team.",
    },
    subscribed: {
      title: "You're subscribed",
      body: "Thanks for joining. Look out for the next update from the Tiles team in your inbox.",
    },
    expired: {
      title: "This link has expired",
      body: "Confirmation links work for 7 days. Sign up again with the form at the bottom of any page and we'll send you a new one.",
    },
    error: {
      title: "Something went wrong",
      body: "We couldn't confirm your subscription just now. Please try again in a moment.",
    },
  } as const

  const linkClass =
    "text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"
</script>

<svelte:head>
  <title>Newsletter | Tiles</title>
  <meta name="description" content="Confirm your subscription to the Tiles newsletter." />
  <!-- Personal confirmation links, not a page for search. -->
  <meta name="robots" content="noindex, nofollow" />
  <meta name="referrer" content="no-referrer" />
</svelte:head>

<div class="relative flex min-h-[100dvh] flex-col bg-background">
  <main
    class="flex flex-1 flex-col px-4 pb-24 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-32 lg:pt-[calc(12.5rem+env(safe-area-inset-top,0px))]"
  >
    <div class="mx-auto w-full max-w-xl text-center">
      <h1 class={marketingPageTitleClass}>{copy[state].title}</h1>
      <p class={`mt-6 ${marketingPageBodyClass}`}>{copy[state].body}</p>

      <div class="mt-10 flex justify-center">
        {#if (state === "confirm" || state === "error") && data.token}
          <form method="POST">
            <input type="hidden" name="token" value={data.token} />
            <button type="submit" class={`minimal-primary-button ${themeAwareHeaderPrimaryCtaClasses}`}>
              Confirm subscription
            </button>
          </form>
        {:else}
          <a href="/" class={linkClass}>Back to home</a>
        {/if}
      </div>
    </div>
  </main>

  <SiteFooter />
</div>
