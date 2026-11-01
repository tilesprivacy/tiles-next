<script lang="ts">
  import { ArrowUpRight, Check, ChevronDown, ChevronRight, Gem, Sparkle } from "@lucide/svelte"
  import PolarSubscribeButton from "./PolarSubscribeButton.svelte"
  import SiteFooter from "./SiteFooter.svelte"
  import {
    marketingPageSectionTitleClass,
    marketingPageTitleClass,
  } from "#lib/marketing-page-title-classes"
  import {
    PRICING_FAQS,
    PRICING_PAGE_EARLY_MEMBER_NOTE,
    PRICING_PAGE_TITLE,
    PRICING_PLANS,
    type PolarCheckoutMode,
    type PolarPaidPlanId,
  } from "#lib/pricing-plans"

  let { checkoutModes }: { checkoutModes: Record<PolarPaidPlanId, PolarCheckoutMode> } = $props()

  // Contrast was measured on the light theme (the worse of the two): secondary
  // 7.7:1, tertiary 4.7:1, icons 3.3:1. Re-measure before dimming any of them.
  const secondaryTextClass = "text-black/68 dark:text-white/68"
  const tertiaryTextClass = "text-black/55 dark:text-white/55"
  const mutedIconClass = "text-black/45 dark:text-white/45"

  const ctaBaseClass =
    "inline-flex h-9 w-full items-center justify-center gap-1 whitespace-nowrap rounded-full px-3 text-xs font-medium sm:h-11 sm:px-5 sm:text-sm leading-none !no-underline transition-colors"
  const outlinedCtaClass = `${ctaBaseClass} border border-black/15 bg-transparent text-foreground hover:bg-black/[0.04] dark:border-white/20 dark:hover:bg-white/[0.06]`
  const filledCtaClass = `${ctaBaseClass} bg-foreground text-background hover:opacity-90`
  const faqLinkClass =
    "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-current/25 underline-offset-4 transition-colors hover:decoration-current"

  const featuresIntroIcons = { sparkle: Sparkle, gem: Gem } as const
</script>

<!-- A chevron, not ArrowUpRight: that one marks links leaving the site, and checkout opens in an overlay. -->
{#snippet ctaChevron()}
  <ChevronRight class="-mr-1 h-4 w-4 shrink-0 opacity-70" strokeWidth={2} aria-hidden="true" />
{/snippet}

<div class="relative flex min-h-[100dvh] flex-col bg-background">
  <main
    class="flex flex-1 flex-col px-4 pb-24 pt-[calc(8.5rem+env(safe-area-inset-top,0px))] sm:px-6 lg:px-8 lg:pb-32 lg:pt-[calc(12.5rem+env(safe-area-inset-top,0px))]"
  >
    <div class="mx-auto w-full max-w-5xl">
      <header class="mx-auto max-w-xl text-center">
        <h1 class={marketingPageTitleClass}>{PRICING_PAGE_TITLE}</h1>
        <p class={`mt-5 text-balance text-sm leading-6 ${secondaryTextClass}`}>
          {PRICING_PAGE_EARLY_MEMBER_NOTE}
        </p>
      </header>

      <div class="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3 lg:grid-rows-[repeat(4,auto)] lg:gap-x-5 lg:gap-y-0">
        {#each PRICING_PLANS as plan (plan.id)}
          {@const isPaid = plan.id !== "free"}
          {@const FeaturesIntroIcon = plan.featuresIntroIcon ? featuresIntroIcons[plan.featuresIntroIcon] : null}
          <article
            class="flex flex-col gap-6 rounded-2xl border border-black/10 p-7 dark:border-white/12 lg:grid lg:grid-rows-subgrid lg:row-span-4 lg:p-8"
          >
            <div class="flex flex-col gap-2.5">
              <h2 class="font-sans text-[1.5rem] font-semibold leading-none tracking-[-0.03em] text-foreground">
                {plan.name}
              </h2>
              {#if plan.tagline}
                <p class={`text-sm leading-6 ${secondaryTextClass}`}>{plan.tagline}</p>
              {/if}
            </div>

            <div>
              <p class="flex items-baseline gap-0.5">
                <span class="font-sans text-[2.5rem] font-normal leading-none tracking-[-0.04em] text-foreground">
                  {plan.price}
                </span>
                {#if plan.cadence}
                  <span
                    class={isPaid
                      ? "text-lg font-medium tracking-[-0.02em] text-foreground/65"
                      : "text-sm font-medium text-black/45 dark:text-white/45"}
                  >
                    {plan.cadence}
                  </span>
                {/if}
              </p>
            </div>

            <div>
              {#if plan.id === "free"}
                <a href="/download" class={filledCtaClass}>{plan.ctaLabel}{@render ctaChevron()}</a>
              {:else}
                {@const mode = checkoutModes[plan.id]}
                {#if mode.kind === "unavailable"}
                  <button
                    type="button"
                    disabled
                    class={`${ctaBaseClass} cursor-not-allowed border border-black/12 bg-transparent text-black/45 dark:border-white/15 dark:text-white/45`}
                  >
                    {plan.ctaLabel}
                  </button>
                {:else}
                  <PolarSubscribeButton
                    plan={plan.id}
                    {mode}
                    label={plan.ctaLabel}
                    trailingIcon={ctaChevron}
                    class={outlinedCtaClass}
                  />
                {/if}
              {/if}
            </div>

            <div class="flex flex-col gap-3">
              {#if plan.featuresIntro}
                <p class="flex gap-2.5 text-sm font-medium leading-6 text-foreground">
                  {#if FeaturesIntroIcon}
                    <FeaturesIntroIcon
                      class={`mt-[0.3rem] h-3.5 w-3.5 shrink-0 ${tertiaryTextClass}`}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  {/if}
                  <span>{plan.featuresIntro}</span>
                </p>
              {/if}
              <ul class="flex flex-col gap-2.5">
                {#each plan.features as feature (feature)}
                  <li class="flex gap-2.5 text-sm leading-6 text-foreground/80">
                    <Check class={`mt-[0.3rem] h-3.5 w-3.5 shrink-0 ${mutedIconClass}`} strokeWidth={1.75} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </article>
        {/each}
      </div>

      <section class="mt-14 lg:mt-16">
        <div
          class="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/12"
          aria-hidden="true"
        ></div>
        <h2 class={`${marketingPageSectionTitleClass} mt-10 lg:mt-12`}>Frequently Asked Questions</h2>
        <div class="mt-8 border-t border-black/8 divide-y divide-black/8 dark:border-white/10 dark:divide-white/10">
          {#each PRICING_FAQS as faq (faq.question)}
            <!-- Native details, so answers stay reachable with JavaScript off. -->
            <details class="group">
              <summary
                class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden"
              >
                <h3 class="text-base font-light leading-snug text-foreground">{faq.question}</h3>
                <ChevronDown
                  class={`h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180 ${mutedIconClass}`}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <div class={`-mt-2 pb-5 pr-8 text-pretty text-sm leading-6 ${secondaryTextClass}`}>
                <p>{faq.answer}</p>
                {#if faq.link}
                  <a
                    href={faq.link.href}
                    target={faq.link.external ? "_blank" : undefined}
                    rel={faq.link.external ? "noopener noreferrer" : undefined}
                    class={faqLinkClass}
                  >
                    {faq.link.label}
                    <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                {/if}
              </div>
            </details>
          {/each}
        </div>
      </section>

      <p class={`mt-16 text-center text-xs leading-5 lg:mt-20 ${tertiaryTextClass}`}>
        By downloading or subscribing, you agree to the
        <a href="/terms" class="underline underline-offset-2">terms</a>,
        <a href="/privacy" class="underline underline-offset-2">privacy statement</a>, and
        <a href="/refund-policy" class="underline underline-offset-2">refund policy</a>.
      </p>
    </div>
  </main>

  <SiteFooter />
</div>
