<script lang="ts">
  import { ChevronDown } from "@lucide/svelte"
  import type { Component } from "svelte"
  import SiEthereum from "#lib/components/icons/SiEthereum.svelte"
  import SiTether from "#lib/components/icons/SiTether.svelte"

  // viem only exists inside the panel, which loads on demand so it stays out
  // of the page bundle.
  const loadPanel = () => import("#lib/components/SponsorUsdtDonatePanel.svelte")

  let open = $state(false)
  // Once loaded, the panel stays mounted (hidden via `open`) so the amount
  // and flow state survive close and reopen.
  let Panel = $state<Component<{ open: boolean }> | null>(null)

  const preloadPanel = () => {
    void loadPanel()
  }

  // Fetch the chunk once the page is idle, so the first tap on a touch
  // device (no hover preload) opens the panel within a frame.
  $effect(() => {
    // Safari has no requestIdleCallback.
    if (typeof requestIdleCallback === "function") {
      const idleHandle = requestIdleCallback(preloadPanel)
      return () => cancelIdleCallback(idleHandle)
    }
    const timeoutHandle = setTimeout(preloadPanel, 1500)
    return () => clearTimeout(timeoutHandle)
  })

  async function toggle() {
    open = !open
    if (!Panel) Panel = (await loadPanel()).default
  }
</script>

<button
  type="button"
  class="minimal-secondary-button minimal-wallet-toggle"
  onclick={toggle}
  onpointerenter={preloadPanel}
  onfocus={preloadPanel}
  aria-expanded={open}
  aria-controls="sponsor-usdt-panel"
>
  <span class="minimal-wallet-button-token" aria-hidden="true">
    <SiTether class="minimal-sponsor-button-icon" />
    <SiEthereum class="minimal-wallet-button-token-eth" />
  </span>
  Donate with USDT
  <ChevronDown class="minimal-wallet-toggle-chevron" data-open={open} aria-hidden="true" />
</button>
{#if Panel}
  <Panel {open} />
{/if}
