"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [isTestingMode, setIsTestingMode] = useState(false)

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
        if (data.isTestingMode) {
          setIsTestingMode(true)
        }
        throw new Error(data.error || "Failed to subscribe")
      }

      setStatus("success")
      setMessage("Welcome! Check your email for confirmation.")
      setEmail("")
      setIsTestingMode(false)

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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="text-sm"
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="h-9 rounded-md bg-black px-4 text-xs font-medium text-white hover:bg-black/90 disabled:opacity-50 lg:h-9 lg:px-4 lg:text-sm"
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Done!" : "Subscribe"}
          </Button>
        </div>
        {message && (
          <p
            className={`text-xs leading-relaxed ${status === "success" ? "text-black/60" : status === "error" && isTestingMode ? "text-black/60" : "text-black/60"}`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  )
}
