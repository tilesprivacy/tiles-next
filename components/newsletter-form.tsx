"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTheme } from 'next-themes'
import { cn } from "@/lib/utils"
import Script from "next/script"

interface NewsletterFormProps {
  surface?: "auto" | "light" | "dark"
  className?: string
}

export default function NewsletterForm({ surface = "auto", className }: NewsletterFormProps) {
  const emailInputId = "newsletter-email-input"
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [subscriberEmail, setSubscriberEmail] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = surface === "auto" ? mounted && resolvedTheme === "dark" : surface === "dark"

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
      setSubscriberEmail(email.trim())
      setSenderEmail(data.senderEmail || "")
      setEmail("")

      setTimeout(() => {
        setStatus("idle")
        setMessage("")
        setSubscriberEmail("")
        setSenderEmail("")
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

  const inputClasses = isDark
    ? "!h-10 !bg-[#151515] !border-[#303030] !text-[#E6E6E6] placeholder:!text-[#8A8A8A] focus-visible:!ring-white/20 focus-visible:!border-white/25"
    : "!h-10 !bg-white !border-black/15 !text-black placeholder:!text-black/45 focus-visible:!ring-black/10 focus-visible:!border-black/25"

  const buttonClasses = isDark
    ? "!h-10 !bg-white !text-black hover:!bg-[#F2F2F2] focus-visible:!ring-white/30"
    : "!h-10 !bg-black !text-white hover:!bg-black/90 focus-visible:!ring-black/20"

  const messageClasses =
    status === "error"
      ? isDark
        ? "text-red-300"
        : "text-red-700"
      : isDark
        ? "text-[#B3B3B3]"
        : "text-black/65"

  return (
    <>
      <Script src="https://sniperl.ink/v1/sniper-link.js" strategy="lazyOnload" />
      <form 
        onSubmit={handleSubmit} 
        className={cn("w-full", className)}
        data-theme={isDark ? "dark" : "light"}
      >
        <div className="space-y-2.5">
          <label htmlFor={emailInputId} className="sr-only">
            Email address
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              id={emailInputId}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={status === "loading"}
              className={cn(
                "text-sm selection:!bg-blue-500 selection:!text-white",
                inputClasses,
              )}
            />
            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className={cn(
                "w-full rounded-md px-5 text-sm font-medium disabled:opacity-50 sm:w-auto",
                buttonClasses,
              )}
            >
              {status === "loading" ? "Subscribing..." : status === "success" ? "Done!" : "Subscribe"}
            </Button>
          </div>
          {status === "success" && subscriberEmail && senderEmail && (
            <div className="flex justify-center sm:justify-start">
              <sniper-link
                recipient={subscriberEmail}
                sender={senderEmail}
                template="Open in {provider}"
                className="sniper-link-wrapper"
              />
            </div>
          )}
          {message && (
            <p
              role="status"
              aria-live="polite"
              className={cn("text-xs leading-relaxed", messageClasses)}
            >
              {message}
            </p>
          )}
        </div>
      </form>
    </>
  )
}
