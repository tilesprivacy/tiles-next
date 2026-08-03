"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getPaymentStatus, pay } from "@base-org/account"
import { Wallet } from "lucide-react"
import { SiCircle } from "react-icons/si"
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
import { coinbaseWallet, walletConnect } from "wagmi/connectors"
import type { Connector } from "wagmi"

export const SPONSOR_USDC_ETH_ADDRESS =
  "0x7d6ab3dbdf510d6669e72f0e27ada61bbad0821d" as const

export const SPONSOR_USDC_DONATION_AMOUNT = "5.00"

// Native USDC on Base mainnet (6 decimals).
const BASE_USDC_ADDRESS =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({ appName: "Tiles Privacy", preference: { options: "all" } }),
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId })]
      : []),
  ],
  transports: { [base.id]: http() },
  ssr: true,
})

const queryClient = new QueryClient()

type DonationState =
  | "idle"
  | "connecting"
  | "paying"
  | "confirming"
  | "success"
  | "error"

const STATE_LABELS: Record<DonationState, string> = {
  idle: "Donate USDC",
  connecting: "Connecting wallet…",
  paying: "Confirm in wallet…",
  confirming: "Processing…",
  success: "Thank you!",
  error: "Payment failed — retry",
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

function DonateMenu() {
  const [state, setState] = useState<DonationState>("idle")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const account = useAccount()
  const { connectors, connectAsync } = useConnect()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient({ chainId: base.id })

  const busy =
    state === "connecting" || state === "paying" || state === "confirming"

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const scheduleReset = useCallback((delay: number) => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setState("idle"), delay)
  }, [])

  const donateWithBasePay = async () => {
    setOpen(false)
    setState("paying")
    try {
      const payment = await pay({
        amount: SPONSOR_USDC_DONATION_AMOUNT,
        to: SPONSOR_USDC_ETH_ADDRESS,
      })
      setState("confirming")
      const completed = await waitForBasePayCompletion(payment.id)
      setState(completed ? "success" : "error")
      scheduleReset(5000)
    } catch {
      setState("error")
      scheduleReset(4000)
    }
  }

  const donateWithConnector = async (connector: Connector) => {
    setOpen(false)
    setState("connecting")
    try {
      let chainId = account.chainId
      if (!account.isConnected || account.connector?.uid !== connector.uid) {
        const connection = await connectAsync({ connector, chainId: base.id })
        chainId = connection.chainId
      }
      if (chainId !== base.id) {
        await switchChainAsync({ chainId: base.id })
      }
      setState("paying")
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: BASE_USDC_ADDRESS,
        functionName: "transfer",
        args: [
          SPONSOR_USDC_ETH_ADDRESS,
          parseUnits(SPONSOR_USDC_DONATION_AMOUNT, 6),
        ],
        chainId: base.id,
      })
      setState("confirming")
      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      setState(receipt?.status === "success" ? "success" : "error")
      scheduleReset(5000)
    } catch {
      setState("error")
      scheduleReset(4000)
    }
  }

  // The Coinbase Wallet browser extension announces itself via EIP-6963 too;
  // keep only the configured SDK connector so it isn't listed twice.
  const walletOptions = connectors.filter(
    (connector) => connector.id !== "com.coinbase.wallet",
  )

  return (
    <div className="minimal-wallet-donate" ref={containerRef}>
      <button
        type="button"
        className="minimal-secondary-button"
        onClick={() => {
          if (!busy) setOpen((current) => !current)
        }}
        disabled={busy}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Donate $${SPONSOR_USDC_DONATION_AMOUNT} USDC on Base`}
      >
        <SiCircle className="minimal-sponsor-button-icon" aria-hidden />
        {STATE_LABELS[state]}
      </button>
      {open ? (
        <div className="minimal-wallet-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className="minimal-wallet-menu-item"
            onClick={donateWithBasePay}
          >
            <span
              className="minimal-wallet-menu-icon minimal-wallet-menu-icon-base"
              aria-hidden
            />
            Base Pay
            <small>No wallet needed</small>
          </button>
          {walletOptions.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              role="menuitem"
              className="minimal-wallet-menu-item"
              onClick={() => donateWithConnector(connector)}
            >
              {connector.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="minimal-wallet-menu-icon"
                  src={connector.icon}
                  alt=""
                  aria-hidden
                />
              ) : (
                <Wallet className="minimal-wallet-menu-icon" aria-hidden />
              )}
              {connector.name}
              {connector.id === "walletConnect" ? (
                <small>Rainbow, Trust…</small>
              ) : null}
            </button>
          ))}
          <p className="minimal-wallet-menu-note">
            ${SPONSOR_USDC_DONATION_AMOUNT} USDC on Base
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function SponsorUsdcDonateButton() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DonateMenu />
      </QueryClientProvider>
    </WagmiProvider>
  )
}
