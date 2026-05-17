const AVATAR_LINK_PRIORITY = ["github.com", "x.com", "twitter.com", "bsky.app", "reddit.com"] as const

function sortLinksByAvatarPriority(links: string[]): string[] {
  return [...links].sort((a, b) => {
    const aRank = AVATAR_LINK_PRIORITY.findIndex((host) => a.includes(host))
    const bRank = AVATAR_LINK_PRIORITY.findIndex((host) => b.includes(host))
    const aScore = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank
    const bScore = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank
    return aScore - bScore
  })
}

function collectAvatarUrlsFromLink(link: string): string[] {
  const urls: string[] = []

  try {
    const url = new URL(link)
    const host = url.hostname.toLowerCase()
    const parts = url.pathname.split("/").filter(Boolean)

    if (host.includes("github.com") && parts[0]) {
      urls.push(`https://unavatar.io/github/${parts[0]}`)
    }
    if ((host.includes("x.com") || host.includes("twitter.com")) && parts[0]) {
      urls.push(`https://unavatar.io/x/${parts[0]}`)
    }
    if (host.includes("reddit.com")) {
      const username = parts[0] === "user" ? parts[1] : parts[0]
      if (username) urls.push(`https://unavatar.io/reddit/${username}`)
    }
    if (host.includes("bsky.app")) {
      const handle = parts[0] === "profile" ? parts[1] : parts[0]
      if (handle) urls.push(`https://unavatar.io/bluesky/${handle}`)
    }
  } catch {
    // Ignore invalid URLs and continue checking remaining links.
  }

  return urls
}

/** Ordered profile image URLs from social links (unavatar for GitHub, X, Reddit, Bluesky). */
export function getAvatarUrlCandidates(links: string[]): string[] {
  const seen = new Set<string>()
  const candidates: string[] = []

  for (const link of sortLinksByAvatarPriority(links)) {
    for (const avatarUrl of collectAvatarUrlsFromLink(link)) {
      if (!seen.has(avatarUrl)) {
        seen.add(avatarUrl)
        candidates.push(avatarUrl)
      }
    }
  }

  return candidates
}

/** Resolve a profile image URL from social links (first candidate). */
export function getAvatarUrlFromLinks(links: string[]): string {
  return getAvatarUrlCandidates(links)[0] ?? ""
}

/** Bluesky handle from profile URLs, for API avatar fallback. */
export function getBlueskyHandleFromLinks(links: string[]): string {
  for (const link of links) {
    try {
      const url = new URL(link)
      const host = url.hostname.toLowerCase()
      if (!host.includes("bsky.app")) continue
      const parts = url.pathname.split("/").filter(Boolean)
      const handle = parts[0] === "profile" ? parts[1] : parts[0]
      if (handle) return handle
    } catch {
      // Ignore invalid URLs and continue checking remaining links.
    }
  }

  return ""
}

/** Up to two initials from display name (strips trailing " @handle"). */
export function getPersonInitials(name: string): string {
  return name
    .replace(/\s@[^ ]+$/, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2)
}
