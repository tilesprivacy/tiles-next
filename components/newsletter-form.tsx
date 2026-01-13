"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setMessage("Please enter your email")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Show the actual error message from the API
        const errorMsg = data.error || data.message || "Failed to subscribe"
        throw new Error(errorMsg)
      }

      setStatus("success")
      setMessage("Welcome! Check your email for confirmation.")
      setEmail("")

      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong")

      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 5000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow Cmd+A / Ctrl+A to select all text
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault()
      e.currentTarget.select()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={status === "loading"}
            className="text-sm !bg-background !text-foreground placeholder:!text-foreground/50 selection:!bg-blue-500 selection:!text-white"
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="h-9 rounded-md bg-foreground px-4 text-xs font-medium text-background hover:bg-foreground/90 disabled:opacity-50 lg:h-9 lg:px-4 lg:text-sm"
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Done!" : "Subscribe"}
          </Button>
        </div>
        {message && (
          <p
            className={`text-xs leading-relaxed ${status === "success" ? "text-foreground/60" : "text-foreground/60"}`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  )
}
