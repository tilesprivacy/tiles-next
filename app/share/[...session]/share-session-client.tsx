"use client"

import { AlertCircle, Check, ChevronDown, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import type { SharedSession, SharedSessionMessage } from "@/lib/shared-session"

interface ShareSessionClientProps {
  mockApiUrl?: string
  initialSharedSession?: SharedSession | null
  initialErrorMessage?: string | null
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

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const [token] = match

    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-code-${match.index}`}
          className="rounded-sm bg-black/[0.08] px-1 py-0.5 font-mono text-[0.86em] text-black/80 dark:bg-white/10 dark:text-white/88"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong
          key={`${keyPrefix}-strong-${match.index}`}
          className="font-semibold text-black/90 dark:text-white/95"
        >
          {renderInlineMarkdown(
            token.slice(2, -2),
            `${keyPrefix}-strong-${match.index}`,
          )}
        </strong>,
      )
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <em
          key={`${keyPrefix}-em-${match.index}`}
          className="italic text-black/80 dark:text-white/90"
        >
          {renderInlineMarkdown(
            token.slice(1, -1),
            `${keyPrefix}-em-${match.index}`,
          )}
        </em>,
      )
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      const label = linkMatch?.[1] ?? token
      const href = linkMatch?.[2]?.trim() ?? ""

      nodes.push(
        isSafeMarkdownUrl(href) ? (
          <a
            key={`${keyPrefix}-link-${match.index}`}
            href={href}
            target={
              href.startsWith("/") || href.startsWith("#")
                ? undefined
                : "_blank"
            }
            rel={
              href.startsWith("/") || href.startsWith("#")
                ? undefined
                : "noopener noreferrer"
            }
            className="font-medium text-black underline decoration-black/25 underline-offset-4 transition-colors hover:text-black/80 hover:decoration-black/45 dark:text-white dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/45"
          >
            {renderInlineMarkdown(label, `${keyPrefix}-link-${match.index}`)}
          </a>
        ) : (
          token
        ),
      )
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim())
}

function isTableDivider(line: string): boolean {
  const cells = splitTableRow(line)
  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

function alignTableRowCells(cells: string[], columnCount: number): string[] {
  if (cells.length === columnCount) {
    return cells
  }

  if (cells.length < columnCount) {
    return [
      ...cells,
      ...Array.from({ length: columnCount - cells.length }, () => ""),
    ]
  }

  if (columnCount <= 2) {
    return [cells[0], cells.slice(1).join(" | ")].slice(0, columnCount)
  }

  return [
    cells[0],
    cells.slice(1, cells.length - (columnCount - 2)).join(" | "),
    ...cells.slice(cells.length - (columnCount - 2)),
  ]
}

function MarkdownMessage({ content }: { content: string }) {
  const normalizedContent = content.replace(/\r\n?/g, "\n")
  const lines = normalizedContent.split("\n")
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    const fenceMatch = trimmed.match(/^```(\w+)?\s*$/)

    if (fenceMatch) {
      const codeLines: string[] = []
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      blocks.push(
        <pre
          key={`code-${index}`}
          className="overflow-x-auto rounded-md border border-black/10 bg-black/5 p-3 text-[0.82rem] leading-6 text-black/80 dark:border-white/10 dark:bg-black/25 dark:text-white/82"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      )
      continue
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push(<hr key={`hr-${index}`} className="border-black/10 dark:border-white/10" />)
      index += 1
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/)

    if (headingMatch) {
      const level = headingMatch[1].length
      const headingClass =
        level <= 2
          ? "text-base font-semibold leading-6 text-black/90 dark:text-white/95"
          : "text-sm font-semibold leading-6 text-black/85 dark:text-white/92"

      blocks.push(
        <p key={`heading-${index}`} className={headingClass}>
          {renderInlineMarkdown(headingMatch[2], `heading-${index}`)}
        </p>,
      )
      index += 1
      continue
    }

    if (
      line.includes("|") &&
      index + 1 < lines.length &&
      isTableDivider(lines[index + 1])
    ) {
      const headerCells = splitTableRow(line)
      const rows: string[][] = []
      index += 2

      while (
        index < lines.length &&
        lines[index].includes("|") &&
        lines[index].trim()
      ) {
        rows.push(
          alignTableRowCells(splitTableRow(lines[index]), headerCells.length),
        )
        index += 1
      }

      blocks.push(
        <div
          key={`table-${index}`}
          className="overflow-x-auto rounded-md border border-black/10 dark:border-white/10"
        >
          <table className="min-w-full border-collapse text-left text-[0.78rem] leading-5">
            <thead className="bg-black/[0.045] text-black/75 dark:bg-white/[0.045] dark:text-white/84">
              <tr>
                {headerCells.map((cell, cellIndex) => (
                  <th
                    key={`table-${index}-head-${cellIndex}`}
                    className="border-b border-black/10 px-3 py-2 font-medium dark:border-white/10"
                  >
                    {renderInlineMarkdown(
                      cell,
                      `table-${index}-head-${cellIndex}`,
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-black/72 dark:divide-white/10 dark:text-white/72">
              {rows.map((row, rowIndex) => (
                <tr key={`table-${index}-row-${rowIndex}`}>
                  {headerCells.map((_, cellIndex) => (
                    <td
                      key={`table-${index}-cell-${rowIndex}-${cellIndex}`}
                      className="px-3 py-2 align-top"
                    >
                      {renderInlineMarkdown(
                        row[cellIndex] ?? "",
                        `table-${index}-cell-${rowIndex}-${cellIndex}`,
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    const listMatch = trimmed.match(/^((?:[-*])|\d+\.)\s+(.+)$/)

    if (listMatch) {
      const ordered = /^\d+\.$/.test(listMatch[1])
      const orderedStart = ordered ? Number.parseInt(listMatch[1], 10) : 1
      const items: string[] = []

      while (index < lines.length) {
        const currentLine = lines[index]
        const currentMatch = currentLine
          .trim()
          .match(/^((?:[-*])|\d+\.)\s+(.+)$/)

        if (!currentMatch || /^\d+\.$/.test(currentMatch[1]) !== ordered) {
          break
        }

        const itemLines = [currentMatch[2]]
        index += 1

        while (index < lines.length && lines[index].trim()) {
          const continuationLine = lines[index]
          const continuationTrimmed = continuationLine.trim()
          const continuationListMatch = continuationTrimmed.match(
            /^((?:[-*])|\d+\.)\s+(.+)$/,
          )
          const continuationOrdered =
            continuationListMatch !== null &&
            /^\d+\.$/.test(continuationListMatch[1])
          const isIndentedContinuation = /^\s+/.test(continuationLine)

          if (
            continuationTrimmed.match(/^```/) ||
            continuationTrimmed.match(/^(#{1,4})\s+.+$/) ||
            /^---+$/.test(continuationTrimmed) ||
            (continuationLine.includes("|") &&
              index + 1 < lines.length &&
              isTableDivider(lines[index + 1])) ||
            (continuationListMatch &&
              (continuationOrdered === ordered || !isIndentedContinuation))
          ) {
            break
          }

          itemLines.push(continuationTrimmed.replace(/^[-*]\s+/, ""))
          index += 1
        }

        items.push(itemLines.join("\n"))
      }

      blocks.push(
        ordered ? (
          <ol
            key={`list-${index}`}
            start={orderedStart}
            className="list-decimal space-y-2 pl-5 text-black/80 dark:text-white/80"
          >
            {items.map((item, itemIndex) => (
              <li
                key={`list-${index}-${itemIndex}`}
                className="whitespace-pre-wrap pl-1"
              >
                {renderInlineMarkdown(item, `list-${index}-${itemIndex}`)}
              </li>
            ))}
          </ol>
        ) : (
          <ul
            key={`list-${index}`}
            className="list-disc space-y-2 pl-5 text-black/80 dark:text-white/80"
          >
            {items.map((item, itemIndex) => (
              <li
                key={`list-${index}-${itemIndex}`}
                className="whitespace-pre-wrap pl-1"
              >
                {renderInlineMarkdown(item, `list-${index}-${itemIndex}`)}
              </li>
            ))}
          </ul>
        ),
      )
      continue
    }

    const paragraphLines: string[] = [trimmed]
    index += 1

    while (index < lines.length && lines[index].trim()) {
      const nextLine = lines[index]
      const nextTrimmed = nextLine.trim()

      if (
        nextTrimmed.match(/^```/) ||
        nextTrimmed.match(/^(#{1,4})\s+.+$/) ||
        nextTrimmed.match(/^((?:[-*])|\d+\.)\s+.+$/) ||
        /^---+$/.test(nextTrimmed) ||
        (nextLine.includes("|") &&
          index + 1 < lines.length &&
          isTableDivider(lines[index + 1]))
      ) {
        break
      }

      paragraphLines.push(nextTrimmed)
      index += 1
    }

    blocks.push(
      <p key={`paragraph-${index}`} className="whitespace-pre-wrap break-words">
        {renderInlineMarkdown(paragraphLines.join("\n"), `paragraph-${index}`)}
      </p>,
    )
  }

  return <div className="space-y-3 break-words">{blocks}</div>
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
        className="group flex w-full items-center gap-2 text-left text-[0.95rem] font-medium leading-6 text-black/40 transition-colors hover:text-black/60 dark:text-white/36 dark:hover:text-white/52"
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
    <div className="mt-3 flex items-center gap-2 text-[0.78rem] text-black/45 dark:text-white/48">
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard.writeText(copyPayload).then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1200)
          })
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-black/45 transition-colors hover:text-black/70 dark:text-white/48 dark:hover:text-white/70"
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
      className={`flex w-full print:px-2 ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[92%] break-inside-avoid rounded-2xl px-4 py-3 text-sm leading-7 print:max-w-[94%] print:break-inside-auto sm:max-w-[78%] sm:px-5 sm:text-[0.95rem] ${
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
  isDark,
  onToggleTheme,
}: {
  isDark: boolean
  onToggleTheme: () => void
}) {
  return (
    <div className="share-floating-download-bar pointer-events-none fixed inset-x-0 bottom-[max(0.65rem,env(safe-area-inset-bottom,0px))] z-[60] px-3 print:hidden sm:bottom-4 sm:px-4">
      <div className="mx-auto w-full max-w-[38rem]">
        <div
          className={`pointer-events-auto flex items-center justify-between gap-2 rounded-[0.9rem] border px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm sm:gap-3 sm:px-3 sm:py-2 ${
            isDark
              ? "border-white/10 bg-[#1f1f1f]/95"
              : "border-black/10 bg-white/95"
          }`}
        >
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-85 sm:gap-2.5"
          >
            <Image
              src="/icon-mark-transparent-white.svg"
              alt="Tiles"
              width={40}
              height={40}
              className={`h-6 w-6 shrink-0 opacity-90 sm:h-7 sm:w-7 ${isDark ? "" : "invert"}`}
            />
            <span className="inline-flex min-w-0 items-center gap-1.5 sm:gap-2">
              <span
                className={`truncate text-sm font-semibold tracking-[-0.01em] sm:text-base ${
                  isDark ? "text-[#e7e7ed]" : "text-[#1d1d1f]"
                }`}
              >
                Tiles
              </span>
              <span
                className={`max-w-[9.5rem] truncate text-xs sm:hidden ${
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
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-[0.65rem] transition-colors ${
                isDark
                  ? "text-[#e7e7ed]/90 hover:text-[#e7e7ed]"
                  : "text-[#1d1d1f]/85 hover:text-[#1d1d1f]"
              }`}
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
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
                    d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <Link
              href="/download"
              className={`inline-flex h-8 items-center justify-center rounded-[0.65rem] border px-3 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
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
    const shouldUseDark = storedTheme === "dark"
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

    window.localStorage.setItem("share-page-theme", isDark ? "dark" : "light")
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark, themeReady])

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
        className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible lg:min-h-screen lg:overflow-visible lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
      >
        <ErrorState message={errorMessage} />
        <ShareFloatingDownloadBar
          isDark={isDark}
          onToggleTheme={() => setIsDark((current) => !current)}
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
          isDark={isDark}
          onToggleTheme={() => setIsDark((current) => !current)}
        />
      </main>
    )
  }

  return (
    <main
      data-shared-session-page
      className={`${isDark ? "dark bg-[#1f1f1f] text-[#E6E6E8]" : "bg-[#fbfbfd] text-[#1d1d1f]"} flex h-[100dvh] overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[calc(1rem+env(safe-area-inset-top,0px))] print:h-auto print:overflow-visible sm:px-6 lg:px-8 lg:pt-[calc(1.25rem+env(safe-area-inset-top,0px))]`}
    >
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <div className="native-scrollbar min-h-0 flex-1 overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] print:overflow-visible print:pb-4 lg:pb-4">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
            <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 px-2 pb-7 pt-4 print:flex-nowrap sm:gap-y-2 sm:px-2 sm:pb-8 sm:pt-4">
              <p className="flex max-w-full flex-wrap items-center justify-start gap-x-2 gap-y-2 text-left text-xs leading-5 text-black/45 dark:text-white/55 print:max-w-none print:flex-nowrap print:whitespace-nowrap sm:max-w-[60%] sm:gap-x-1.5 sm:gap-y-1 sm:text-[0.8rem]">
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
              <div className="flex min-w-0 max-w-full items-center justify-end gap-2.5 text-right text-xs leading-5 text-black/58 dark:text-white/62 sm:max-w-[38%] sm:gap-2">
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
              </div>
            </header>

            {sharedSession.messages.length > 0 ? (
              <div className="flex flex-col gap-6 py-5 sm:gap-7 sm:py-3">
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

            <footer className="mt-auto border-t border-black/10 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-3 dark:border-white/10">
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
            </footer>
          </div>
        </div>
      </section>
      <ShareFloatingDownloadBar
        isDark={isDark}
        onToggleTheme={() => setIsDark((current) => !current)}
      />
    </main>
  )
}
