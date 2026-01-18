"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

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

  // Theme-aware colors - matching book dark theme (#121212 bg, #E6E6E6 text)
  const inputBg = isDark ? '!bg-[#1a1a1a]' : '!bg-white'
  const inputText = isDark ? '!text-[#E6E6E6]' : '!text-black'
  const inputPlaceholder = isDark ? 'placeholder:!text-[#8A8A8A]' : 'placeholder:!text-black/50'
  const buttonBg = isDark ? 'bg-white' : 'bg-black'
  const buttonText = isDark ? 'text-black' : 'text-white'
  const buttonHover = isDark ? 'hover:bg-white/90' : 'hover:bg-black/90'
  const messageColor = isDark ? 'text-[#B3B3B3]' : 'text-black/60'

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
            className={`text-sm ${inputBg} ${inputText} ${inputPlaceholder} selection:!bg-blue-500 selection:!text-white`}
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`h-9 rounded-md ${buttonBg} px-4 text-xs font-medium ${buttonText} ${buttonHover} disabled:opacity-50 lg:h-9 lg:px-4 lg:text-sm`}
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Done!" : "Subscribe"}
          </Button>
        </div>
        {message && (
          <p
            className={`text-xs leading-relaxed ${messageColor}`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  )
}
