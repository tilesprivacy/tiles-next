"use client"

import { useState } from "react"
import { SiCircle } from "react-icons/si"

export const SPONSOR_USDC_ETH_ADDRESS =
  "0xC0F5222FF322c99E6fE1C4b64fe55ED2E9b603bA"

export function SponsorUsdcDonateButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SPONSOR_USDC_ETH_ADDRESS)
      } else {
        const textarea = document.createElement("textarea")
        textarea.value = SPONSOR_USDC_ETH_ADDRESS
        textarea.setAttribute("readonly", "")
        textarea.style.position = "absolute"
        textarea.style.left = "-9999px"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      className="minimal-secondary-button"
      onClick={handleCopy}
      aria-label={
        copied
          ? "USDC Ethereum address copied"
          : "Copy USDC wallet address on Ethereum"
      }
      title="USDC on Ethereum"
    >
      <SiCircle className="minimal-sponsor-button-icon" aria-hidden />
      {copied ? "Address copied" : "Donate USDC"}
    </button>
  )
}
