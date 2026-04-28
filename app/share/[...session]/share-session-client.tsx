"use client"

import { AtpAgent } from "@atproto/api"
import { AlertCircle, Check, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import type { SharedSession, SharedSessionMessage } from "@/lib/shared-session"

const DEFAULT_ATPROTO_SERVICE = "https://public.api.bsky.app"
const PLC_DIRECTORY_URL = "https://plc.directory"
const TILES_SESSION_COLLECTION = "run.tiles.session"

interface ShareSessionClientProps {
  shareToken?: string
  mockApiUrl?: string
}

interface AtUriParts {
  repo: string
  collection: string
  rkey: string
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null
}

function decodeBase64Utf8(value: string): string {
  const raw = window.atob(value)
  const bytes = Uint8Array.from(raw, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function parseAtUri(uri: string): AtUriParts {
  const match = uri.match(/^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/)

  if (!match) {
    throw new Error("Shared session URI must look like at://repo/collection/rkey.")
  }

  return {
    repo: match[1],
    collection: match[2],
    rkey: match[3],
  }
}

function resolveSharedSessionUri(shareToken: string): string {
  const token = decodeURIComponent(shareToken)
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/api\/og$/i, "")
  const normalizedToken = token.replace(/-/g, "+").replace(/_/g, "/")
  const paddedToken = normalizedToken.padEnd(
    normalizedToken.length + ((4 - (normalizedToken.length % 4)) % 4),
    "=",
  )
  const decodedUri = decodeBase64Utf8(paddedToken)

  if (!decodedUri.startsWith("at://")) {
    throw new Error("Shared session token must be a base64 AT URI.")
  }

  const { collection } = parseAtUri(decodedUri)

  if (collection !== TILES_SESSION_COLLECTION) {
    throw new Error("Shared session URI is not a Tiles session record.")
  }

  return decodedUri
}

function normalizeMessages(contents: unknown): SharedSessionMessage[] {
  if (!Array.isArray(contents)) {
    return []
  }

  return contents.flatMap((entry): SharedSessionMessage[] => {
    if (!entry || typeof entry !== "object") {
      return []
    }

    const record = entry as Record<string, unknown>
    const role = record.role
    const content = readString(record.content)

    if ((role === "user" || role === "assistant") && content) {
      return [{ role, content }]
    }

    const userContent = readString(record.user)
    const assistantContent = readString(record.assistant)
    const messages: SharedSessionMessage[] = []

    if (userContent) {
      messages.push({ role: "user", content: userContent })
    }

    if (assistantContent) {
      messages.push({ role: "assistant", content: assistantContent })
    }

    return messages
  })
}

async function resolveAtprotoService(repo: string): Promise<string> {
  if (!repo.startsWith("did:plc:")) {
    return DEFAULT_ATPROTO_SERVICE
  }

  const response = await fetch(
    `${PLC_DIRECTORY_URL}/${encodeURIComponent(repo)}`,
    {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Unable to resolve shared session DID (${response.status}).`)
  }

  const didDocument = (await response.json()) as {
    service?: Array<{
      id?: unknown
      type?: unknown
      serviceEndpoint?: unknown
    }>
  }
  const pds = didDocument.service?.find(
    (service) =>
      service.id === "#atproto_pds" ||
      service.type === "AtprotoPersonalDataServer",
  )
  const endpoint = readString(pds?.serviceEndpoint)

  if (!endpoint) {
    throw new Error("Shared session DID did not advertise an ATProto PDS.")
  }

  return endpoint.replace(/\/$/, "")
}

async function getActorProfile(repo: string): Promise<SharedSession["sharedBy"]> {
  const agent = new AtpAgent({
    service: DEFAULT_ATPROTO_SERVICE,
    fetch,
  })

  try {
    const response = await agent.app.bsky.actor.getProfile({
      actor: repo,
    })
    const profile = response.data

    return {
      did: readString(profile.did) ?? repo,
      handle: readString(profile.handle),
      displayName: readString(profile.displayName),
      avatarUrl: readString(profile.avatar),
    }
  } catch {
    return {
      did: repo,
      handle: null,
      displayName: null,
      avatarUrl: null,
    }
  }
}

async function getSharedSessionClient(shareToken: string): Promise<SharedSession> {
  const sourceUri = resolveSharedSessionUri(shareToken)
  const { repo, collection, rkey } = parseAtUri(sourceUri)
  const service = await resolveAtprotoService(repo)
  const agent = new AtpAgent({
    service,
    fetch,
  })

  const [recordResponse, sharedBy] = await Promise.all([
    agent.com.atproto.repo.getRecord({
      repo,
      collection,
      rkey,
    }),
    getActorProfile(repo),
  ])
  const recordValue = recordResponse.data.value

  if (!recordValue || typeof recordValue !== "object") {
    throw new Error("Shared session record did not contain a JSON value.")
  }

  const record = recordValue as Record<string, unknown>

  return {
    sessionId: readString(record.session_id) ?? "shared-session",
    name: readString(record.name) ?? "Shared session",
    createdAt: readString(record.created_at),
    sourceUri,
    sharedBy,
    messages: normalizeMessages(record.contents),
  }
}

async function getSharedSessionFromMockApi(
  mockApiUrl: string,
): Promise<SharedSession> {
  const response = await fetch(mockApiUrl, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Unable to load mock shared session (${response.status}).`)
  }

  const payload = (await response.json()) as SharedSession
  return payload
}

function getSharedByLabel(sharedSession: SharedSession): string {
  const preferredName = sharedSession.sharedBy.displayName ?? sharedSession.sharedBy.handle
  return preferredName && preferredName.trim().length > 0
    ? preferredName
    : sharedSession.sharedBy.did
}

function shortenShareLinkLabel(rawUrl: string): string {
  if (!rawUrl) {
    return "Loading link..."
  }

  try {
    const parsed = new URL(rawUrl)
    const displayHost = parsed.host.replace(/^www\./, "")
    const simplifiedPath = parsed.pathname.startsWith("/share/")
      ? (() => {
          const token = parsed.pathname.slice("/share/".length)
          if (token.length <= 14) {
            return `/share/${token}`
          }
          return `/share/${token.slice(0, 6)}...${token.slice(-6)}`
        })()
      : parsed.pathname.length > 20
        ? `${parsed.pathname.slice(0, 20)}...${parsed.pathname.slice(-6)}`
        : parsed.pathname
    return `${displayHost}${simplifiedPath}`
  } catch {
    return rawUrl.length > 42
      ? `${rawUrl.slice(0, 26)}...${rawUrl.slice(-8)}`
      : rawUrl
  }
}

function buildAtExploreUrl(sourceUri: string): string | null {
  if (!sourceUri.startsWith("at://")) {
    return null
  }

  const atPath = sourceUri.slice("at://".length)
  return `https://atexplore.social/${atPath}?mode=simple`
}

function buildBlueskyProfileUrl(handle: string | null, did: string): string {
  const normalizedHandle = handle?.trim().replace(/^@+/, "")
  const profileId = normalizedHandle && normalizedHandle.length > 0
    ? normalizedHandle
    : did
  return `https://bsky.app/profile/${encodeURIComponent(profileId)}`
}

function MessageBubble({ message }: { message: SharedSessionMessage }) {
  const isAssistant = message.role === "assistant"

  return (
    <div className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[78%] sm:px-5 sm:text-[0.95rem] ${
          isAssistant
            ? "bg-transparent text-[#E6E6E8]"
            : "bg-white/[0.085] text-[#EDEDEF]"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-sm border border-dashed border-white/12 px-6 text-center">
      <p className="max-w-sm text-sm leading-6 text-[#A8A8A8]">
        This shared session was found, but it does not contain displayable user
        or assistant messages yet.
      </p>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-[#101010] text-white/65">
        <AlertCircle className="h-4 w-4" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[#EDEDEF] sm:text-3xl">
        Shared session unavailable
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#A8A8A8]">
        {message}
      </p>
    </div>
  )
}

function ShareFloatingDownloadBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.65rem,env(safe-area-inset-bottom,0px))] z-[60] px-3 sm:bottom-4 sm:px-4">
      <div className="mx-auto w-full max-w-[38rem]">
        <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-[0.9rem] border border-white/10 bg-[#1f1f1f]/95 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.22)] backdrop-blur-sm sm:gap-3 sm:px-3 sm:py-2">
          <Link href="/" className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-85 sm:gap-2.5">
            <Image
              src="/grey.png"
              alt="Tiles"
              width={40}
              height={40}
              className="h-6 w-6 shrink-0 opacity-90 sm:h-7 sm:w-7"
            />
            <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2">
              <span className="truncate text-sm font-semibold tracking-[-0.01em] text-[#e7e7ed] sm:text-base">
                Tiles
              </span>
              <span className="hidden text-xs text-white/55 sm:inline">
                Local-first private AI assistant for everyday use
              </span>
            </span>
          </Link>

          <Link
            href="/download"
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-[0.65rem] border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-[#e7e7ed]/90 transition-colors hover:bg-white/[0.08] hover:text-[#e7e7ed] sm:h-8 sm:px-3.5 sm:text-sm"
          >
            Download
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ShareSessionClient({
  shareToken,
  mockApiUrl,
}: ShareSessionClientProps) {
  const [sharedSession, setSharedSession] = useState<SharedSession | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pageUrl, setPageUrl] = useState<string>("")
  const [copiedLink, setCopiedLink] = useState(false)
  const [fetchingSourceSuffix, setFetchingSourceSuffix] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loader = mockApiUrl
      ? getSharedSessionFromMockApi(mockApiUrl)
      : shareToken
        ? getSharedSessionClient(shareToken)
        : Promise.reject(new Error("Missing share token."))

    void loader.then(
      (session) => {
        if (cancelled) {
          return
        }
        setSharedSession(session)
      },
      (error: unknown) => {
        if (cancelled) {
          return
        }
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load this shared session.",
        )
      },
    )

    return () => {
      cancelled = true
    }
  }, [mockApiUrl, shareToken])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    setPageUrl(window.location.href)
  }, [])

  const sharedByLabel = useMemo(
    () => (sharedSession ? getSharedByLabel(sharedSession) : ""),
    [sharedSession],
  )

  const shareLinkLabel = useMemo(() => {
    return shortenShareLinkLabel(pageUrl)
  }, [pageUrl])
  const atExploreUrl = useMemo(
    () => buildAtExploreUrl(sharedSession?.sourceUri ?? ""),
    [sharedSession?.sourceUri],
  )
  const blueskyProfileUrl = useMemo(() => {
    if (!sharedSession) {
      return ""
    }
    return buildBlueskyProfileUrl(
      sharedSession.sharedBy.handle,
      sharedSession.sharedBy.did,
    )
  }, [sharedSession])
  useEffect(() => {
    if (!shareToken) {
      setFetchingSourceSuffix(null)
      return
    }

    try {
      const resolvedUri = resolveSharedSessionUri(shareToken)
      setFetchingSourceSuffix(resolvedUri.replace(/^at:\/\//, ""))
    } catch {
      setFetchingSourceSuffix(null)
    }
  }, [shareToken])

  if (errorMessage) {
    return (
      <main className="dark flex h-[100dvh] overflow-hidden bg-[#1f1f1f] pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] text-[#E6E6E8] lg:min-h-screen lg:overflow-visible lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]">
        <ErrorState message={errorMessage} />
        <ShareFloatingDownloadBar />
      </main>
    )
  }

  if (!sharedSession) {
    return (
      <main className="dark flex h-[100dvh] overflow-hidden bg-[#1f1f1f] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] text-[#E6E6E8] sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]">
        <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <p className="w-full text-center text-sm text-white/55">
              <span className="inline-flex max-w-full items-center whitespace-nowrap">
                <span>Loading shared chat at://</span>
                <span
                  className={`ml-1 inline-block w-[24ch] overflow-hidden text-left font-mono sm:w-[34ch] ${
                    fetchingSourceSuffix
                      ? "truncate text-white/60"
                      : "animate-pulse rounded-sm bg-white/15 text-transparent"
                  }`}
                  aria-hidden={!fetchingSourceSuffix}
                >
                  {fetchingSourceSuffix ?? "did:plc:placeholder/run.tiles.session/placeholder"}
                </span>
              </span>
            </p>
          </div>
        </section>
        <ShareFloatingDownloadBar />
      </main>
    )
  }

  return (
    <main className="dark flex h-[100dvh] overflow-hidden bg-[#1f1f1f] px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] text-[#E6E6E8] sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]">
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <div className="native-scrollbar min-h-0 flex-1 overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
          <div className="mx-auto w-full max-w-3xl">
            <header className="px-2 pb-7 pt-4 text-center sm:px-2 sm:pb-8 sm:pt-4">
              <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs leading-5 text-black/45 dark:text-white/55 sm:gap-x-1.5 sm:gap-y-1 sm:text-[0.8rem]">
                <span>This is a copy of a conversation between Tiles and</span>
                <span className="inline-flex items-center gap-1.5">
                  {sharedSession.sharedBy.avatarUrl ? (
                    <img
                      src={sharedSession.sharedBy.avatarUrl}
                      alt={sharedByLabel}
                      className="h-4 w-4 rounded-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="h-4 w-4 rounded-full bg-black/15 dark:bg-white/25" aria-hidden />
                  )}
                  <a
                    href={blueskyProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-black/65 underline decoration-black/20 underline-offset-2 transition-colors hover:text-black/85 hover:decoration-black/35 dark:text-white/75 dark:decoration-white/25 dark:hover:text-white dark:hover:decoration-white/40"
                    title="Open Bluesky profile"
                  >
                    {sharedSession.sharedBy.handle
                      ? `@${sharedSession.sharedBy.handle.replace(/^@+/, "")}`
                      : sharedByLabel}
                  </a>
                </span>
              </p>
              <div className="mt-3 flex items-center justify-center gap-2.5 text-xs leading-5 text-black/58 dark:text-white/62 sm:mt-2.5 sm:gap-2">
                <span className="max-w-[min(74vw,36rem)] truncate font-medium" title={pageUrl || undefined}>
                  {shareLinkLabel}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!pageUrl) {
                      return
                    }
                    void navigator.clipboard.writeText(pageUrl).then(() => {
                      setCopiedLink(true)
                      window.setTimeout(() => setCopiedLink(false), 1200)
                    })
                  }}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-black/62 transition-colors hover:text-black dark:text-white/62 dark:hover:text-white"
                  aria-label="Copy link"
                  title="Copy link"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                </button>
              </div>
            </header>

            {sharedSession.messages.length > 0 ? (
              <div className="flex flex-col gap-6 py-5 sm:gap-7 sm:py-3">
                {sharedSession.messages.map((message, index) => (
                  <MessageBubble key={`${message.role}-${index}`} message={message} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}

            <footer className="mt-8 border-t border-white/10 pb-4 pt-3 sm:mt-10">
              <p className="text-center text-[0.68rem] leading-4 text-white/55 sm:text-[0.72rem]">
                <span className="block">
                  This conversation is fetched directly from the PDS on the client side, and we do not store copy of the shared conversation on our servers.
                </span>
                <span className="mt-1 block">
                  <span>View source </span>
                  {atExploreUrl ? (
                    <a
                      href={atExploreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/25 underline-offset-2 transition-colors hover:text-white/70 hover:decoration-white/40"
                    >
                      {sharedSession.sourceUri}
                    </a>
                  ) : (
                    <span>{sharedSession.sourceUri}</span>
                  )}
                </span>
              </p>
            </footer>
          </div>
        </div>
      </section>
      <ShareFloatingDownloadBar />
    </main>
  )
}
