"use client"

import { AlertCircle, Check, ChevronDown, Copy, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Streamdown } from "streamdown"
import type { SharedSession, SharedSessionMessage } from "@/lib/shared-session"
import { cn } from "@/lib/utils"

interface ShareSessionClientProps {
  mockApiUrl?: string
  initialSharedSession?: SharedSession | null
  initialErrorMessage?: string | null
}

type ShareThemePreference = "light" | "dark" | "system"

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
  const preferredName =
    sharedSession.sharedBy.displayName ?? sharedSession.sharedBy.handle
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
  const profileId =
    normalizedHandle && normalizedHandle.length > 0 ? normalizedHandle : did
  return `https://bsky.app/profile/${encodeURIComponent(profileId)}`
}

function buildHuggingFaceModelUrl(modelId: string): string {
  return `https://huggingface.co/${encodeURIComponent(modelId).replace(/%2F/g, "/")}`
}

function isSafeMarkdownUrl(url: string): boolean {
  const trimmedUrl = url.trim()

  if (trimmedUrl.startsWith("/") || trimmedUrl.startsWith("#")) {
    return true
  }

  try {
    const parsed = new URL(trimmedUrl)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function transformShareMarkdownUrl(url: string): string | null {
  return isSafeMarkdownUrl(url) ? url : null
}

function sanitizeTranscriptFilenamePart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

function buildMarkdownTranscript(
  sharedSession: SharedSession,
  sharedByLabel: string,
  pageUrl: string,
): string {
  const lines = [
    `# ${sharedSession.name || "Shared Tiles conversation"}`,
    "",
    `- Shared by: ${sharedByLabel}`,
    `- Created: ${sharedSession.createdAt}`,
    `- Source: ${sharedSession.sourceUri}`,
    ...(pageUrl ? [`- Share link: ${pageUrl}`] : []),
    ...(sharedSession.modelsUsed.length > 0
      ? [`- Models: ${sharedSession.modelsUsed.join(", ")}`]
      : []),
    "",
    "---",
    "",
  ]

  sharedSession.messages.forEach((message, index) => {
    const roleLabel = message.role === "assistant" ? "Assistant" : "User"
    lines.push(`## ${index + 1}. ${roleLabel}`, "", message.content.trim(), "")
  })

  return `${lines.join("\n").trim()}\n`
}

function downloadMarkdownTranscript(
  sharedSession: SharedSession,
  sharedByLabel: string,
  pageUrl: string,
): void {
  const transcript = buildMarkdownTranscript(
    sharedSession,
    sharedByLabel,
    pageUrl,
  )
  const filenameBase =
    sanitizeTranscriptFilenamePart(sharedSession.name) ||
    sanitizeTranscriptFilenamePart(sharedSession.sessionId) ||
    "tiles-shared-chat"
  const blob = new Blob([transcript], {
    type: "text/markdown;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = `${filenameBase}.md`
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function MarkdownMessage({ content }: { content: string }) {
  const normalizedContent = content.replace(/\r\n?/g, "\n")

  return (
    <Streamdown
      mode="static"
      className="share-markdown break-words"
      urlTransform={transformShareMarkdownUrl}
      controls={{ table: true, code: false, mermaid: false }}
      lineNumbers={false}
      components={{
        a: ({ href, children, className, node: _node, ...props }) => {
          const safeHref =
            typeof href === "string" && isSafeMarkdownUrl(href)
              ? href
              : undefined
          const isLocal =
            safeHref?.startsWith("/") || safeHref?.startsWith("#")

          return (
            <a
              {...props}
              href={safeHref}
              target={isLocal ? undefined : "_blank"}
              rel={isLocal ? undefined : "noopener noreferrer"}
              className={cn(
                "font-medium text-black underline decoration-black/25 underline-offset-4 transition-colors hover:text-black/80 hover:decoration-black/45 dark:text-white dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/45",
                className,
              )}
            >
              {children}
            </a>
          )
        },
      }}
    >
      {normalizedContent}
    </Streamdown>
  )
}

function splitReasoningContent(content: string): {
  reasoning: string | null
  answer: string
} {
  const normalizedContent = content.replace(/\r\n?/g, "\n").trim()
  const reasoningMatch = normalizedContent.match(/^\*\*\[Reasoning\]\*\*\s*\n+/)

  if (!reasoningMatch) {
    return {
      reasoning: null,
      answer: content,
    }
  }

  const contentAfterLabel = normalizedContent.slice(reasoningMatch[0].length)
  const answerDividerMatch = contentAfterLabel.match(
    /\n---+\s*\n+\*\*\[Answer\]\*\*\s*\n*/,
  )
  const answerLabelMatch = contentAfterLabel.match(
    /\n+\*\*\[Answer\]\*\*\s*\n*/,
  )
  const splitMatch = answerDividerMatch ?? answerLabelMatch

  if (!splitMatch || splitMatch.index === undefined) {
    return {
      reasoning: contentAfterLabel,
      answer: "",
    }
  }

  return {
    reasoning: contentAfterLabel.slice(0, splitMatch.index).trim(),
    answer: contentAfterLabel
      .slice(splitMatch.index + splitMatch[0].length)
      .trim(),
  }
}

function ReasoningDisclosure({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="group flex w-full items-center gap-2 text-left text-[0.95rem] font-medium leading-6 text-black/60 transition-colors hover:text-black/80 dark:text-white/60 dark:hover:text-white/80"
        aria-expanded={expanded}
      >
        <span>Reasoning details</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform group-hover:text-black/70 dark:group-hover:text-white/60 ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {expanded ? (
        <div className="mt-4 border-l-2 border-black/20 pl-5 text-[0.95rem] leading-7 text-black/75 dark:border-white/24 dark:text-white/70">
          <MarkdownMessage content={content} />
        </div>
      ) : null}
    </div>
  )
}

function ChatMessageContent({ message }: { message: SharedSessionMessage }) {
  const { reasoning, answer } =
    message.role === "assistant"
      ? splitReasoningContent(message.content)
      : { reasoning: null, answer: message.content }

  return (
    <div className="space-y-6">
      {reasoning ? <ReasoningDisclosure content={reasoning} /> : null}
      {answer ? <MarkdownMessage content={answer} /> : null}
    </div>
  )
}

function MessageMetaRow({
  message,
  modelLabel,
}: {
  message: SharedSessionMessage
  modelLabel: string | null
}) {
  const [copied, setCopied] = useState(false)

  if (message.role !== "assistant") {
    return null
  }

  const answerToCopy = splitReasoningContent(message.content).answer.trim()
  const copyPayload = answerToCopy.length > 0 ? answerToCopy : message.content

  return (
    <div className="mt-3 flex items-center gap-2 text-[0.78rem] text-black/60 dark:text-white/65">
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(copyPayload).then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1200)
          })
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-black/60 transition-colors hover:text-black/80 dark:text-white/65 dark:hover:text-white/80"
        aria-label="Copy response"
        title="Copy response"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden />
        )}
      </button>
      {modelLabel ? (
        <span className="truncate">
          Generated with{" "}
          <a
            href={buildHuggingFaceModelUrl(modelLabel)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-black/20 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/35 dark:decoration-white/20 dark:hover:text-white/70 dark:hover:decoration-white/35"
          >
            {modelLabel}
          </a>
        </span>
      ) : null}
    </div>
  )
}

function MessageBubble({
  message,
  modelLabel,
}: {
  message: SharedSessionMessage
  modelLabel: string | null
}) {
  const isAssistant = message.role === "assistant"

  return (
    <div
      className={`flex w-full min-w-0 print:px-2 ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`min-w-0 max-w-[calc(100vw-2rem)] break-inside-avoid rounded-2xl px-4 py-3 text-sm leading-7 print:max-w-[94%] print:break-inside-auto sm:max-w-[78%] sm:px-5 sm:text-[0.95rem] ${
          isAssistant
            ? "bg-transparent text-[#2e2f33] print:bg-transparent dark:text-[#E6E6E8]"
            : "bg-black/[0.045] text-[#2b2c31] print:bg-black/[0.045] dark:bg-white/[0.085] dark:text-[#EDEDEF] dark:print:bg-white/[0.085]"
        }`}
      >
        <ChatMessageContent message={message} />
        <MessageMetaRow message={message} modelLabel={modelLabel} />
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center rounded-sm border border-dashed border-black/12 px-6 text-center dark:border-white/12">
      <p className="max-w-sm text-sm leading-6 text-[#6b6b6f] dark:text-[#A8A8A8]">
        This shared session was found, but it does not contain displayable user
        or assistant messages yet.
      </p>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 bg-black/5 text-black/60 dark:border-white/10 dark:bg-[#101010] dark:text-white/65">
        <AlertCircle className="h-4 w-4" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#EDEDEF] sm:text-3xl">
        Shared session unavailable
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#6b6b6f] dark:text-[#A8A8A8]">
        {message}
      </p>
    </div>
  )
}

function ShareFloatingDownloadBar({
  themePreference,
  isDark,
  onSetThemePreference,
}: {
  themePreference: ShareThemePreference
  isDark: boolean
  onSetThemePreference: (nextTheme: ShareThemePreference) => void
}) {
  return (
    <div className="share-floating-download-bar pointer-events-none fixed inset-x-0 bottom-[max(0.65rem,env(safe-area-inset-bottom,0px))] z-[60] px-3 print:hidden sm:bottom-4 sm:px-4">
      <div className="mx-auto w-full max-w-[38rem]">
        <div
          className={`pointer-events-auto flex min-w-0 items-center justify-between gap-2 rounded-[0.9rem] border px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:gap-3 sm:px-3 sm:py-2 ${
            isDark
              ? "border-white/10 bg-[#1f1f1f]/95"
              : "border-black/10 bg-white/95"
          }`}
        >
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 transition-opacity hover:opacity-85 sm:gap-2.5"
          >
            <Image
              src="/icon-mark-transparent-white.svg"
              alt="Tiles"
              width={40}
              height={40}
              className={`h-6 w-6 shrink-0 opacity-90 sm:h-7 sm:w-7 ${isDark ? "" : "invert"}`}
            />
            <span className="inline-flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
              <span
                className={`shrink-0 text-sm font-semibold tracking-[-0.01em] sm:text-base ${
                  isDark ? "text-[#e7e7ed]" : "text-[#1d1d1f]"
                }`}
              >
                Tiles
              </span>
              <span
                className={`hidden min-w-0 truncate text-xs min-[430px]:inline sm:hidden ${
                  isDark ? "text-white/55" : "text-black/55"
                }`}
              >
                Local-first private AI
              </span>
              <span
                className={`hidden text-xs sm:inline ${
                  isDark ? "text-white/55" : "text-black/55"
                }`}
              >
                Local-first private AI assistant for everyday use
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() =>
                onSetThemePreference(
                  themePreference === "light"
                    ? "dark"
                    : themePreference === "dark"
                      ? "system"
                      : "light",
                )
              }
              className={`inline-flex h-8 w-8 items-center justify-center rounded-[0.65rem] transition-colors ${
                isDark
                  ? "text-[#e7e7ed]/90 hover:text-[#e7e7ed]"
                  : "text-[#1d1d1f]/85 hover:text-[#1d1d1f]"
              }`}
              aria-label={`Theme: ${themePreference}. Click to switch theme`}
              title={`Theme: ${themePreference}`}
            >
              {themePreference === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
                </svg>
              ) : themePreference === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm1.5 0a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75v-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <Link
              href="/download"
              className={`inline-flex h-8 items-center justify-center rounded-[0.65rem] border px-2.5 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                isDark
                  ? "border-white/10 bg-white/[0.035] text-[#e7e7ed]/90 hover:bg-white/[0.08] hover:text-[#e7e7ed]"
                  : "border-black/10 bg-black/[0.03] text-[#1d1d1f]/85 hover:bg-black/[0.06] hover:text-[#1d1d1f]"
              }`}
            >
              Try Tiles
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShareSessionClient({
  mockApiUrl,
  initialSharedSession = null,
  initialErrorMessage = null,
}: ShareSessionClientProps) {
  const [sharedSession, setSharedSession] = useState<SharedSession | null>(
    initialSharedSession,
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialErrorMessage,
  )
  const [pageUrl, setPageUrl] = useState<string>("")
  const [copiedLink, setCopiedLink] = useState(false)
  const [themePreference, setThemePreference] =
    useState<ShareThemePreference>("system")
  const [isDark, setIsDark] = useState(false)
  const [themeReady, setThemeReady] = useState(false)
  const hadDarkBeforeMountRef = useRef<boolean | null>(null)

  useEffect(() => {
    if (!mockApiUrl) {
      return
    }

    let cancelled = false
    setSharedSession(null)
    setErrorMessage(null)

    void getSharedSessionFromMockApi(mockApiUrl).then(
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
          error instanceof Error
            ? error.message
            : "Unable to load this shared session.",
        )
      },
    )

    return () => {
      cancelled = true
    }
  }, [mockApiUrl])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    setPageUrl(window.location.href)
  }, [])

  useLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return
    }

    const root = document.documentElement
    hadDarkBeforeMountRef.current = root.classList.contains("dark")

    const storedTheme = window.localStorage.getItem("share-page-theme")
    const parsedTheme: ShareThemePreference =
      storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
        ? storedTheme
        : "system"
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const shouldUseDark =
      parsedTheme === "system" ? mediaQuery.matches : parsedTheme === "dark"

    setThemePreference(parsedTheme)
    setIsDark(shouldUseDark)
    root.classList.toggle("dark", shouldUseDark)
    setThemeReady(true)

    return () => {
      if (hadDarkBeforeMountRef.current === null) {
        return
      }
      root.classList.toggle("dark", hadDarkBeforeMountRef.current)
    }
  }, [])

  useEffect(() => {
    if (!themeReady || typeof window === "undefined" || typeof document === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const shouldUseDark =
      themePreference === "system"
        ? mediaQuery.matches
        : themePreference === "dark"

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle("dark", shouldUseDark)
    window.localStorage.setItem("share-page-theme", themePreference)

    if (themePreference !== "system") {
      return
    }

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setIsDark(event.matches)
      document.documentElement.classList.toggle("dark", event.matches)
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [themePreference, themeReady])

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

  if (!themeReady) {
    return (
      <main
        data-shared-session-page
        className="flex h-[100dvh] bg-[#fbfbfd] text-[#1d1d1f]"
      />
    )
  }

  if (errorMessage) {
    return (
      <main
        data-shared-session-page
        className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible lg:min-h-screen lg:overflow-visible lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
      >
        <ErrorState message={errorMessage} />
        <ShareFloatingDownloadBar
          themePreference={themePreference}
          isDark={isDark}
          onSetThemePreference={setThemePreference}
        />
      </main>
    )
  }

  if (!sharedSession) {
    return (
      <main
        data-shared-session-page
        className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
      >
        <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <p className="w-full text-center text-sm text-black/55 dark:text-white/55">
              <span className="inline-flex max-w-full items-center whitespace-nowrap">
                <span>Loading shared chat...</span>
              </span>
            </p>
          </div>
        </section>
        <ShareFloatingDownloadBar
          themePreference={themePreference}
          isDark={isDark}
          onSetThemePreference={setThemePreference}
        />
      </main>
    )
  }

  return (
    <main
      data-shared-session-page
      className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible print:pb-0 sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
    >
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden">
        <div className="native-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] print:overflow-visible print:pb-4">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col overflow-x-hidden">
            <header className="grid gap-3 px-1 pb-7 pt-4 print:flex print:flex-nowrap sm:flex sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-6 sm:gap-y-2 sm:px-2 sm:pb-8 sm:pt-4">
              <p className="flex min-w-0 max-w-full flex-wrap items-center justify-start gap-x-2 gap-y-2 text-left text-xs leading-5 text-black/60 dark:text-white/65 print:max-w-none print:flex-nowrap print:whitespace-nowrap sm:max-w-[60%] sm:gap-x-1.5 sm:gap-y-1 sm:pl-1 sm:text-[0.8rem]">
                <span>This is a copy of a conversation between Tiles and</span>
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  {sharedSession.sharedBy.avatarUrl ? (
                    <img
                      src={sharedSession.sharedBy.avatarUrl}
                      alt={sharedByLabel}
                      className="h-4 w-4 rounded-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span
                      className="h-4 w-4 rounded-full bg-black/15 dark:bg-white/25"
                      aria-hidden
                    />
                  )}
                  <a
                    href={blueskyProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate font-medium text-black/65 underline decoration-black/20 underline-offset-2 transition-colors hover:text-black/85 hover:decoration-black/35 dark:text-white/75 dark:decoration-white/25 dark:hover:text-white dark:hover:decoration-white/40"
                    title="Open Bluesky profile"
                  >
                    {sharedSession.sharedBy.handle
                      ? `@${sharedSession.sharedBy.handle.replace(/^@+/, "")}`
                      : sharedByLabel}
                  </a>
                </span>
              </p>
              <div className="flex min-w-0 max-w-full items-center justify-start gap-2.5 text-left text-xs leading-5 text-black/68 dark:text-white/72 sm:max-w-[38%] sm:justify-end sm:gap-2 sm:text-right">
                <span
                  className="min-w-0 truncate font-medium"
                  title={pageUrl || undefined}
                >
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
                  {copiedLink ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadMarkdownTranscript(
                      sharedSession,
                      sharedByLabel,
                      pageUrl,
                    )
                  }
                  className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-black/62 transition-colors hover:text-black dark:text-white/62 dark:hover:text-white"
                  aria-label="Download transcript as Markdown"
                  title="Download transcript"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </header>

            {sharedSession.messages.length > 0 ? (
              <div className="flex min-w-0 flex-col gap-6 py-5 sm:gap-7 sm:py-3">
                {sharedSession.messages.map((message, index) => (
                  <MessageBubble
                    key={`${message.role}-${index}`}
                    message={message}
                    modelLabel={sharedSession.modelsUsed[0] ?? null}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}

            <footer className="mt-auto pt-5">
              <div className="border-t border-black/10 pt-3 dark:border-white/10">
                <p className="text-center text-[0.68rem] leading-4 text-black/55 dark:text-white/55 sm:text-[0.72rem]">
                  <span className="block">
                    We do not store a copy of the shared conversation on our
                    servers.
                  </span>
                  <span className="mt-1 block">
                    <span>View source </span>
                    {atExploreUrl ? (
                      <a
                        href={atExploreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/40 dark:decoration-white/25 dark:hover:text-white/70 dark:hover:decoration-white/40"
                      >
                        {sharedSession.sourceUri}
                      </a>
                    ) : (
                      <span>{sharedSession.sourceUri}</span>
                    )}
                  </span>
                </p>
              </div>
            </footer>
          </div>
        </div>
      </section>
      <ShareFloatingDownloadBar
        themePreference={themePreference}
        isDark={isDark}
        onSetThemePreference={setThemePreference}
      />
    </main>
  )
}
