"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getPaymentStatus, pay } from "@base-org/account"
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  QrCode,
  TriangleAlert,
  Wallet,
  X,
} from "lucide-react"
import QRCode from "react-qr-code"
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

const SPONSOR_USDC_ADDRESS_SHORT = `${SPONSOR_USDC_ETH_ADDRESS.slice(0, 6)}…${SPONSOR_USDC_ETH_ADDRESS.slice(-4)}`

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

const BASE_PAY_KEY = "base-pay"
const AMOUNT_KEY = "amount"

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
  | {
      step: "error"
      walletKey: string
      message: string
      retry: (() => void) | null
    }

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
      return "Request cancelled in the wallet."
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
  const [flow, setFlow] = useState<FlowState>({ step: "idle" })
  const [copied, setCopied] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  const account = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient({ chainId: base.id })

  const busy = flow.step === "working"

  const amount = preset ?? customAmount
  const amountValid = /^\d+(\.\d{1,2})?$/.test(amount) && Number(amount) > 0

  // EIP-681 payment request: USDC contract on Base (chain 8453), recipient,
  // and the amount in token units, so scanning pre-fills the whole transfer.
  // Without a valid amount, fall back to the bare address (maximum scanner
  // compatibility) and tell the donor to enter the amount in their wallet.
  const qrValue = amountValid
    ? `ethereum:${BASE_USDC_ADDRESS}@8453/transfer?address=${SPONSOR_USDC_ETH_ADDRESS}&uint256=${parseUnits(amount, 6).toString()}`
    : SPONSOR_USDC_ETH_ADDRESS

  const clearTransientFlow = () => {
    if (flow.step === "error" || flow.step === "success") {
      setFlow({ step: "idle" })
    }
  }

  const selectPreset = (value: string) => {
    setPreset(value)
    clearTransientFlow()
  }

  const selectCustom = () => {
    setPreset(null)
    clearTransientFlow()
  }

  const onCustomAmountChange = (value: string) => {
    if (value !== "" && !/^\d*(\.\d{0,2})?$/.test(value)) return
    setCustomAmount(value)
    clearTransientFlow()
  }

  const requireAmount = () => {
    if (amountValid) return true
    setFlow({
      step: "error",
      walletKey: AMOUNT_KEY,
      message: "Enter an amount first.",
      retry: null,
    })
    return false
  }

  const donateWithBasePay = async () => {
    if (busy || !requireAmount()) return
    const currentAmount = amount
    setFlow({
      step: "working",
      phase: "approving",
      walletKey: BASE_PAY_KEY,
      walletName: "Base",
      amount: currentAmount,
    })
    try {
      const payment = await pay({
        amount: currentAmount,
        to: SPONSOR_USDC_ETH_ADDRESS,
      })
      setFlow({
        step: "working",
        phase: "confirming",
        walletKey: BASE_PAY_KEY,
        walletName: "Base",
        amount: currentAmount,
      })
      const completed = await waitForBasePayCompletion(payment.id)
      setFlow(
        completed
          ? { step: "success", walletKey: BASE_PAY_KEY }
          : {
              step: "error",
              walletKey: BASE_PAY_KEY,
              message: "The payment didn’t go through.",
              retry: () => void donateWithBasePay(),
            },
      )
    } catch (error) {
      setFlow({
        step: "error",
        walletKey: BASE_PAY_KEY,
        message: errorMessage(error),
        retry: () => void donateWithBasePay(),
      })
    }
  }

  const donateWithConnector = async (connector: Connector) => {
    if (busy || !requireAmount()) return
    const currentAmount = amount
    const walletKey = connector.uid
    const walletName = connector.name
    setFlow({
      step: "working",
      phase: "connecting",
      walletKey,
      walletName,
      amount: currentAmount,
    })
    try {
      let chainId = account.chainId
      if (!account.isConnected || account.connector?.uid !== connector.uid) {
        const connection = await connectAsync({ connector, chainId: base.id })
        chainId = connection.chainId
      }
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id })
      }
      setFlow({
        step: "working",
        phase: "approving",
        walletKey,
        walletName,
        amount: currentAmount,
      })
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: BASE_USDC_ADDRESS,
        functionName: "transfer",
        args: [SPONSOR_USDC_ETH_ADDRESS, parseUnits(currentAmount, 6)],
        chainId: base.id,
      })
      setFlow({
        step: "working",
        phase: "confirming",
        walletKey,
        walletName,
        amount: currentAmount,
      })
      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      setFlow(
        receipt?.status === "success"
          ? { step: "success", walletKey, txHash: hash }
          : {
              step: "error",
              walletKey,
              message: "The transaction reverted on Base.",
              retry: () => void donateWithConnector(connector),
            },
      )
    } catch (error) {
      setFlow({
        step: "error",
        walletKey,
        message: errorMessage(error),
        retry: () => void donateWithConnector(connector),
      })
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

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SPONSOR_USDC_ETH_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access denied; the address stays selectable as text.
    }
  }

  const flowFor = (walletKey: string) => {
    if (flow.step === "idle" || flow.walletKey !== walletKey) return null
    if (flow.step === "working") {
      const message =
        flow.phase === "connecting"
          ? `Opening ${flow.walletName}…`
          : flow.phase === "approving"
            ? `Approve the $${flow.amount} USDC payment in ${flow.walletName}…`
            : "Waiting for confirmation on Base…"
      return (
        <p className="minimal-wallet-flow" role="status">
          {message}
        </p>
      )
    }
    if (flow.step === "success") {
      return (
        <p className="minimal-wallet-flow" data-kind="success" role="status">
          Thank you for your support!
          {flow.txHash ? (
            <>
              {" "}
              <a
                href={`https://basescan.org/tx/${flow.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View transaction
              </a>
            </>
          ) : null}
        </p>
      )
    }
    return (
      <div className="minimal-wallet-error" role="alert">
        <span>{flow.message}</span>
        <span className="minimal-wallet-error-actions">
          {flow.retry ? (
            <button type="button" onClick={flow.retry}>
              Try again
            </button>
          ) : null}
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setFlow({ step: "idle" })}
          >
            <X aria-hidden />
          </button>
        </span>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className="minimal-secondary-button minimal-wallet-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="sponsor-usdc-panel"
      >
        <SiCircle className="minimal-sponsor-button-icon" aria-hidden />
        Donate with USDC
        <ChevronDown
          className="minimal-wallet-toggle-chevron"
          data-open={open}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="minimal-wallet-panel" id="sponsor-usdc-panel">
          <header className="minimal-wallet-panel-header">
            <div className="minimal-wallet-panel-heading">
              <h3>Donate USDC</h3>
              <span>USDC · Base network</span>
            </div>
            <button
              type="button"
              className="minimal-wallet-panel-close"
              aria-label="Close donation panel"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden />
            </button>
          </header>
          <section>
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
              <button
                type="button"
                className="minimal-wallet-amount-chip"
                data-selected={preset === null}
                onClick={selectCustom}
                disabled={busy}
              >
                Custom amount
              </button>
            </div>
            {preset === null ? (
              <label className="minimal-wallet-amount-inputrow">
                <span aria-hidden>$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="enter custom amount"
                  autoFocus
                  value={customAmount}
                  onChange={(event) => onCustomAmountChange(event.target.value)}
                  disabled={busy}
                  aria-label="Custom amount in US dollars"
                />
              </label>
            ) : null}
            {flowFor(AMOUNT_KEY)}
          </section>
          <section>
            <p className="minimal-wallet-panel-label">Choose a wallet</p>
            <div className="minimal-wallet-options">
              <button
                type="button"
                className="minimal-wallet-option"
                onClick={() => void donateWithBasePay()}
                disabled={busy}
              >
                <svg
                  className="minimal-wallet-option-icon"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="12" fill="#0052ff" />
                  <path
                    d="M12 6.5a5.5 5.5 0 1 0 5.42 6.45h-2.6a3 3 0 1 1 0-1.9h2.6A5.5 5.5 0 0 0 12 6.5Z"
                    fill="#fff"
                  />
                </svg>
                <span className="minimal-wallet-option-text">
                  Coinbase
                  <small>Opens the Coinbase website</small>
                </span>
                <ChevronRight
                  className="minimal-wallet-option-chevron"
                  aria-hidden
                />
              </button>
              {flowFor(BASE_PAY_KEY)}
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
                  <span className="minimal-wallet-option-text">
                    MetaMask
                    <small>Opens the MetaMask app</small>
                  </span>
                  <ChevronRight
                    className="minimal-wallet-option-chevron"
                    aria-hidden
                  />
                </button>
              ) : null}
              {walletOptions.map((connector) => (
                <div key={connector.uid} className="minimal-wallet-option-slot">
                  <button
                    type="button"
                    className="minimal-wallet-option"
                    onClick={() => void donateWithConnector(connector)}
                    disabled={busy}
                  >
                    <ConnectorIcon connector={connector} />
                    <span className="minimal-wallet-option-text">
                      {connector.name}
                      {connector.id === "walletConnect" ? (
                        <small>Rainbow, Trust &amp; more</small>
                      ) : null}
                    </span>
                    <ChevronRight
                      className="minimal-wallet-option-chevron"
                      aria-hidden
                    />
                  </button>
                  {flowFor(connector.uid)}
                </div>
              ))}
              <div className="minimal-wallet-option-slot">
                <button
                  type="button"
                  className="minimal-wallet-option"
                  onClick={() => setQrOpen((current) => !current)}
                  disabled={busy}
                  aria-expanded={qrOpen}
                  data-open={qrOpen}
                >
                  <QrCode className="minimal-wallet-option-icon" aria-hidden />
                  <span className="minimal-wallet-option-text">
                    QR code
                    <small>Scan with any wallet app</small>
                  </span>
                  <ChevronRight
                    className="minimal-wallet-option-chevron"
                    data-open={qrOpen}
                    aria-hidden
                  />
                </button>
                {qrOpen ? (
                  <div className="minimal-wallet-qr">
                    <div className="minimal-wallet-qr-code">
                      <QRCode
                        value={qrValue}
                        size={132}
                        bgColor="#ffffff"
                        fgColor="#0a0a0a"
                        aria-label="QR code for the USDC payment request"
                      />
                    </div>
                    <div className="minimal-wallet-qr-details">
                      <strong>Scan with any wallet</strong>
                      <span>
                        {amountValid
                          ? `$${amount} USDC on Base`
                          : "Amount must be entered in your wallet"}
                      </span>
                      <span className="minimal-wallet-qr-recipient">
                        Recipient: <code>{SPONSOR_USDC_ADDRESS_SHORT}</code>
                        <button
                          type="button"
                          className="minimal-wallet-copy"
                          onClick={copyAddress}
                          aria-label="Copy recipient address"
                        >
                          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </span>
                      <span className="minimal-wallet-qr-warning">
                        <TriangleAlert aria-hidden />
                        Send only USDC on the <strong>Base network</strong>
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
          <p className="minimal-wallet-note">
            <a
              href={SPONSOR_USDC_BASESCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on BaseScan
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
