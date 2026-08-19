"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ChevronDown } from "lucide-react"
import { SiEthereum, SiTether } from "react-icons/si"

export const SPONSOR_USDT_ETH_ADDRESS =
  "0x7d6ab3dbdf510d6669e72f0e27ada61bbad0821d" as const

export const SPONSOR_USDT_ETHERSCAN_URL = `https://etherscan.io/address/${SPONSOR_USDT_ETH_ADDRESS}`

// The wagmi/viem/WalletConnect/Coinbase stack behind the donate panel is by
// far the heaviest dependency on the site, and the panel only exists after a
// click — so it loads on demand instead of with the page.
const SponsorUsdtDonatePanel = dynamic(
  () => import("@/components/sponsor-usdt-donate-panel"),
  { ssr: false, loading: () => null },
)

const preloadPanel = () => {
  void import("@/components/sponsor-usdt-donate-panel")
}

export function SponsorUsdtDonateButton() {
  const [open, setOpen] = useState(false)
  // Once opened, the panel stays mounted (hidden via `open`) so amount and
  // flow state survive close/reopen, matching the pre-split behavior.
  const [everOpened, setEverOpened] = useState(false)

  // Fetch the panel chunk once the page is idle so the first tap opens the
  // panel within a frame (touch devices never fire the hover preload) while
  // keeping the wallet stack off the critical loading path.
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const idleHandle = window.requestIdleCallback(preloadPanel)
      return () => window.cancelIdleCallback(idleHandle)
    }
    const timeoutHandle = window.setTimeout(preloadPanel, 1500)
    return () => window.clearTimeout(timeoutHandle)
  }, [])

  return (
    <>
      <button
        type="button"
        className="minimal-secondary-button minimal-wallet-toggle"
        onClick={() => {
          setEverOpened(true)
          setOpen((current) => !current)
        }}
        onPointerEnter={preloadPanel}
        onFocus={preloadPanel}
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
      {everOpened ? <SponsorUsdtDonatePanel open={open} /> : null}
    </>
  )
}
