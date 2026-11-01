<script lang="ts">
  import { ArrowUpRight } from "@lucide/svelte"
  import SiteFooter from "./SiteFooter.svelte"
  import { marketingPageBodyClass, marketingPageTitleClass } from "#lib/marketing-page-title-classes"
  import { PRICING_SUCCESS, type PricingSuccessPlanId } from "#lib/pricing-plans"

  let { plan }: { plan: PricingSuccessPlanId } = $props()

  const copy = $derived(PRICING_SUCCESS[plan])

  const mutedTextClass = "text-black/62 dark:text-white/62"
  const linkClass =
    "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"
</script>

<div class="relative flex min-h-[100dvh] flex-col bg-background">
  <main
    class="flex flex-1 flex-col px-4 pb-24 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-32 lg:pt-[calc(12.5rem+env(safe-area-inset-top,0px))]"
  >
    <div class="mx-auto w-full max-w-2xl">
      <header class="mx-auto max-w-xl text-center">
        <h1 class={marketingPageTitleClass}>{copy.title}</h1>
        <p class={`mt-6 ${marketingPageBodyClass}`}>{copy.description}</p>
      </header>

      <ol class="mt-16 flex flex-col gap-10 lg:mt-20">
        {#each copy.steps as step, index (step.title)}
          <li class="flex gap-5">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/12 text-xs font-medium text-foreground dark:border-white/15"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div class="min-w-0">
              <h2 class="font-sans text-base font-semibold tracking-[-0.01em] text-foreground">{step.title}</h2>
              <p class={`mt-2 text-pretty text-sm leading-6 ${mutedTextClass}`}>{step.body}</p>
              {#if step.link}
                <a
                  href={step.link.href}
                  target={step.link.external ? "_blank" : undefined}
                  rel={step.link.external ? "noopener noreferrer" : undefined}
                  class={linkClass}
                >
                  {step.link.label}
                  <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              {/if}
            </div>
          </li>
        {/each}
      </ol>

      <p class={`mt-16 border-t border-black/8 pt-8 text-sm leading-6 dark:border-white/10 ${mutedTextClass}`}>
        {copy.footnote}
      </p>
    </div>
  </main>

  <SiteFooter />
</div>
