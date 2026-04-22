'use client'

import { useEffect, useState } from "react"
import { getAvatarUrlFromLinks, getBlueskyHandleFromLinks, getPersonInitials } from "@/lib/person-avatar"

const blueskyAvatarCache = new Map<string, string>()
const blueskyAvatarRequests = new Map<string, Promise<string>>()

async function resolveBlueskyAvatarUrl(handle: string): Promise<string> {
  if (blueskyAvatarCache.has(handle)) {
    return blueskyAvatarCache.get(handle) ?? ""
  }

  const pendingRequest = blueskyAvatarRequests.get(handle)
  if (pendingRequest) {
    return pendingRequest
  }

  const request = fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { avatar?: string } | null) => {
      const resolvedAvatarUrl = data?.avatar ?? ""
      blueskyAvatarCache.set(handle, resolvedAvatarUrl)
      blueskyAvatarRequests.delete(handle)
      return resolvedAvatarUrl
    })
    .catch(() => {
      blueskyAvatarCache.set(handle, "")
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
  /** `blog`: smaller square avatar aligned with blog UI. `inline`: compact inline avatar. `default`: mission / sponsors. */
  variant?: keyof typeof VARIANT_STYLES
  /** Let callers preload avatars when a later section would otherwise lag on scroll. */
  loading?: "eager" | "lazy"
  /** Browser hint for avatar network priority. */
  fetchPriority?: "auto" | "high" | "low"
}) {
  const [avatarFailed, setAvatarFailed] = useState(false)
  const staticAvatarUrl = getAvatarUrlFromLinks(links)
  const bskyHandle = getBlueskyHandleFromLinks(links)
  const cachedBlueskyAvatarUrl = bskyHandle && blueskyAvatarCache.has(bskyHandle)
    ? (blueskyAvatarCache.get(bskyHandle) ?? "")
    : ""
  const [avatarUrl, setAvatarUrl] = useState(staticAvatarUrl || cachedBlueskyAvatarUrl)
  const initials = getPersonInitials(name)

  useEffect(() => {
    let cancelled = false
    setAvatarFailed(false)

    if (staticAvatarUrl) {
      setAvatarUrl(staticAvatarUrl)
      return () => {
        cancelled = true
      }
    }

    if (!bskyHandle) {
      setAvatarUrl("")
      return () => {
        cancelled = true
      }
    }

    if (blueskyAvatarCache.has(bskyHandle)) {
      setAvatarUrl(blueskyAvatarCache.get(bskyHandle) ?? "")
      return () => {
        cancelled = true
      }
    }

    resolveBlueskyAvatarUrl(bskyHandle)
      .then((resolvedAvatarUrl) => {
        if (cancelled) return
        setAvatarUrl(resolvedAvatarUrl)
      })
      .catch(() => {
        if (cancelled) return
        setAvatarUrl("")
      })

    return () => {
      cancelled = true
    }
  }, [bskyHandle, staticAvatarUrl])

  const styles = VARIANT_STYLES[variant]

  const inner =
    avatarUrl && !avatarFailed ? (
      <img
        src={avatarUrl}
        alt=""
        className={styles.img}
        referrerPolicy="no-referrer"
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onError={() => setAvatarFailed(true)}
      />
    ) : (
      <span className={styles.initials}>{initials}</span>
    )

  if (className) {
    return <span className={className}>{inner}</span>
  }

  return inner
}
