<script lang="ts">
  import { Check, ChevronRight, Copy, QrCode, TriangleAlert, Wallet, X } from "@lucide/svelte"
  import QRCodeLib from "qrcode"
  import { onMount } from "svelte"
  import {
    createPublicClient,
    createWalletClient,
    custom,
    defineChain,
    erc20Abi,
    parseUnits,
    type EIP1193Provider,
  } from "viem"
  import SiEthereum from "#lib/components/icons/SiEthereum.svelte"
  import SiTether from "#lib/components/icons/SiTether.svelte"
  import { SPONSOR_USDT_ETH_ADDRESS, SPONSOR_USDT_ETHERSCAN_URL } from "#lib/sponsor-usdt"

  let { open }: { open: boolean } = $props()

  const SPONSOR_USDT_ADDRESS_SHORT = `${SPONSOR_USDT_ETH_ADDRESS.slice(0, 6)}…${SPONSOR_USDT_ETH_ADDRESS.slice(-4)}`

  // USDT (Tether) on Ethereum mainnet (6 decimals).
  const ETHEREUM_USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const
  // Define only the chain this panel uses so the browser bundle does not pull
  // every viem chain, including Node-only tooling for unrelated networks.
  const mainnet = defineChain({
    id: 1,
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockTime: 12_000,
    rpcUrls: { default: { http: ["https://ethereum.reth.rs/rpc"] } },
    blockExplorers: {
      default: {
        name: "Etherscan",
        url: "https://etherscan.io",
        apiUrl: "https://api.etherscan.io/api",
      },
    },
    contracts: {
      ensUniversalResolver: {
        address: "0xeeeeeeee14d718c2b47d9923deab1335e144eeee",
        blockCreated: 23_085_558,
      },
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 14_353_601,
      },
    },
  })

  const PRESET_AMOUNTS = ["5", "10", "25", "100"]
  const DEFAULT_AMOUNT = "10"
  const METAMASK_IDS = new Set(["io.metamask", "io.metamask.mobile"])
  const COINBASE_ID = "com.coinbase.wallet"
  const AMOUNT_KEY = "amount"

  // Browser wallets announce themselves through EIP-6963.
  interface InjectedWallet {
    uuid: string
    rdns: string
    name: string
    icon: string
    provider: EIP1193Provider
  }

  type FlowState =
    | { step: "idle" }
    | {
        step: "working"
        phase: "connecting" | "approving" | "confirming"
        walletKey: string
        walletName: string
        amount: string
      }
    | { step: "success"; walletKey: string; txHash?: string }
    | { step: "error"; walletKey: string; message: string; retry: (() => void) | null }

  let preset = $state<string | null>(DEFAULT_AMOUNT)
  let customAmount = $state("")
  let flow = $state<FlowState>({ step: "idle" })
  let copied = $state(false)
  let qrOpen = $state(true)
  // Raw: wallet providers are live objects that must not be proxied.
  let wallets = $state.raw<InjectedWallet[]>([])

  const busy = $derived(flow.step === "working")
  const amount = $derived(preset ?? customAmount)
  const amountValid = $derived(/^\d+(\.\d{1,2})?$/.test(amount) && Number(amount) > 0)

  // EIP-681 payment request: USDT contract on Ethereum mainnet (chain 1),
  // recipient, and the amount in token units, so scanning pre-fills the whole
  // transfer. Without a valid amount, fall back to the bare address (maximum
  // scanner compatibility).
  const qrValue = $derived(
    amountValid
      ? `ethereum:${ETHEREUM_USDT_ADDRESS}@1/transfer?address=${SPONSOR_USDT_ETH_ADDRESS}&uint256=${parseUnits(amount, 6).toString()}`
      : SPONSOR_USDT_ETH_ADDRESS,
  )

  // Same SVG shape react-qr-code drew: one path for light cells, one for dark.
  const qr = $derived.by(() => {
    const { modules } = QRCodeLib.create(qrValue, { errorCorrectionLevel: "H" })
    const light: string[] = []
    const dark: string[] = []
    for (let row = 0; row < modules.size; row++) {
      for (let col = 0; col < modules.size; col++) {
        ;(modules.get(row, col) ? dark : light).push(`M ${col} ${row} l 1 0 0 1 -1 0 Z`)
      }
    }
    return { size: modules.size, light: light.join(" "), dark: dark.join(" ") }
  })

  // Coinbase first, then MetaMask, then any other detected extension wallet.
  const metaMaskWallet = $derived(wallets.find((wallet) => METAMASK_IDS.has(wallet.rdns)))
  const walletOptions = $derived([
    ...wallets.filter((wallet) => wallet.rdns === COINBASE_ID),
    ...(metaMaskWallet ? [metaMaskWallet] : []),
    ...wallets.filter((wallet) => wallet.rdns !== COINBASE_ID && !METAMASK_IDS.has(wallet.rdns)),
  ])

  onMount(() => {
    const onAnnounce = (event: Event) => {
      const wallet = toInjectedWallet((event as CustomEvent<unknown>).detail)
      if (wallet && !wallets.some((known) => known.uuid === wallet.uuid)) wallets = [...wallets, wallet]
    }
    window.addEventListener("eip6963:announceProvider", onAnnounce)
    window.dispatchEvent(new Event("eip6963:requestProvider"))
    return () => window.removeEventListener("eip6963:announceProvider", onAnnounce)
  })

  // Extensions put whatever they like in the announcement; keep only a usable shape.
  function toInjectedWallet(detail: unknown): InjectedWallet | null {
    if (typeof detail !== "object" || detail === null) return null
    const { info, provider } = detail as { info?: unknown; provider?: unknown }
    if (typeof info !== "object" || info === null) return null
    if (typeof provider !== "object" || provider === null || typeof (provider as { request?: unknown }).request !== "function") {
      return null
    }
    const { uuid, rdns, name, icon } = info as Record<string, unknown>
    if (typeof uuid !== "string" || !uuid) return null
    return {
      uuid,
      rdns: typeof rdns === "string" ? rdns : "",
      name: typeof name === "string" && name ? name : "Wallet",
      // EIP-6963 icons are data URIs; anything else could point off-site.
      icon: typeof icon === "string" && icon.startsWith("data:image/") ? icon : "",
      provider: provider as EIP1193Provider,
    }
  }

  function errorMessage(error: unknown) {
    if (typeof error === "object" && error !== null) {
      const err = error as { code?: number; name?: string; shortMessage?: string; message?: string }
      if (
        err.code === 4001 ||
        err.name === "UserRejectedRequestError" ||
        /rejected|denied|cancell?ed/i.test(err.message ?? "")
      ) {
        return "Request cancelled in the wallet."
      }
      const message = err.shortMessage ?? err.message
      if (message) return message.length > 140 ? `${message.slice(0, 137)}…` : message
    }
    return "Something went wrong. Please try again."
  }

  function clearTransientFlow() {
    if (flow.step === "error" || flow.step === "success") flow = { step: "idle" }
  }

  function selectPreset(value: string) {
    preset = value
    customAmount = ""
    clearTransientFlow()
  }

  function onCustomAmountInput(event: Event & { currentTarget: HTMLInputElement }) {
    const value = event.currentTarget.value
    if (value !== "" && !/^\d*(\.\d{0,2})?$/.test(value)) {
      event.currentTarget.value = customAmount
      return
    }
    preset = null
    customAmount = value
    clearTransientFlow()
  }

  function requireAmount() {
    if (amountValid) return true
    flow = { step: "error", walletKey: AMOUNT_KEY, message: "Enter an amount first.", retry: null }
    return false
  }

  async function donateWith(wallet: InjectedWallet) {
    if (busy || !requireAmount()) return
    const currentAmount = amount
    const walletKey = wallet.uuid
    const walletName = wallet.name
    const working = (phase: "connecting" | "approving" | "confirming") => {
      flow = { step: "working", phase, walletKey, walletName, amount: currentAmount }
    }
    const retry = () => void donateWith(wallet)

    working("connecting")
    try {
      const transport = custom(wallet.provider)
      const walletClient = createWalletClient({ chain: mainnet, transport })
      const [account] = await walletClient.requestAddresses()
      if ((await walletClient.getChainId()) !== mainnet.id) {
        await walletClient.switchChain({ id: mainnet.id })
      }
      working("approving")
      const hash = await walletClient.writeContract({
        account,
        chain: mainnet,
        abi: erc20Abi,
        address: ETHEREUM_USDT_ADDRESS,
        functionName: "transfer",
        args: [SPONSOR_USDT_ETH_ADDRESS, parseUnits(currentAmount, 6)],
      })
      working("confirming")
      // Read the receipt through the wallet's own RPC, so the page needs no
      // third-party RPC endpoint of its own.
      const receipt = await createPublicClient({ chain: mainnet, transport }).waitForTransactionReceipt({ hash })
      flow =
        receipt.status === "success"
          ? { step: "success", walletKey, txHash: hash }
          : { step: "error", walletKey, message: "The transaction reverted on Ethereum.", retry }
    } catch (error) {
      flow = { step: "error", walletKey, message: errorMessage(error), retry }
    }
  }

  // Without the extension, hand off to the MetaMask app's in-app browser,
  // where the page reloads with MetaMask available as an injected wallet.
  function openInMetaMaskApp() {
    if (busy) return
    const { host, pathname } = window.location
    window.location.href = `https://metamask.app.link/dapp/${host}${pathname}`
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(SPONSOR_USDT_ETH_ADDRESS)
      copied = true
      setTimeout(() => (copied = false), 2000)
    } catch {
      // Clipboard access denied; the address stays selectable as text.
    }
  }

  function workingMessage(state: Extract<FlowState, { step: "working" }>) {
    if (state.phase === "connecting") return `Opening ${state.walletName}…`
    if (state.phase === "approving") return `Approve the $${state.amount} USDT payment in ${state.walletName}…`
    return "Waiting for confirmation on Ethereum…"
  }
</script>

{#snippet flowFor(walletKey: string)}
  {#if flow.step !== "idle" && flow.walletKey === walletKey}
    {#if flow.step === "working"}
      <p class="minimal-wallet-flow" role="status">{workingMessage(flow)}</p>
    {:else if flow.step === "success"}
      <p class="minimal-wallet-flow" data-kind="success" role="status">
        Thank you for your support!{#if flow.txHash}{" "}<a
            href={`https://etherscan.io/tx/${flow.txHash}`}
            target="_blank"
            rel="noopener noreferrer">View transaction</a
          >{/if}
      </p>
    {:else}
      {@const retry = flow.retry}
      <div class="minimal-wallet-error" role="alert">
        <span>{flow.message}</span>
        <span class="minimal-wallet-error-actions">
          {#if retry}
            <button type="button" onclick={retry}>Try again</button>
          {/if}
          <button type="button" aria-label="Dismiss" onclick={() => (flow = { step: "idle" })}>
            <X aria-hidden="true" />
          </button>
        </span>
      </div>
    {/if}
  {/if}
{/snippet}

{#if open}
  <div class="minimal-wallet-panel" id="sponsor-usdt-panel">
    <header class="minimal-wallet-panel-heading">
      <h3>Donate with USDT</h3>
      <span class="minimal-wallet-panel-warning">
        <TriangleAlert aria-hidden="true" />
        Send only USDT on the Ethereum network
      </span>
    </header>
    <section>
      <p class="minimal-wallet-panel-label">Amount</p>
      <div class="minimal-wallet-amounts">
        {#each PRESET_AMOUNTS as value (value)}
          <button
            type="button"
            class="minimal-wallet-amount-chip"
            data-selected={preset === value}
            onclick={() => selectPreset(value)}
            disabled={busy}
          >
            ${value}
          </button>
        {/each}
        <label class="minimal-wallet-amount-inputrow" data-selected={preset === null}>
          <span aria-hidden="true">$</span>
          <input
            type="text"
            inputmode="decimal"
            placeholder="enter custom amount"
            value={customAmount}
            oninput={onCustomAmountInput}
            onfocus={() => (preset = null)}
            disabled={busy}
            aria-label="Custom amount in US dollars"
          />
        </label>
      </div>
      {@render flowFor(AMOUNT_KEY)}
    </section>
    <section>
      <p class="minimal-wallet-panel-label">Choose a wallet</p>
      <div class="minimal-wallet-options">
        {#each walletOptions as wallet (wallet.uuid)}
          <div class="minimal-wallet-option-slot">
            <button type="button" class="minimal-wallet-option" onclick={() => void donateWith(wallet)} disabled={busy}>
              {#if wallet.icon}
                <img class="minimal-wallet-option-icon" src={wallet.icon} alt="" aria-hidden="true" />
              {:else if METAMASK_IDS.has(wallet.rdns)}
                <img class="minimal-wallet-option-icon" src="/wallets/metamask.svg" alt="" aria-hidden="true" />
              {:else}
                <Wallet class="minimal-wallet-option-icon" aria-hidden="true" />
              {/if}
              <span class="minimal-wallet-option-text">{wallet.name}</span>
              <ChevronRight class="minimal-wallet-option-chevron" aria-hidden="true" />
            </button>
            {@render flowFor(wallet.uuid)}
          </div>
        {/each}
        {#if !metaMaskWallet}
          <button type="button" class="minimal-wallet-option" onclick={openInMetaMaskApp} disabled={busy}>
            <img class="minimal-wallet-option-icon" src="/wallets/metamask.svg" alt="" aria-hidden="true" />
            <span class="minimal-wallet-option-text">MetaMask<small>Opens the MetaMask app</small></span>
            <ChevronRight class="minimal-wallet-option-chevron" aria-hidden="true" />
          </button>
        {/if}
        <div class="minimal-wallet-option-slot">
          <button
            type="button"
            class="minimal-wallet-option"
            onclick={() => (qrOpen = !qrOpen)}
            disabled={busy}
            aria-expanded={qrOpen}
            data-open={qrOpen}
          >
            <QrCode class="minimal-wallet-option-icon" aria-hidden="true" />
            <span class="minimal-wallet-option-text">QR code<small>Scan with any wallet app</small></span>
            <ChevronRight class="minimal-wallet-option-chevron" data-open={qrOpen} aria-hidden="true" />
          </button>
          {#if qrOpen}
            <div class="minimal-wallet-qr">
              <div class="minimal-wallet-qr-code">
                <svg
                  aria-label="QR code for the USDT payment request"
                  height="132"
                  width="132"
                  viewBox={`0 0 ${qr.size} ${qr.size}`}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={qr.light} fill="#ffffff" />
                  <path d={qr.dark} fill="#0a0a0a" />
                </svg>
                <span class="minimal-wallet-qr-logo" aria-hidden="true">
                  <SiTether />
                  <span class="minimal-wallet-qr-logo-eth">
                    <SiEthereum />
                  </span>
                </span>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </section>
    <p class="minimal-wallet-recipient">
      Recipient: <code>{SPONSOR_USDT_ADDRESS_SHORT}</code>
      <button type="button" class="minimal-wallet-copy" onclick={copyAddress} aria-label="Copy recipient address">
        {#if copied}<Check aria-hidden="true" />{:else}<Copy aria-hidden="true" />{/if}
        {copied ? "Copied" : "Copy"}
      </button>
    </p>
    <p class="minimal-wallet-note">
      <a href={SPONSOR_USDT_ETHERSCAN_URL} target="_blank" rel="noopener noreferrer">View on Etherscan</a>
    </p>
  </div>
{/if}
