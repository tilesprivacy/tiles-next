"use client"

import { useEffect, useRef, useState } from "react"
import { getPaymentStatus, pay } from "@base-org/account"
import { SiCircle } from "react-icons/si"

export const SPONSOR_USDC_ETH_ADDRESS =
  "0x7d6ab3dbdf510d6669e72f0e27ada61bbad0821d"

export const SPONSOR_USDC_DONATION_AMOUNT = "5.00"

type DonationState = "idle" | "paying" | "confirming" | "success" | "error"

const STATE_LABELS: Record<DonationState, string> = {
  idle: "Donate USDC",
  paying: "Confirm in wallet…",
  confirming: "Processing…",
  success: "Thank you!",
  error: "Payment failed — retry",
}

async function waitForPaymentCompletion(id: string) {
  for (let attempt = 0; attempt < 15; attempt++) {
    const { status } = await getPaymentStatus({ id })
    if (status === "completed") return true
    if (status === "failed") return false
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  // Still pending after polling; the payment was submitted, so treat as success.
  return true
}

export function SponsorUsdcDonateButton() {
  const [state, setState] = useState<DonationState>("idle")
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const scheduleReset = (delay: number) => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setState("idle"), delay)
  }

  const handleDonate = async () => {
    if (state === "paying" || state === "confirming") return
    setState("paying")
    try {
      const payment = await pay({
        amount: SPONSOR_USDC_DONATION_AMOUNT,
        to: SPONSOR_USDC_ETH_ADDRESS,
      })
      setState("confirming")
      const completed = await waitForPaymentCompletion(payment.id)
      setState(completed ? "success" : "error")
      scheduleReset(5000)
    } catch {
      setState("error")
      scheduleReset(4000)
    }
  }

  return (
    <button
      type="button"
      className="minimal-secondary-button"
      onClick={handleDonate}
      disabled={state === "paying" || state === "confirming"}
      aria-label={`Donate $${SPONSOR_USDC_DONATION_AMOUNT} USDC on Base`}
      title={`One-click $${SPONSOR_USDC_DONATION_AMOUNT} USDC donation on Base`}
    >
      <SiCircle className="minimal-sponsor-button-icon" aria-hidden />
      {STATE_LABELS[state]}
    </button>
  )
}
