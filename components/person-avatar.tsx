'use client'

import { useEffect, useMemo, useState } from "react"
import {
  getAvatarUrlCandidates,
  getBlueskyHandleFromLinks,
  getPersonInitials,
} from "@/lib/person-avatar"

const blueskyAvatarCache = new Map<string, string>()
const blueskyAvatarRequests = new Map<string, Promise<string>>()

async function resolveBlueskyAvatarUrl(handle: string): Promise<string> {
  const cached = blueskyAvatarCache.get(handle)
  if (cached) {
    return cached
  }

  const pendingRequest = blueskyAvatarRequests.get(handle)
  if (pendingRequest) {
    return pendingRequest
  }

  const request = fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
  )
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { avatar?: string } | null) => {
      const resolvedAvatarUrl = data?.avatar ?? ""
      if (resolvedAvatarUrl) {
        blueskyAvatarCache.set(handle, resolvedAvatarUrl)
      }
      blueskyAvatarRequests.delete(handle)
      return resolvedAvatarUrl
    })
    .catch(() => {
      blueskyAvatarRequests.delete(handle)
      return ""
    })

  blueskyAvatarRequests.set(handle, request)
  return request
}

const VARIANT_STYLES = {
  default: {
    img: "h-6 w-6 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15",
    initials:
      "inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-[10px] font-semibold text-black/70 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/80 dark:ring-white/15",
  },
  inline: {
    img: "h-[1.05rem] w-[1.05rem] rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15",
    initials:
      "inline-flex h-[1.05rem] w-[1.05rem] items-center justify-center rounded-full bg-black/10 text-[8px] font-semibold text-black/70 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/80 dark:ring-white/15",
  },
  /** Square thumb, light border: matches blog listing covers and meta typography. */
  blog: {
    img: "h-5 w-5 rounded-sm object-cover",
    initials:
      "inline-flex h-5 w-5 items-center justify-center rounded-sm bg-black/[0.04] text-[9px] font-medium tracking-tight text-black/45 dark:bg-white/[0.06] dark:text-white/45",
  },
  research: {
    img: "h-11 w-11 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15 sm:h-10 sm:w-10",
    initials:
      "inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.06] text-sm font-semibold text-black/60 ring-1 ring-black/10 dark:bg-white/[0.08] dark:text-white/70 dark:ring-white/15 sm:h-10 sm:w-10",
  },
} as const

export function PersonAvatar({
  name,
  links,
  className,
  variant = "default",
  loading = "lazy",
  fetchPriority = "auto",
}: {
  name: string
  links: string[]
  /** Optional wrapper class (e.g. shrink-0). */
  className?: string
  /** `blog`: smaller square avatar aligned with blog UI. `inline`: compact inline avatar. `research`: larger research metadata avatar. */
  variant?: keyof typeof VARIANT_STYLES
  /** Let callers preload avatars when a later section would otherwise lag on scroll. */
  loading?: "eager" | "lazy"
  /** Browser hint for avatar network priority. */
  fetchPriority?: "auto" | "high" | "low"
}) {
  const staticCandidates = useMemo(() => getAvatarUrlCandidates(links), [links])
  const bskyHandle = getBlueskyHandleFromLinks(links)
  const [avatarCandidates, setAvatarCandidates] = useState<string[]>(staticCandidates)
  const [activeIndex, setActiveIndex] = useState(0)
  const [exhaustedCandidates, setExhaustedCandidates] = useState(false)
  const initials = getPersonInitials(name)

  useEffect(() => {
    let cancelled = false
    setActiveIndex(0)
    setExhaustedCandidates(false)
    setAvatarCandidates(staticCandidates)

    if (!bskyHandle) {
      return () => {
        cancelled = true
      }
    }

    const appendCandidate = (url: string) => {
      if (!url || cancelled) return
      setAvatarCandidates((current) => (current.includes(url) ? current : [...current, url]))
    }

    if (blueskyAvatarCache.has(bskyHandle)) {
      appendCandidate(blueskyAvatarCache.get(bskyHandle) ?? "")
      return () => {
        cancelled = true
      }
    }

    resolveBlueskyAvatarUrl(bskyHandle)
      .then(appendCandidate)
      .catch(() => {
        // Fall through to initials when every candidate fails.
      })

    return () => {
      cancelled = true
    }
  }, [bskyHandle, staticCandidates])

  const activeAvatarUrl = avatarCandidates[activeIndex]
  const styles = VARIANT_STYLES[variant]

  const handleImageError = () => {
    if (activeIndex < avatarCandidates.length - 1) {
      setActiveIndex((current) => current + 1)
      return
    }
    setExhaustedCandidates(true)
  }

  const inner =
    activeAvatarUrl && !exhaustedCandidates ? (
      <img
        key={activeAvatarUrl}
        src={activeAvatarUrl}
        alt=""
        className={styles.img}
        referrerPolicy="no-referrer"
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onError={handleImageError}
      />
    ) : (
      <span className={styles.initials}>{initials}</span>
    )

  if (className) {
    return <span className={className}>{inner}</span>
  }

  return inner
}
