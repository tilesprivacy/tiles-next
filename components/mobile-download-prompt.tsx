"use client"

import { Mail, Monitor } from "lucide-react"
import type { FormEvent } from "react"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { triggerHaptic } from "@/lib/haptics"

type DownloadIntentEvent = {
  preventDefault: () => void
}

const MOBILE_DOWNLOAD_PROMPT_SKIP_ATTRIBUTE = "data-skip-mobile-download-prompt"

function isLikelyMobileDevice(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const userAgent = window.navigator.userAgent
  const matchesMobileUa =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
      userAgent,
    )
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
  const isSmallViewport = window.matchMedia("(max-width: 1024px)").matches

  return matchesMobileUa || (isCoarsePointer && isSmallViewport)
}

interface MobileDownloadPromptOverlayProps {
  isOpen: boolean
  onClose: () => void
}

function MobileDownloadPromptOverlay({
  isOpen,
  onClose,
}: MobileDownloadPromptOverlayProps) {
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [emailMessage, setEmailMessage] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const emailInputId = "mobile-download-email"
  const closePrompt = useCallback(() => {
    triggerHaptic()
    onClose()
  }, [onClose])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isOpen, onClose])

  const onEmailSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      triggerHaptic()

      const trimmedEmail = email.trim()
      if (!trimmedEmail) {
        setEmailStatus("error")
        setEmailMessage("Enter an email address.")
        return
      }

      setEmailStatus("loading")
      setEmailMessage("")

      try {
        const response = await fetch("/api/send-download-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: trimmedEmail }),
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Unable to send the download link.")
        }

        setEmailStatus("success")
        setEmailMessage("Sent. Check your inbox on desktop.")
      } catch (error) {
        setEmailStatus("error")
        setEmailMessage(
          error instanceof Error
            ? error.message
            : "Unable to send the download link.",
        )
      }
    },
    [email],
  )

  const onEmailChange = useCallback(
    (value: string) => {
      setEmail(value)
      if (emailStatus !== "idle") {
        setEmailStatus("idle")
        setEmailMessage("")
      }
    },
    [emailStatus],
  )

  if (!isOpen || !isMounted) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex h-[100dvh] items-end overflow-hidden bg-background/55 text-foreground backdrop-blur-[2px] dark:bg-background/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-download-prompt-title"
      onClick={closePrompt}
    >
      <div className="w-full px-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
        <div
          className="mx-auto w-full max-w-2xl rounded-sm bg-card px-4 pb-4 pt-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full text-foreground/90">
            <Monitor className="h-5 w-5" aria-hidden />
          </div>
          <h2
            id="mobile-download-prompt-title"
            className="text-center text-[2.15rem] font-medium leading-tight tracking-[-0.015em]"
          >
            Get Tiles for Desktop
          </h2>
          <p className="mx-auto mt-2 max-w-[26ch] text-center text-[1.02rem] leading-relaxed text-muted-foreground">
            Tiles is desktop-only for now.
            <br />
            Send yourself the download link.
          </p>

          <form
            onSubmit={onEmailSubmit}
            className="mt-5"
          >
            <label
              htmlFor={emailInputId}
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email address
            </label>
            <div className="flex flex-col gap-2.5">
              <input
                id={emailInputId}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => onEmailChange(event.target.value)}
                disabled={
                  emailStatus === "loading" || emailStatus === "success"
                }
                className="min-h-11 min-w-0 w-full rounded-sm border border-border bg-background px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/75 focus:border-foreground/35 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={
                  emailStatus === "loading" || emailStatus === "success"
                }
                className="min-h-12 w-full rounded-sm bg-foreground px-4 text-base font-semibold text-background shadow-[0_6px_20px_rgba(0,0,0,0.28)] transition-colors hover:bg-foreground/90 disabled:opacity-60"
              >
                {emailStatus === "loading"
                  ? "Sending"
                  : emailStatus === "success"
                    ? "Sent"
                    : "Send download link"}
              </button>
            </div>
            {emailMessage ? (
              <p
                role="status"
                aria-live="polite"
                className={`mt-2 text-xs leading-relaxed ${
                  emailStatus === "error"
                    ? "text-red-600 dark:text-red-300"
                    : "text-muted-foreground"
                }`}
              >
                {emailMessage}
              </p>
            ) : null}
          </form>

          <button
            type="button"
            onClick={closePrompt}
            className="mt-2 w-full rounded-sm py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function useMobileDownloadPrompt() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isLikelyMobileDevice())
  }, [])

  const openMobileDownloadPrompt = useCallback(
    (event?: DownloadIntentEvent) => {
      if (!isMobile) {
        return false
      }

      event?.preventDefault()
      triggerHaptic()
      setIsOpen(true)
      return true
    },
    [isMobile],
  )

  return {
    openMobileDownloadPrompt,
    mobileDownloadPrompt: (
      <MobileDownloadPromptOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    ),
  }
}

export function GlobalMobileDownloadPrompt() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsMobile(isLikelyMobileDevice())
  }, [])

  useEffect(() => {
    if (!isMobile) {
      return
    }

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      const anchor = target.closest("a")
      if (!anchor) {
        return
      }

      if (anchor.hasAttribute(MOBILE_DOWNLOAD_PROMPT_SKIP_ATTRIBUTE)) {
        return
      }

      const rawHref = anchor.getAttribute("href")
      if (!rawHref) {
        return
      }

      let url: URL
      try {
        url = new URL(rawHref, window.location.origin)
      } catch {
        return
      }

      const isSameOriginDownloadRoute =
        url.origin === window.location.origin &&
        (url.pathname === "/download" || url.pathname.startsWith("/download/"))
      const isDownloadHost = url.hostname === "download.tiles.run"
      const hasDownloadAttribute = anchor.hasAttribute("download")

      if (
        !isSameOriginDownloadRoute &&
        !isDownloadHost &&
        !hasDownloadAttribute
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      triggerHaptic()
      setIsOpen(true)
    }

    document.addEventListener("click", onDocumentClick, true)
    return () => {
      document.removeEventListener("click", onDocumentClick, true)
    }
  }, [isMobile])

  return (
    <MobileDownloadPromptOverlay
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  )
}
