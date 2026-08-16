"use client"

import { useCallback, useState, type MouseEvent } from "react"
import { useTheme } from "next-themes"
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed"
import type { PolarCheckoutMode } from "@/lib/polar"
import { isDarkResolvedTheme } from "@/lib/site-theme"

/**
 * Subscribe action for Tiles Pro, opening Polar's embedded checkout in an
 * overlay instead of navigating away.
 *
 * The anchor keeps a real `href` so the flow degrades to a full page checkout
 * when JavaScript is unavailable: the public checkout link in `link` mode, and
 * the redirecting `/api/polar/checkout/pro` route in `session` mode.
 */
export function PolarSubscribeButton({
  mode,
  label,
  className,
}: {
  mode: Extract<PolarCheckoutMode, { kind: "link" } | { kind: "session" }>
  label: string
  className?: string
}) {
  const { resolvedTheme } = useTheme()
  const [isOpening, setIsOpening] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  const fallbackHref =
    mode.kind === "link" ? mode.url : "/api/polar/checkout/pro"

  const openCheckout = useCallback(
    async (event: MouseEvent<HTMLAnchorElement>) => {
      // Let modified clicks (new tab, etc.) behave normally.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
        return
      }

      event.preventDefault()
      if (isOpening) return

      setIsOpening(true)
      setHasFailed(false)

      try {
        let url = mode.kind === "link" ? mode.url : null

        if (!url) {
          const response = await fetch("/api/polar/checkout/session", {
            method: "POST",
          })
          if (!response.ok) {
            throw new Error(`checkout session request failed: ${response.status}`)
          }
          const data: { url?: string } = await response.json()
          url = data.url ?? null
        }

        if (!url) throw new Error("checkout session returned no url")

        await PolarEmbedCheckout.create(url, {
          theme: isDarkResolvedTheme(resolvedTheme) ? "dark" : "light",
        })
      } catch (error) {
        console.error("[polar] could not open embedded checkout", error)
        setHasFailed(true)
      } finally {
        setIsOpening(false)
      }
    },
    [isOpening, mode, resolvedTheme],
  )

  return (
    <>
      <a
        href={fallbackHref}
        onClick={openCheckout}
        aria-busy={isOpening || undefined}
        className={className}
      >
        {isOpening ? "Opening checkout" : label}
      </a>
      {hasFailed ? (
        <p role="alert" className="mt-2 text-xs leading-5 text-red-600 dark:text-red-400">
          Could not open checkout.{" "}
          <a href={fallbackHref} className="underline underline-offset-4">
            Open it in a new page
          </a>
          .
        </p>
      ) : null}
    </>
  )
}
