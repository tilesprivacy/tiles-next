import avatarManifest from "./avatar-manifest.json"
import { getBlueskyHandleFromLinks, getRemoteAvatarUrlCandidates } from "./avatar-sources"

export { getBlueskyHandleFromLinks }

// Committed snapshot from scripts/fetch-avatars.mjs: profile link → local
// asset under public/avatars. Normal builds consume these files without
// contacting third-party avatar services.
const localAvatarByLink: Record<string, string> = avatarManifest.byLink

/** Ordered profile image URLs: committed local assets first, remote providers as fallbacks. */
export function getAvatarUrlCandidates(links: string[]): string[] {
  const seen = new Set<string>()
  const candidates: string[] = []

  for (const link of links) {
    const localPath = localAvatarByLink[link]
    if (localPath && !seen.has(localPath)) {
      seen.add(localPath)
      candidates.push(localPath)
    }
  }

  for (const avatarUrl of getRemoteAvatarUrlCandidates(links)) {
    if (!seen.has(avatarUrl)) {
      seen.add(avatarUrl)
      candidates.push(avatarUrl)
    }
  }

  return candidates
}

/** Resolve a profile image URL from social links (first candidate). */
export function getAvatarUrlFromLinks(links: string[]): string {
  return getAvatarUrlCandidates(links)[0] ?? ""
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
