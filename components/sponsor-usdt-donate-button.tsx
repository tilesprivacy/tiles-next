"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
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
import { SiEthereum, SiTether, SiWalletconnect } from "react-icons/si"
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
import { mainnet } from "wagmi/chains"
import { coinbaseWallet, walletConnect } from "wagmi/connectors"
import type { Connector } from "wagmi"

export const SPONSOR_USDT_ETH_ADDRESS =
  "0x7d6ab3dbdf510d6669e72f0e27ada61bbad0821d" as const

export const SPONSOR_USDT_ETHERSCAN_URL = `https://etherscan.io/address/${SPONSOR_USDT_ETH_ADDRESS}`

const SPONSOR_USDT_ADDRESS_SHORT = `${SPONSOR_USDT_ETH_ADDRESS.slice(0, 6)}…${SPONSOR_USDT_ETH_ADDRESS.slice(-4)}`

// USDT (Tether) on Ethereum mainnet (6 decimals).
const ETHEREUM_USDT_ADDRESS =
  "0xdAC17F958D2ee523a2206206994597C13D831ec7" as const

const PRESET_AMOUNTS = ["5", "10", "25", "100"]
const DEFAULT_AMOUNT = "10"

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    coinbaseWallet({ appName: "Tiles Privacy", preference: { options: "all" } }),
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId })]
      : []),
  ],
  transports: { [mainnet.id]: http() },
  ssr: true,
})

const queryClient = new QueryClient()

// The Coinbase extension announces itself via EIP-6963 too; hide it so it
// isn't listed twice next to the configured Coinbase connector.
const HIDDEN_DISCOVERED_IDS = new Set(["com.coinbase.wallet"])
const METAMASK_IDS = new Set(["io.metamask", "io.metamask.mobile"])
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

function CoinbaseIcon() {
  return (
    <svg className="minimal-wallet-option-icon" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#0052ff" />
      <path
        d="M12 6.5a5.5 5.5 0 1 0 5.42 6.45h-2.6a3 3 0 1 1 0-1.9h2.6A5.5 5.5 0 0 0 12 6.5Z"
        fill="#fff"
      />
    </svg>
  )
}

function ConnectorIcon({ connector }: { connector: Connector }) {
  const className = "minimal-wallet-option-icon"
  if (connector.id === "coinbaseWalletSDK") {
    return <CoinbaseIcon />
  }
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
  const publicClient = usePublicClient({ chainId: mainnet.id })

  const busy = flow.step === "working"

  const amount = preset ?? customAmount
  const amountValid = /^\d+(\.\d{1,2})?$/.test(amount) && Number(amount) > 0

  // EIP-681 payment request: USDT contract on Ethereum mainnet (chain 1),
  // recipient, and the amount in token units, so scanning pre-fills the whole
  // transfer. Without a valid amount, fall back to the bare address (maximum
  // scanner compatibility) and tell the donor to enter the amount in their
  // wallet.
  const qrValue = amountValid
    ? `ethereum:${ETHEREUM_USDT_ADDRESS}@1/transfer?address=${SPONSOR_USDT_ETH_ADDRESS}&uint256=${parseUnits(amount, 6).toString()}`
    : SPONSOR_USDT_ETH_ADDRESS

  const clearTransientFlow = () => {
    if (flow.step === "error" || flow.step === "success") {
      setFlow({ step: "idle" })
    }
  }

  const selectPreset = (value: string) => {
    setPreset(value)
    setCustomAmount("")
    clearTransientFlow()
  }

  const onCustomAmountChange = (value: string) => {
    if (value !== "" && !/^\d*(\.\d{0,2})?$/.test(value)) return
    setPreset(null)
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

  const donateWithConnector = async (connector: Connector) => {
    if (busy || !requireAmount()) return
    const currentAmount = amount
    const walletKey = connector.uid
    const walletName = connector.id === "coinbaseWalletSDK" ? "Coinbase" : connector.name
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
        const connection = await connectAsync({
          connector,
          chainId: mainnet.id,
        })
        chainId = connection.chainId
      }
      if (chainId !== mainnet.id) {
        await switchChainAsync({ chainId: mainnet.id })
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
        address: ETHEREUM_USDT_ADDRESS,
        functionName: "transfer",
        args: [SPONSOR_USDT_ETH_ADDRESS, parseUnits(currentAmount, 6)],
        chainId: mainnet.id,
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
              message: "The transaction reverted on Ethereum.",
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

  // Coinbase first, then MetaMask (extension when installed), then other
  // detected extension wallets, with WalletConnect (if configured) last.
  const coinbaseConnector = connectors.find(
    (connector) => connector.id === "coinbaseWalletSDK",
  )
  const metaMaskConnector = connectors.find((connector) =>
    METAMASK_IDS.has(connector.id),
  )
  const walletOptions = [
    ...(coinbaseConnector ? [coinbaseConnector] : []),
    ...(metaMaskConnector ? [metaMaskConnector] : []),
    ...connectors.filter(
      (connector) =>
        connector.id !== "walletConnect" &&
        connector.id !== "coinbaseWalletSDK" &&
        !METAMASK_IDS.has(connector.id) &&
        !HIDDEN_DISCOVERED_IDS.has(connector.id),
    ),
    ...connectors.filter((connector) => connector.id === "walletConnect"),
  ]

  const optionDescription = (connector: Connector) => {
    if (connector.id === "coinbaseWalletSDK") return "Opens the Coinbase website"
    if (connector.id === "walletConnect") return "Rainbow, Trust & more"
    return null
  }

  // Without the extension, hand off to the MetaMask app's in-app browser,
  // where the page reloads with MetaMask available as an injected wallet.
  const openInMetaMaskApp = () => {
    if (busy) return
    const { host, pathname } = window.location
    window.location.href = `https://metamask.app.link/dapp/${host}${pathname}`
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SPONSOR_USDT_ETH_ADDRESS)
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
            ? `Approve the $${flow.amount} USDT payment in ${flow.walletName}…`
            : "Waiting for confirmation on Ethereum…"
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
                href={`https://etherscan.io/tx/${flow.txHash}`}
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
        aria-controls="sponsor-usdt-panel"
      >
        <span className="minimal-wallet-button-token" aria-hidden>
          <SiTether className="minimal-sponsor-button-icon" />
          <SiEthereum className="minimal-wallet-button-token-eth" />
        </span>
        Donate with USDT
        <ChevronDown
          className="minimal-wallet-toggle-chevron"
          data-open={open}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="minimal-wallet-panel" id="sponsor-usdt-panel">
          <header className="minimal-wallet-panel-header">
            <div className="minimal-wallet-panel-heading">
              <h3>Donate with USDT</h3>
              <span className="minimal-wallet-panel-warning">
                <TriangleAlert aria-hidden />
                Send only USDT on the <strong>Ethereum network</strong>
              </span>
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
              <label
                className="minimal-wallet-amount-inputrow"
                data-selected={preset === null}
              >
                <span aria-hidden>$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="enter custom amount"
                  value={customAmount}
                  onChange={(event) => onCustomAmountChange(event.target.value)}
                  onFocus={() => setPreset(null)}
                  disabled={busy}
                  aria-label="Custom amount in US dollars"
                />
              </label>
            </div>
            {flowFor(AMOUNT_KEY)}
          </section>
          <section>
            <p className="minimal-wallet-panel-label">Choose a wallet</p>
            <div className="minimal-wallet-options">
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
                      {connector.id === "coinbaseWalletSDK"
                        ? "Coinbase"
                        : connector.name}
                      {optionDescription(connector) ? (
                        <small>{optionDescription(connector)}</small>
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
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#0a0a0a"
                        aria-label="QR code for the USDT payment request"
                      />
                      <span className="minimal-wallet-qr-logo" aria-hidden>
                        <SiTether />
                        <span className="minimal-wallet-qr-logo-eth">
                          <SiEthereum />
                        </span>
                      </span>
                    </div>
                    <div className="minimal-wallet-qr-details">
                      <strong>Scan with any wallet</strong>
                      <span>
                        {amountValid
                          ? `$${amount} USDT on Ethereum`
                          : "Amount must be entered in your wallet"}
                      </span>
                      <span className="minimal-wallet-qr-recipient">
                        Recipient: <code>{SPONSOR_USDT_ADDRESS_SHORT}</code>
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
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
          <p className="minimal-wallet-note">
            <a
              href={SPONSOR_USDT_ETHERSCAN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Etherscan
            </a>
          </p>
        </div>
      ) : null}
    </>
  )
}

export function SponsorUsdtDonateButton() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DonatePanel />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
