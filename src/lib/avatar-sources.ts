// Pure avatar-source derivation shared by the runtime resolver
// (lib/person-avatar.ts) and the build-time prefetcher
// (scripts/fetch-avatars.mjs). Keep this module free of JSON imports so
// plain Node can load it outside the Next.js bundler.

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

// Without fallback=false, unavatar answers failed lookups with a generic
// placeholder and HTTP 200, so <img> onError never fires and the candidate
// chain (other providers → Bluesky API → initials) is silently skipped.
function unavatarUrl(provider: string, username: string): string {
  return `https://unavatar.io/${provider}/${encodeURIComponent(username)}?fallback=false`
}

function collectAvatarUrlsFromLink(link: string): string[] {
  const urls: string[] = []

  try {
    const url = new URL(link)
    const host = url.hostname.toLowerCase()
    const parts = url.pathname.split("/").filter(Boolean)

    if (host.includes("github.com") && parts[0]) {
      urls.push(unavatarUrl("github", parts[0]))
    }
    if ((host.includes("x.com") || host.includes("twitter.com")) && parts[0]) {
      urls.push(unavatarUrl("x", parts[0]))
    }
    if (host.includes("reddit.com")) {
      const username = parts[0] === "user" ? parts[1] : parts[0]
      if (username) urls.push(unavatarUrl("reddit", username))
    }
    if (host.includes("bsky.app")) {
      const handle = parts[0] === "profile" ? parts[1] : parts[0]
      if (handle) urls.push(unavatarUrl("bluesky", handle))
    }
    if (host.includes("pimtron.dev")) {
      urls.push("/pimmy.png")
    }
  } catch {
    // Ignore invalid URLs and continue checking remaining links.
  }

  return urls
}

/** Ordered remote profile image URLs from social links (unavatar for GitHub, X, Reddit, Bluesky). */
export function getRemoteAvatarUrlCandidates(links: string[]): string[] {
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
