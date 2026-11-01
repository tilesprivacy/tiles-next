<script lang="ts">
  import type { Snippet } from "svelte"
  import { theme } from "#lib/theme.svelte"
  import type { PolarCheckoutMode, PolarPaidPlanId } from "#lib/pricing-plans"

  /**
   * Subscribe action for a paid plan, opening Polar's embedded checkout in an
   * overlay. The real `href` keeps a full-page checkout working without JS.
   */
  let {
    plan,
    mode,
    label,
    trailingIcon,
    class: className,
  }: {
    plan: PolarPaidPlanId
    mode: Exclude<PolarCheckoutMode, { kind: "unavailable" }>
    label: string
    /** Sits after the label, and drops out while the checkout is opening. */
    trailingIcon?: Snippet
    class?: string
  } = $props()

  let isOpening = $state(false)
  let hasFailed = $state(false)

  const fallbackHref = $derived(mode.kind === "link" ? mode.url : `/api/polar/checkout/${plan}`)

  async function openCheckout(event: MouseEvent) {
    // Let modified clicks (new tab, etc.) behave normally.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return

    event.preventDefault()
    if (isOpening) return

    isOpening = true
    hasFailed = false

    try {
      let url = mode.kind === "link" ? mode.url : null

      if (!url) {
        const response = await fetch(`/api/polar/checkout/session?plan=${plan}`, { method: "POST" })
        if (!response.ok) throw new Error(`checkout session request failed: ${response.status}`)
        const data: { url?: string } = await response.json()
        url = data.url ?? null
      }

      if (!url) throw new Error("checkout session returned no url")

      // Loaded on click: most visitors never open checkout.
      const { PolarEmbedCheckout } = await import("@polar-sh/checkout/embed")
      await PolarEmbedCheckout.create(url, { theme: theme.resolved })
    } catch (error) {
      console.error("[polar] could not open embedded checkout", error)
      hasFailed = true
    } finally {
      isOpening = false
    }
  }
</script>

<a href={fallbackHref} onclick={openCheckout} aria-busy={isOpening || undefined} class={className}>
  {#if isOpening}
    Opening checkout
  {:else}
    {label}{@render trailingIcon?.()}
  {/if}
</a>
{#if hasFailed}
  <p role="alert" class="mt-2 text-xs leading-5 text-red-600 dark:text-red-400">
    Could not open checkout.
    <a href={fallbackHref} class="underline underline-offset-4">Open it in a new page</a>.
  </p>
{/if}
