// Fetches for the shared-chat viewer: DID resolution, the shared record from
// the owner's PDS, and their Bluesky profile. Every request has a timeout and
// a size cap, and only goes to plc.directory, a did:web host, the PDS that
// DID document names, or the Bluesky AppView.
import type { SharedBy } from "#lib/chat/share-page"

export class ChatFetchError extends Error {
  readonly kind: "not-found" | "upstream" | "too-large"

  constructor(kind: ChatFetchError["kind"], message: string) {
    super(message)
    this.kind = kind
  }
}

const PLC_DIRECTORY = "https://plc.directory"
const BSKY_APPVIEW = "https://public.api.bsky.app"
const TIMEOUT_MS = 8_000
const MAX_DID_DOCUMENT_BYTES = 64 * 1024
const MAX_PROFILE_BYTES = 64 * 1024
/** Shares bigger than this are refused rather than rendered. */
export const MAX_RECORD_BYTES = 2 * 1024 * 1024

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

// A DNS name with a letter-led last label: rules out IP literals ("127.0.0.1",
// "[::1]") and single-label names like "localhost".
const HOSTNAME = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export const isPublicHostname = (host: string) => HOSTNAME.test(host)

export const PLC_DID = /^did:plc:[a-z2-7]{24}$/
// Host only: a did:web with a port (%3A) or a path (:segments) is refused.
export const WEB_DID = /^did:web:([a-z0-9.-]+)$/

async function readCapped(response: Response, maxBytes: number): Promise<string> {
  const declared = Number(response.headers.get("content-length"))
  if (declared > maxBytes) {
    await response.body?.cancel()
    throw new ChatFetchError("too-large", `Response larger than ${maxBytes} bytes`)
  }
  if (!response.body) return ""

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel()
      throw new ChatFetchError("too-large", `Response larger than ${maxBytes} bytes`)
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

async function getJson(url: URL, maxBytes: number): Promise<{ status: number; body: unknown }> {
  let response: Response | undefined
  // One retry for a dropped connection; HTTP errors are answers and aren't retried.
  for (let attempt = 0; !response; attempt++) {
    try {
      // Redirects aren't followed: they could lead anywhere, including private hosts.
      response = await fetch(url, {
        headers: { accept: "application/json" },
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
    } catch (cause) {
      if (attempt === 1) throw new ChatFetchError("upstream", `${url.host}: ${cause instanceof Error ? cause.message : "request failed"}`)
    }
  }
  const text = await readCapped(response, maxBytes)
  try {
    return { status: response.status, body: JSON.parse(text) as unknown }
  } catch {
    return { status: response.status, body: null }
  }
}

/** The https origin of the PDS a DID document names, if it's a public host. */
function pdsEndpoint(document: unknown, did: string): string {
  if (!isObject(document) || document.id !== did || !Array.isArray(document.service)) {
    throw new ChatFetchError("upstream", `${did}: unusable DID document`)
  }
  const service = document.service.find(
    (entry) =>
      isObject(entry) &&
      typeof entry.id === "string" &&
      (entry.id === "#atproto_pds" || entry.id === `${did}#atproto_pds`) &&
      entry.type === "AtprotoPersonalDataServer",
  )
  const endpoint = isObject(service) && typeof service.serviceEndpoint === "string" ? service.serviceEndpoint : ""
  let url: URL
  try {
    url = new URL(endpoint)
  } catch {
    throw new ChatFetchError("upstream", `${did}: no PDS endpoint`)
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port || !isPublicHostname(url.hostname)) {
    throw new ChatFetchError("upstream", `${did}: PDS endpoint ${url.origin} not allowed`)
  }
  return url.origin
}

export async function resolvePds(did: string): Promise<string> {
  let url: URL
  if (PLC_DID.test(did)) {
    url = new URL(`/${did}`, PLC_DIRECTORY)
  } else {
    const host = did.match(WEB_DID)?.[1]
    if (!host || !isPublicHostname(host)) throw new ChatFetchError("not-found", `${did}: unsupported DID`)
    url = new URL(`https://${host}/.well-known/did.json`)
  }

  const { status, body } = await getJson(url, MAX_DID_DOCUMENT_BYTES)
  if (status === 404 || status === 410) throw new ChatFetchError("not-found", `${did}: DID not found`)
  if (status !== 200) throw new ChatFetchError("upstream", `${did}: DID lookup returned ${status}`)
  return pdsEndpoint(body, did)
}

export async function getRecord(pds: string, did: string, collection: string, rkey: string): Promise<Record<string, unknown>> {
  const url = new URL("/xrpc/com.atproto.repo.getRecord", pds)
  url.searchParams.set("repo", did)
  url.searchParams.set("collection", collection)
  url.searchParams.set("rkey", rkey)

  const { status, body } = await getJson(url, MAX_RECORD_BYTES)
  if (status === 200 && isObject(body) && isObject(body.value)) return body.value
  // A PDS answers a missing record with 400 RecordNotFound (or 404).
  const error = isObject(body) ? body.error : null
  if (status === 404 || error === "RecordNotFound" || error === "RepoNotFound" || error === "RepoDeactivated" || error === "RepoTakendown") {
    throw new ChatFetchError("not-found", `${did}/${collection}/${rkey}: ${String(error ?? status)}`)
  }
  throw new ChatFetchError("upstream", `${pds} getRecord returned ${status}`)
}

const readString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null)

/** Display name, handle and avatar; just the DID when Bluesky doesn't answer. */
export async function getProfile(did: string): Promise<SharedBy> {
  try {
    const url = new URL("/xrpc/app.bsky.actor.getProfile", BSKY_APPVIEW)
    url.searchParams.set("actor", did)
    const { status, body } = await getJson(url, MAX_PROFILE_BYTES)
    if (status !== 200 || !isObject(body) || body.did !== did) throw new Error(`getProfile returned ${status}`)
    const avatar = readString(body.avatar)
    return {
      did,
      handle: readString(body.handle)?.replace(/^@+/, "") ?? null,
      displayName: readString(body.displayName),
      avatarUrl: avatar?.startsWith("https://") ? avatar : null,
    }
  } catch (error) {
    console.warn(`[chat] profile for ${did}: ${error instanceof Error ? error.message : error}`)
    return { did, handle: null, displayName: null, avatarUrl: null }
  }
}
