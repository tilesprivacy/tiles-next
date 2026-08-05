// Build-time avatar prefetcher.
//
// Downloads every person's avatar (unavatar.io for GitHub/X/Reddit, the
// public Bluesky API for bsky handles) into public/avatars/ and writes
// lib/avatar-manifest.json mapping each profile link to the local asset.
// The runtime avatar resolver serves the local copy first, so the sponsor
// and blog pages no longer depend on third-party avatar services at
// request time.
//
// Best-effort by design: a failed lookup keeps the previously committed
// asset (or falls back to the runtime candidate chain), and the script
// always exits 0 so offline builds still succeed.

import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const AVATARS_DIR = path.join(root, 'public', 'avatars')
const MANIFEST_PATH = path.join(root, 'lib', 'avatar-manifest.json')
const FETCH_TIMEOUT_MS = 15000

const { people } = await import(path.join(root, 'lib', 'people.ts'))
const { getRemoteAvatarUrlCandidates, getBlueskyHandleFromLinks } = await import(
  path.join(root, 'lib', 'avatar-sources.ts')
)

const EXTENSION_BY_CONTENT_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
}

async function fetchWithTimeout(url) {
  return fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { 'user-agent': 'tiles-avatar-prefetch' },
  })
}

async function resolveBlueskyAvatarUrl(handle) {
  try {
    const res = await fetchWithTimeout(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`,
    )
    if (!res.ok) return ''
    const data = await res.json()
    return data?.avatar ?? ''
  } catch {
    return ''
  }
}

async function downloadAvatar(url) {
  try {
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const contentType = (res.headers.get('content-type') ?? '').split(';')[0].trim()
    const extension = EXTENSION_BY_CONTENT_TYPE[contentType]
    if (!extension) return null
    const body = Buffer.from(await res.arrayBuffer())
    if (body.length === 0) return null
    return { body, extension }
  } catch {
    return null
  }
}

function existingAssetPath(personId, previousManifest) {
  for (const localPath of Object.values(previousManifest.byLink ?? {})) {
    if (path.basename(localPath, path.extname(localPath)) !== personId) continue
    if (existsSync(path.join(root, 'public', localPath.replace(/^\//, '')))) {
      return localPath
    }
  }
  return null
}

async function resolvePersonAvatar(person, previousManifest) {
  // Remote candidates in the same priority order the runtime resolver uses,
  // with the Bluesky CDN URL (resolved via API) appended last.
  const candidates = getRemoteAvatarUrlCandidates(person.links)
  const bskyHandle = getBlueskyHandleFromLinks(person.links)
  if (bskyHandle) {
    const bskyAvatarUrl = await resolveBlueskyAvatarUrl(bskyHandle)
    if (bskyAvatarUrl && !candidates.includes(bskyAvatarUrl)) {
      candidates.push(bskyAvatarUrl)
    }
  }

  for (const candidate of candidates) {
    // Candidates that are already local project assets need no fetching.
    if (candidate.startsWith('/')) return { localPath: candidate, source: 'project asset' }

    const downloaded = await downloadAvatar(candidate)
    if (!downloaded) continue

    const fileName = `${person.id}.${downloaded.extension}`
    await writeAvatarFile(person.id, fileName, downloaded.body)
    return { localPath: `/avatars/${fileName}`, source: candidate }
  }

  // Every lookup failed: keep a previously committed asset when one exists.
  const kept = existingAssetPath(person.id, previousManifest)
  return kept ? { localPath: kept, source: 'kept existing asset' } : null
}

async function writeAvatarFile(personId, fileName, body) {
  // Drop stale copies saved under a different extension for this person.
  for (const extension of Object.values(EXTENSION_BY_CONTENT_TYPE)) {
    const stale = path.join(AVATARS_DIR, `${personId}.${extension}`)
    if (path.basename(stale) !== fileName && existsSync(stale)) await unlink(stale)
  }
  await writeFile(path.join(AVATARS_DIR, fileName), body)
}

await mkdir(AVATARS_DIR, { recursive: true })

let previousManifest = { byLink: {} }
try {
  previousManifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
} catch {
  // First run: no manifest yet.
}

const persons = Object.values(people)
  .flat()
  .filter((person) => !person.anonymous && person.links.length > 0)

const byLink = {}
let resolved = 0
for (const person of persons) {
  const result = await resolvePersonAvatar(person, previousManifest)
  if (!result) {
    console.warn(`[avatars] ${person.id}: no avatar resolved, runtime fallback chain applies`)
    continue
  }
  resolved += 1
  for (const link of person.links) {
    byLink[link] = result.localPath
  }
  console.log(`[avatars] ${person.id}: ${result.localPath} (${result.source})`)
}

await writeFile(MANIFEST_PATH, `${JSON.stringify({ byLink }, null, 2)}\n`)
console.log(`[avatars] resolved ${resolved}/${persons.length} people; manifest at lib/avatar-manifest.json`)
