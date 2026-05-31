"use client"

import {
  AlertCircle,
  Brain,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Terminal,
  Wrench,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createMathPlugin } from "@streamdown/math"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Streamdown } from "streamdown"
import "katex/dist/katex.min.css"
import { SharePageQrCode } from "@/components/share-page-qr-code"
import { normalizeShareMathMarkdown } from "@/lib/normalize-share-math-markdown"
import {
  getSharedSession,
  type SharedSession,
  type SharedSessionMessage,
} from "@/lib/shared-session"
import { cn } from "@/lib/utils"

const shareMathPlugin = createMathPlugin({
  singleDollarTextMath: true,
})

interface ShareSessionClientProps {
  mockApiUrl?: string
  initialSharedSession?: SharedSession | null
  shareToken?: string
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

function buildAtprotoAtUriUrl(sourceUri: string): string | null {
  if (!sourceUri.startsWith("at://")) {
    return null
  }

  return `https://atproto.at/uri/${encodeURIComponent(sourceUri)}`
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
  const normalizedContent = useMemo(
    () => normalizeShareMathMarkdown(content.replace(/\r\n?/g, "\n")),
    [content],
  )

  return (
    <Streamdown
      mode="static"
      className="share-markdown break-words"
      urlTransform={transformShareMarkdownUrl}
      plugins={{ math: shareMathPlugin }}
      controls={{ table: true, code: false, mermaid: false }}
      lineNumbers={false}
      components={{
        a: ({ href, children, className, node: _node, ...props }) => {
          const safeHref =
            typeof href === "string" && isSafeMarkdownUrl(href)
              ? href
              : undefined
          const isLocal = safeHref?.startsWith("/") || safeHref?.startsWith("#")

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

type ReasoningSegment =
  | {
      type: "reasoning"
      content: string
    }
  | {
      type: "tool-call" | "tool-result"
      content: string
    }

const reasoningMarkerPattern =
  /\*\*\[(Reasoning|ToolCall|ToolResult|ToolOutput)\]\*\*/g

function parseReasoningSegments(content: string): ReasoningSegment[] {
  const normalizedContent = content.replace(/\r\n?/g, "\n").trim()
  const segments: ReasoningSegment[] = []
  let activeType: ReasoningSegment["type"] = "reasoning"
  let lastIndex = 0

  for (const match of normalizedContent.matchAll(reasoningMarkerPattern)) {
    const markerIndex = match.index ?? 0
    const segmentContent = normalizedContent.slice(lastIndex, markerIndex).trim()

    if (segmentContent) {
      segments.push({
        type: activeType,
        content: segmentContent,
      })
    }

    activeType =
      match[1] === "ToolCall"
        ? "tool-call"
        : match[1] === "ToolResult" || match[1] === "ToolOutput"
          ? "tool-result"
          : "reasoning"
    lastIndex = markerIndex + match[0].length
  }

  const trailingContent = normalizedContent.slice(lastIndex).trim()

  if (trailingContent) {
    segments.push({
      type: activeType,
      content: trailingContent,
    })
  }

  return segments
}

function parseToolPayload(content: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(content.trim()) as unknown
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

function formatToolValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join(" ")
  }

  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "object") {
    return JSON.stringify(value)
  }

  return String(value)
}

function getToolCallSummary(payload: Record<string, unknown> | null): {
  label: string
  detail: string
  icon: "terminal" | "file" | "tool"
} {
  if (!payload) {
    return {
      label: "Tool call",
      detail: "View raw invocation",
      icon: "tool",
    }
  }

  if (Array.isArray(payload.command)) {
    return {
      label: "Shell command",
      detail: formatToolValue(payload.command),
      icon: "terminal",
    }
  }

  if (typeof payload.path === "string") {
    const lineStart = formatToolValue(payload.line_start)
    const lineEnd = formatToolValue(payload.line_end)
    const lineRange =
      lineStart && lineEnd
        ? `:${lineStart}-${lineEnd}`
        : lineStart
          ? `:${lineStart}`
          : ""

    return {
      label: "Read file",
      detail: `${payload.path}${lineRange}`,
      icon: "file",
    }
  }

  const toolName =
    formatToolValue(payload.tool) ||
    formatToolValue(payload.name) ||
    formatToolValue(payload.function) ||
    "Tool call"

  return {
    label: toolName,
    detail: "View parameters",
    icon: "tool",
  }
}

function ToolIcon({ icon }: { icon: "terminal" | "file" | "tool" }) {
  const className = "h-3.5 w-3.5"

  if (icon === "terminal") {
    return <Terminal className={className} aria-hidden />
  }

  if (icon === "file") {
    return <FileText className={className} aria-hidden />
  }

  return <Wrench className={className} aria-hidden />
}

function ToolCallCard({ content }: { content: string }) {
  const payload = parseToolPayload(content)
  const summary = getToolCallSummary(payload)
  const rows = payload ? Object.entries(payload) : []
  const rawPayload = payload ? JSON.stringify(payload, null, 2) : content.trim()

  return (
    <div className="min-w-0 py-1 text-black/68 dark:text-white/68">
      <div className="flex min-w-0 items-start gap-2.5">
        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center text-black/48 dark:text-white/48">
          <ToolIcon icon={summary.icon} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-[0.82rem] font-medium leading-6 text-black/70 dark:text-white/72">
              {summary.label}
            </span>
            <span className="font-mono text-[0.76rem] leading-6 text-black/52 dark:text-white/52">
              {summary.detail}
            </span>
          </div>
          <details className="mt-0.5">
            <summary className="inline cursor-pointer text-[0.72rem] font-medium leading-5 text-black/42 transition-colors hover:text-black/62 dark:text-white/42 dark:hover:text-white/62">
              Parameters
            </summary>
            {rows.length > 0 ? (
              <div className="mt-1.5 grid text-[0.72rem] leading-5">
                {rows.map(([key, value]) => (
                  <div
                    key={key}
                    className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-2 py-0.5"
                  >
                    <span className="font-mono text-black/36 dark:text-white/36">
                      {key}
                    </span>
                    <span className="min-w-0 break-words font-mono text-black/58 dark:text-white/58">
                      {formatToolValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="mt-1.5 overflow-x-auto font-mono text-[0.72rem] leading-5 text-black/58 dark:text-white/58">
                {rawPayload}
              </pre>
            )}
          </details>
        </div>
      </div>
    </div>
  )
}

function ToolResultCard({ content }: { content: string }) {
  return (
    <div className="min-w-0 py-1 pl-0 text-black/68 dark:text-white/68">
      <div className="mb-1 flex items-center gap-2 text-[0.82rem] font-medium leading-6 text-black/58 dark:text-white/62">
        <Check className="h-3.5 w-3.5" aria-hidden />
        <span>Tool result</span>
      </div>
      <MarkdownMessage content={content} />
    </div>
  )
}

function ReasoningSegmentList({ content }: { content: string }) {
  const segments = useMemo(() => parseReasoningSegments(content), [content])

  return (
    <div className="grid gap-4">
      {segments.map((segment, index) => {
        if (segment.type === "tool-call") {
          return <ToolCallCard key={index} content={segment.content} />
        }

        if (segment.type === "tool-result") {
          return <ToolResultCard key={index} content={segment.content} />
        }

        return <MarkdownMessage key={index} content={segment.content} />
      })}
    </div>
  )
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
        <Brain className="h-4 w-4 shrink-0" aria-hidden />
        <span>Reasoning details</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform group-hover:text-black/70 dark:group-hover:text-white/60 ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {expanded ? (
        <div className="mt-4 border-l-2 border-black/20 pl-5 text-[0.95rem] leading-7 text-black/75 dark:border-white/24 dark:text-white/70">
          <ReasoningSegmentList content={content} />
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
      <h1 className="font-sans text-2xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#1d1d1f] dark:text-[#EDEDEF] sm:text-3xl">
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
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 transition-opacity hover:opacity-85 sm:gap-2.5"
            >
              <Image
                src="/icon-mark-transparent-white.svg"
                alt="Tiles"
                width={40}
                height={40}
                className={`h-6 w-6 shrink-0 opacity-90 sm:h-7 sm:w-7 ${isDark ? "" : "invert"}`}
              />
              <span
                className={`shrink-0 text-sm font-semibold leading-none tracking-[-0.01em] sm:text-base ${
                  isDark ? "text-[#e7e7ed]" : "text-[#1d1d1f]"
                }`}
              >
                Tiles
              </span>
            </Link>
            <span className="inline-flex min-w-0 items-baseline">
              <span
                className={`ml-0.5 hidden min-w-0 truncate text-xs leading-none min-[430px]:inline sm:hidden ${
                  isDark ? "text-white/55" : "text-black/55"
                }`}
              >
                Own your AI
              </span>
              <span
                className={`ml-0.5 hidden text-xs leading-none sm:inline ${
                  isDark ? "text-white/55" : "text-black/55"
                }`}
              >
                Own your AI
              </span>
            </span>
          </div>
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
              Download
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
  shareToken = "",
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
    if (typeof window === "undefined" || mockApiUrl || !shareToken) {
      return
    }
    const load = async () => {
      const fragment = decodeURIComponent(window.location.hash.slice(1))
      const sharedSession = await getSharedSession(shareToken, fragment)

      setSharedSession(sharedSession)
    }

    load()
  }, [mockApiUrl, shareToken])

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
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
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
    if (
      !themeReady ||
      typeof window === "undefined" ||
      typeof document === "undefined"
    ) {
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
  const atprotoUriUrl = useMemo(
    () => buildAtprotoAtUriUrl(sharedSession?.sourceUri ?? ""),
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
        className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible lg:min-h-screen lg:overflow-visible lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
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
        className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
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
      className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible print:pb-0 sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
    >
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-hidden">
        <div className="native-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] [scrollbar-gutter:stable] print:overflow-visible print:pb-4">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col overflow-x-hidden">
            <header className="relative flex flex-col gap-3 px-4 pb-7 pt-4 pr-[5.75rem] print:flex-row print:flex-nowrap print:items-start print:justify-between print:gap-x-6 print:px-2 print:pr-2 sm:px-5 sm:pb-8 sm:pr-[6.25rem] sm:pt-4">
              <SharePageQrCode
                url={pageUrl}
                isDark={isDark}
                size={80}
                className="absolute right-0 top-0 print:static print:float-right"
              />
              <div className="flex min-w-0 max-w-full items-center justify-start gap-2.5 text-left text-xs leading-5 text-black/68 dark:text-white/72 print:max-w-[42%] sm:gap-2">
                <span
                  className="min-w-0 truncate font-medium"
                  title={pageUrl || undefined}
                >
                  {shareLinkLabel}
                </span>
                <span className="shrink-0 rounded-sm border border-black/12 px-1.5 py-0.5 text-[0.65rem] font-medium leading-4 text-black/66 dark:border-white/16 dark:text-white/72">
                  {sharedSession.isPrivateLink ? "Private link" : "Public link"}
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
              <p className="max-w-full text-left text-xs leading-5 text-black/60 dark:text-white/65 sm:text-[0.8rem] print:max-w-none print:whitespace-nowrap">
                {sharedSession.isPrivateLink
                  ? "This is a private copy of a conversation between Tiles and"
                  : "This is a public copy of a conversation between Tiles and"}{" "}
                <span className="inline-flex max-w-full items-center gap-1.5 align-[-0.2em] whitespace-nowrap">
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
                    className="font-medium text-black/65 underline decoration-black/20 underline-offset-2 transition-colors hover:text-black/85 hover:decoration-black/35 dark:text-white/75 dark:decoration-white/25 dark:hover:text-white dark:hover:decoration-white/40"
                    title="Open Bluesky profile"
                  >
                    {sharedSession.sharedBy.handle
                      ? `@${sharedSession.sharedBy.handle.replace(/^@+/, "")}`
                      : sharedByLabel}
                  </a>
                </span>
              </p>
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
                <p className="text-left text-[0.68rem] leading-4 text-black/55 dark:text-white/55 sm:text-[0.72rem]">
                  <span className="block">
                    We do not store a copy of the shared conversation on our
                    servers.
                  </span>
                  <span className="mt-1 block">
                    For private links, the key material isn&apos;t sent to the
                    server. Instead, it is appended to the URL and used to
                    decrypt the chat transcript stored on the personal data
                    server (PDS).
                  </span>
                  <span className="mt-1 block">
                    <span>Data is fetched from the user&apos;s PDS </span>
                    {atprotoUriUrl ? (
                      <a
                        href={atprotoUriUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-black/40 dark:decoration-white/25 dark:hover:text-white/70 dark:hover:decoration-white/40"
                      >
                        {sharedSession.sourceUri}
                      </a>
                    ) : (
                      <span>{sharedSession.sourceUri}</span>
                    )}
                    <span>.</span>
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
