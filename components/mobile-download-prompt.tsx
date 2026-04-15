"use client"

import { CalendarPlus, Check, Link2, Monitor } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { triggerHaptic } from "@/lib/haptics"
import { FaArrowUpFromBracket } from "react-icons/fa6"

type DownloadIntentEvent = {
  preventDefault: () => void
}

const MOBILE_DOWNLOAD_PROMPT_SKIP_ATTRIBUTE = "data-skip-mobile-download-prompt"

function padTime(value: number): string {
  return value.toString().padStart(2, "0")
}

function toUtcIcsDate(date: Date): string {
  return [
    date.getUTCFullYear(),
    padTime(date.getUTCMonth() + 1),
    padTime(date.getUTCDate()),
    "T",
    padTime(date.getUTCHours()),
    padTime(date.getUTCMinutes()),
    padTime(date.getUTCSeconds()),
    "Z",
  ].join("")
}

function resolveReminderWindow(now: Date): { start: Date; end: Date } {
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const start = new Date(twoHoursFromNow)
  start.setMinutes(0, 0, 0)

  if (start.getTime() < twoHoursFromNow.getTime()) {
    start.setHours(start.getHours() + 1)
  }

  const end = new Date(start.getTime() + 15 * 60 * 1000)
  return { start, end }
}

function createReminderIcs(): { content: string; fileName: string } {
  const now = new Date()
  const { start, end } = resolveReminderWindow(now)
  const reminderUrl = "https://www.tiles.run"
  const createdAt = toUtcIcsDate(now)
  const startAt = toUtcIcsDate(start)
  const endAt = toUtcIcsDate(end)
  const uid = `tiles-desktop-reminder-${now.getTime()}@tiles.run`
  const fileName = `desktop-reminder-${start.getFullYear()}${padTime(start.getMonth() + 1)}${padTime(start.getDate())}.ics`

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tiles//Desktop Reminder//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${createdAt}`,
    `DTSTART:${startAt}`,
    `DTEND:${endAt}`,
    "SUMMARY:Download Tiles on your computer",
    `DESCRIPTION:Continue on desktop. Open ${reminderUrl}`,
    `URL:${reminderUrl}`,
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Download Tiles on desktop",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return { content, fileName }
}

function isLikelyMobileDevice(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const userAgent = window.navigator.userAgent
  const matchesMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
  const isSmallViewport = window.matchMedia("(max-width: 1024px)").matches

  return matchesMobileUa || (isCoarsePointer && isSmallViewport)
}

interface MobileDownloadPromptOverlayProps {
  isOpen: boolean
  onClose: () => void
  targetUrl: string
}

function MobileDownloadPromptOverlay({ isOpen, onClose, targetUrl }: MobileDownloadPromptOverlayProps) {
  const [isCopyConfirmed, setIsCopyConfirmed] = useState(false)
  const closePrompt = useCallback(() => {
    triggerHaptic()
    onClose()
  }, [onClose])

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

  const onShare = useCallback(async () => {
    triggerHaptic()
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tiles",
          text: "Open this download page on desktop.",
          url: targetUrl,
        })
        return
      } catch {
        // If sharing is canceled or fails, keep the prompt open with no extra action.
      }
    }

    try {
      await navigator.clipboard.writeText(targetUrl)
      setIsCopyConfirmed(true)
      window.setTimeout(() => setIsCopyConfirmed(false), 2000)
    } catch {}
  }, [targetUrl])

  const onCopyLink = useCallback(async () => {
    triggerHaptic()
    try {
      await navigator.clipboard.writeText(targetUrl)
      setIsCopyConfirmed(true)
      window.setTimeout(() => setIsCopyConfirmed(false), 2000)
    } catch {}
  }, [targetUrl])

  const onRemind = useCallback(() => {
    triggerHaptic()
    const { content, fileName } = createReminderIcs()
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" })
    const blobUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = blobUrl
    anchor.download = fileName
    anchor.rel = "noopener noreferrer"
    anchor.click()
    window.setTimeout(() => {
      URL.revokeObjectURL(blobUrl)
    }, 1000)
  }, [])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end bg-background/55 text-foreground backdrop-blur-[2px] dark:bg-background/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-download-prompt-title"
      onClick={closePrompt}
    >
      <div className="w-full px-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
        <div
          className="mx-auto w-full max-w-2xl rounded-sm bg-card/65 px-4 pb-4 pt-5 backdrop-blur-2xl dark:bg-card/55"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full text-foreground">
            <Monitor className="h-5 w-5" aria-hidden />
          </div>
          <h2 id="mobile-download-prompt-title" className="text-center text-[2.35rem] font-medium leading-tight tracking-[-0.015em]">
            Get Tiles for Desktop
          </h2>
          <p className="mt-2 text-center text-[1.03rem] leading-relaxed text-muted-foreground">
            Tiles is available only on desktop at this time. Wanna share the link to your computer or save it for
            later?
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={onShare}
              className="flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-sm bg-secondary/65 px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              <FaArrowUpFromBracket className="h-5 w-5" aria-hidden />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={onCopyLink}
              className="flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-sm bg-secondary/65 px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              {isCopyConfirmed ? <Check className="h-5 w-5" aria-hidden /> : <Link2 className="h-5 w-5" aria-hidden />}
              <span>Copy link</span>
            </button>
            <button
              type="button"
              onClick={onRemind}
              className="flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-sm bg-secondary/65 px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              <CalendarPlus className="h-5 w-5" aria-hidden />
              <span>Remind</span>
            </button>
          </div>

          <button
            type="button"
            onClick={closePrompt}
            className="mt-4 w-full rounded-sm bg-foreground py-3 text-base font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function useMobileDownloadPrompt() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isLikelyMobileDevice())
  }, [])

  const targetUrl = "https://www.tiles.run"

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
      <MobileDownloadPromptOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} targetUrl={targetUrl} />
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
        url.origin === window.location.origin && (url.pathname === "/download" || url.pathname.startsWith("/download/"))
      const isDownloadHost = url.hostname === "download.tiles.run"
      const hasDownloadAttribute = anchor.hasAttribute("download")

      if (!isSameOriginDownloadRoute && !isDownloadHost && !hasDownloadAttribute) {
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
      targetUrl="https://www.tiles.run"
    />
  )
}
