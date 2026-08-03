"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getPaymentStatus, pay } from "@base-org/account"
import { Wallet } from "lucide-react"
import { SiCircle, SiWalletconnect } from "react-icons/si"
import { erc20Abi, parseUnits } from "viem"
import {
  WagmiProvider,
  createConfig,
  http,
  useAccount,
  useConnect,
  usePublicClient,
  useSwitchChain,
  useWriteContract,
} from "wagmi"
import { base } from "wagmi/chains"
import { walletConnect } from "wagmi/connectors"
import type { Connector } from "wagmi"

export const SPONSOR_USDC_ETH_ADDRESS =
  "0x7d6ab3dbdf510d6669e72f0e27ada61bbad0821d" as const

export const SPONSOR_USDC_BASESCAN_URL = `https://basescan.org/address/${SPONSOR_USDC_ETH_ADDRESS}`

// Native USDC on Base mainnet (6 decimals).
const BASE_USDC_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const

const PRESET_AMOUNTS = ["5", "10", "25", "100"]
const DEFAULT_AMOUNT = "10"

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const wagmiConfig = createConfig({
  chains: [base],
  connectors: walletConnectProjectId
    ? [walletConnect({ projectId: walletConnectProjectId })]
    : [],
  transports: { [base.id]: http() },
  ssr: true,
})

const queryClient = new QueryClient()

// The Coinbase extension announces itself via EIP-6963, but Coinbase users are
// already covered by the Base Pay option; hide it so the two aren't confused.
const HIDDEN_DISCOVERED_IDS = new Set(["com.coinbase.wallet"])
const METAMASK_IDS = new Set(["io.metamask", "io.metamask.mobile"])

type PanelStatus =
  | { kind: "idle" }
  | { kind: "connecting"; wallet: string }
  | { kind: "paying"; wallet: string; amount: string }
  | { kind: "confirming" }
  | { kind: "success"; txHash?: string }
  | { kind: "error"; message: string }

function errorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const err = error as {
      code?: number
      name?: string
      shortMessage?: string
      message?: string
    }
    if (
      err.code === 4001 ||
      err.name === "UserRejectedRequestError" ||
      /rejected|denied|cancell?ed/i.test(err.message ?? "")
    ) {
      return "Request canceled in the wallet."
    }
    const message = err.shortMessage ?? err.message
    if (message) {
      return message.length > 140 ? `${message.slice(0, 137)}…` : message
    }
  }
  return "Something went wrong. Please try again."
}

async function waitForBasePayCompletion(id: string) {
  for (let attempt = 0; attempt < 15; attempt++) {
    const { status } = await getPaymentStatus({ id })
    if (status === "completed") return true
    if (status === "failed") return false
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  // Still pending after polling; the payment was submitted, so treat as success.
  return true
}

function ConnectorIcon({ connector }: { connector: Connector }) {
  const className = "minimal-wallet-option-icon"
  if (connector.id === "walletConnect") {
    return <SiWalletconnect className={className} style={{ color: "#3b99fc" }} aria-hidden />
  }
  if (connector.icon) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={connector.icon} alt="" aria-hidden />
  }
  if (METAMASK_IDS.has(connector.id)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src="/wallets/metamask.svg" alt="" aria-hidden />
  }
  return <Wallet className={className} aria-hidden />
}

function DonatePanel() {
  const [open, setOpen] = useState(false)
  const [preset, setPreset] = useState<string | null>(DEFAULT_AMOUNT)
  const [customAmount, setCustomAmount] = useState("")
  const [status, setStatus] = useState<PanelStatus>({ kind: "idle" })

  const account = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient({ chainId: base.id })

  const busy =
    status.kind === "connecting" ||
    status.kind === "paying" ||
    status.kind === "confirming"

  const amount = preset ?? customAmount
  const amountValid = /^\d+(\.\d{1,2})?$/.test(amount) && Number(amount) > 0

  const selectPreset = (value: string) => {
    setPreset(value)
    if (status.kind === "error") setStatus({ kind: "idle" })
  }

  const onCustomAmountChange = (value: string) => {
    if (value !== "" && !/^\d*(\.\d{0,2})?$/.test(value)) return
    setPreset(null)
    setCustomAmount(value)
    if (status.kind === "error") setStatus({ kind: "idle" })
  }

  const requireAmount = () => {
    if (amountValid) return true
    setStatus({ kind: "error", message: "Enter a valid amount first." })
    return false
  }

  const donateWithBasePay = async () => {
    if (busy || !requireAmount()) return
    setStatus({ kind: "paying", wallet: "Base", amount })
    try {
      const payment = await pay({
        amount,
        to: SPONSOR_USDC_ETH_ADDRESS,
      })
      setStatus({ kind: "confirming" })
      const completed = await waitForBasePayCompletion(payment.id)
      setStatus(
        completed
          ? { kind: "success" }
          : { kind: "error", message: "The payment didn’t go through." },
      )
    } catch (error) {
      setStatus({ kind: "error", message: errorMessage(error) })
    }
  }

  const donateWithConnector = async (connector: Connector) => {
    if (busy || !requireAmount()) return
    setStatus({ kind: "connecting", wallet: connector.name })
    try {
      let chainId = account.chainId
      if (!account.isConnected || account.connector?.uid !== connector.uid) {
        const connection = await connectAsync({ connector, chainId: base.id })
        chainId = connection.chainId
      }
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id })
      }
      setStatus({ kind: "paying", wallet: connector.name, amount })
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: BASE_USDC_ADDRESS,
        functionName: "transfer",
        args: [SPONSOR_USDC_ETH_ADDRESS, parseUnits(amount, 6)],
        chainId: base.id,
      })
      setStatus({ kind: "confirming" })
      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      setStatus(
        receipt?.status === "success"
          ? { kind: "success", txHash: hash }
          : { kind: "error", message: "The transaction reverted on Base." },
      )
    } catch (error) {
      setStatus({ kind: "error", message: errorMessage(error) })
    }
  }

  // MetaMask first when its extension is installed, then other detected
  // extension wallets, with WalletConnect (if configured) last.
  const metaMaskConnector = connectors.find((connector) =>
    METAMASK_IDS.has(connector.id),
  )
  const walletOptions = [
    ...(metaMaskConnector ? [metaMaskConnector] : []),
    ...connectors.filter(
      (connector) =>
        connector.id !== "walletConnect" &&
        !METAMASK_IDS.has(connector.id) &&
        !HIDDEN_DISCOVERED_IDS.has(connector.id),
    ),
    ...connectors.filter((connector) => connector.id === "walletConnect"),
  ]

  // Without the extension, hand off to the MetaMask app's in-app browser,
  // where the page reloads with MetaMask available as an injected wallet.
  const openInMetaMaskApp = () => {
    if (busy) return
    const { host, pathname } = window.location
    window.location.href = `https://metamask.app.link/dapp/${host}${pathname}`
  }

  const statusLine = (() => {
    switch (status.kind) {
      case "idle":
        return null
      case "connecting":
        return `Opening ${status.wallet}…`
      case "paying":
        return `Approve the $${status.amount} USDC payment in ${status.wallet}…`
      case "confirming":
        return "Waiting for confirmation on Base…"
      case "success":
        return "Thank you for your support!"
      case "error":
        return status.message
    }
  })()

  return (
    <>
      <button
        type="button"
        className="minimal-secondary-button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="sponsor-usdc-panel"
      >
        <SiCircle className="minimal-sponsor-button-icon" aria-hidden />
        Donate USDC
      </button>
      {open ? (
        <div className="minimal-wallet-panel" id="sponsor-usdc-panel">
          <div>
            <p className="minimal-wallet-panel-label">Amount</p>
            <div className="minimal-wallet-amounts">
              {PRESET_AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className="minimal-wallet-amount-chip"
                  data-selected={preset === value}
                  onClick={() => selectPreset(value)}
                  disabled={busy}
                >
                  ${value}
                </button>
              ))}
              <label
                className="minimal-wallet-amount-custom"
                data-selected={preset === null}
              >
                $
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Custom"
                  value={customAmount}
                  onChange={(event) => onCustomAmountChange(event.target.value)}
                  onFocus={() => setPreset(null)}
                  disabled={busy}
                  aria-label="Custom amount in US dollars"
                />
              </label>
            </div>
          </div>
          <div>
            <p className="minimal-wallet-panel-label">Pay with</p>
            <div className="minimal-wallet-options">
              <button
                type="button"
                className="minimal-wallet-option"
                onClick={donateWithBasePay}
                disabled={busy}
              >
                <span
                  className="minimal-wallet-option-icon minimal-wallet-option-icon-base"
                  aria-hidden
                />
                Base
                <small>Coinbase &amp; passkeys — no app needed</small>
              </button>
              {!metaMaskConnector ? (
                <button
                  type="button"
                  className="minimal-wallet-option"
                  onClick={openInMetaMaskApp}
                  disabled={busy}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="minimal-wallet-option-icon"
                    src="/wallets/metamask.svg"
                    alt=""
                    aria-hidden
                  />
                  MetaMask
                  <small>Opens the MetaMask app</small>
                </button>
              ) : null}
              {walletOptions.map((connector) => (
                <button
                  key={connector.uid}
                  type="button"
                  className="minimal-wallet-option"
                  onClick={() => donateWithConnector(connector)}
                  disabled={busy}
                >
                  <ConnectorIcon connector={connector} />
                  {connector.name}
                  {connector.id === "walletConnect" ? (
                    <small>Rainbow, Trust &amp; more</small>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
          {statusLine ? (
            <p
              className="minimal-wallet-status"
              data-kind={status.kind}
              role="status"
            >
              {statusLine}
              {status.kind === "success" && status.txHash ? (
                <>
                  {" "}
                  <a
                    href={`https://basescan.org/tx/${status.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View transaction
                  </a>
                </>
              ) : null}
            </p>
          ) : null}
          <p className="minimal-wallet-note">
            USDC on the Base network, sent to{" "}
            <a
              href={SPONSOR_USDC_BASESCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              0x7d6a…821d
            </a>
          </p>
        </div>
      ) : null}
    </>
  )
}

export function SponsorUsdcDonateButton() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DonatePanel />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
