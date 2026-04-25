"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { triggerHaptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"

const linuxDistributions = ["Ubuntu", "Debian", "Arch Linux", "Fedora", "Red Hat Enterprise Linux (RHEL)", "Other"]

type FormStatus = "idle" | "loading" | "success" | "error"

export function LinuxNotifyForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [selectedDistributions, setSelectedDistributions] = useState<string[]>([])
  const [status, setStatus] = useState<FormStatus>("idle")
  const [message, setMessage] = useState("")

  const toggleDistribution = (distribution: string) => {
    setSelectedDistributions((current) =>
      current.includes(distribution) ? current.filter((item) => item !== distribution) : [...current, distribution],
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    triggerHaptic()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setStatus("error")
      setMessage("Email is required.")
      return
    }

    if (selectedDistributions.length === 0) {
      setStatus("error")
      setMessage("Select at least one Linux distribution.")
      return
    }

    setStatus("loading")
    setMessage("")

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: trimmedEmail,
      linuxDistributions: selectedDistributions,
      source: "linux-notify-form",
    }

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Could not submit the form.")
      }

      setStatus("success")
      setMessage("Thank you. We'll send you an email when the Codex app becomes available.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Could not submit the form.")
    }
  }

  const fieldClasses =
    "h-10 rounded-none border-black/15 bg-white text-sm shadow-none focus-visible:border-black/25 focus-visible:ring-black/10 dark:border-white/15 dark:bg-white/[0.04] dark:text-[#E6E6E6] dark:focus-visible:border-white/25 dark:focus-visible:ring-white/20"

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-5">
      <div className="flex gap-2.5 sm:gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor="linux-first-name" className="block text-xs font-medium text-foreground sm:text-sm">
            First name
          </label>
          <Input
            id="linux-first-name"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={status === "loading"}
            className={fieldClasses}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor="linux-last-name" className="block text-xs font-medium text-foreground sm:text-sm">
            Last name
          </label>
          <Input
            id="linux-last-name"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={status === "loading"}
            className={fieldClasses}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="linux-email" className="block text-xs font-medium text-foreground sm:text-sm">
          Email *
        </label>
        <Input
          id="linux-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "loading"}
          className={fieldClasses}
          required
        />
      </div>

      <fieldset className="space-y-2.5">
        <legend className="text-xs font-medium text-foreground sm:text-sm">
          Which Linux distribution do you use? *
        </legend>
        <p className="text-xs text-black/55 dark:text-white/55 sm:text-sm">Select all that apply</p>
        <div className="grid gap-2 sm:gap-3">
          {linuxDistributions.map((distribution) => (
            <label
              key={distribution}
              className="flex w-fit cursor-pointer items-center gap-2.5 text-sm leading-none text-foreground"
            >
              <input
                type="checkbox"
                checked={selectedDistributions.includes(distribution)}
                onChange={() => toggleDistribution(distribution)}
                disabled={status === "loading"}
                className="h-3.5 w-3.5 rounded border-black/35 bg-transparent text-foreground accent-foreground dark:border-white/35"
              />
              <span>{distribution}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="h-10 rounded-none bg-black px-6 text-sm font-medium text-white shadow-none hover:bg-black/90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-[#F2F2F2]"
        >
          {status === "loading" ? "Submitting..." : status === "success" ? "Submitted" : "Submit"}
        </Button>
        {message ? (
          <p
            role="status"
            aria-live="polite"
            className={cn(
              "text-sm leading-relaxed",
              status === "error" ? "text-red-700 dark:text-red-300" : "text-black/60 dark:text-white/60",
            )}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  )
}
