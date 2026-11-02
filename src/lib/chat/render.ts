// Turns a ChatSession into what the viewer shows: markdown as sanitized
// HTML, tool calls and results as summaries. Plain data, so the server can
// send it to the page and the browser can build it for private shares.
import { renderMarkdown, type MarkdownOptions, type RenderedMarkdown } from "#lib/chat/markdown"
import type { ChatSession, ReasoningItem, ToolCallPayload } from "#lib/chat/session"

export type ToolIcon = "terminal" | "file" | "tool"

export interface CaldirEvent {
  date: string
  time: string
  title: string
  calendar: string | null
}

export type RenderedReasoning =
  | { type: "markdown"; markdown: RenderedMarkdown }
  | {
      type: "toolCall"
      label: string
      detail: string
      icon: ToolIcon
      /** Argument rows, or the raw invocation when there are none; null when it would repeat the detail. */
      details: { rows: [string, string][] } | { raw: string } | null
    }
  | { type: "toolResult"; toolName: string | null; icon: ToolIcon; long: boolean; events: CaldirEvent[] | null; markdown: RenderedMarkdown | null }

export type RenderedMessage =
  | { role: "user"; source: string; skill: { label: string; params: string } | null; markdown: RenderedMarkdown | null }
  | { role: "assistant"; source: string; model: string | null; reasoning: RenderedReasoning[]; markdown: RenderedMarkdown | null }

export interface RenderedSession {
  sessionId: string
  name: string
  createdAt: string | null
  modelsUsed: string[]
  messages: RenderedMessage[]
}

/* Tool calls */

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map((entry) => String(entry)).join(" ")
  if (value === null || value === undefined) return ""
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

function toolArguments(payload: ToolCallPayload): Record<string, unknown> {
  const candidate = payload.arguments ?? payload.args ?? payload.input ?? payload.parameters
  return candidate && typeof candidate === "object" && !Array.isArray(candidate) ? (candidate as Record<string, unknown>) : payload
}

function shellCommand(command: unknown): string {
  if (!Array.isArray(command)) return formatValue(command)
  const parts = command.map((entry) => String(entry))
  const shell = parts[0]?.toLowerCase()
  // `bash -lc "…"` shows just the script.
  if ((shell === "bash" || shell === "sh" || shell === "zsh") && parts[1] === "-lc" && parts[2]) return parts.slice(2).join(" ")
  return parts.join(" ")
}

function toolCallSummary(payload: ToolCallPayload | null): { label: string; detail: string; icon: ToolIcon } {
  if (!payload) return { label: "Tool call", detail: "View raw invocation", icon: "tool" }

  const name = formatValue(payload.tool) || formatValue(payload.name) || formatValue(payload.function)
  const normalized = name.trim().toLowerCase()
  const args = toolArguments(payload)
  const command = args.command ?? payload.command

  if (normalized === "bash" || normalized === "shell" || Array.isArray(command)) {
    return { label: name || "Shell command", detail: shellCommand(command), icon: "terminal" }
  }
  if (normalized === "read" || normalized === "open" || typeof args.path === "string" || typeof payload.path === "string") {
    const path = formatValue(args.path)
    const start = formatValue(args.line_start)
    const end = formatValue(args.line_end)
    const range = start && end ? `:${start}-${end}` : start ? `:${start}` : ""
    return { label: name || "Read file", detail: path ? `${path}${range}` : "View file request", icon: "file" }
  }
  return { label: name || "Tool call", detail: "View parameters", icon: "tool" }
}

function renderToolCall(payload: ToolCallPayload | null, raw: string): RenderedReasoning {
  const summary = toolCallSummary(payload)
  const rawPayload = payload ? JSON.stringify(payload, null, 2) : raw.trim()
  if (!rawPayload || rawPayload.trim() === summary.detail.trim()) return { type: "toolCall", ...summary, details: null }

  const rows = payload
    ? Object.entries(toolArguments(payload))
        .filter(([key]) => key !== "tool")
        .map(([key, value]): [string, string] => [key, formatValue(value)])
    : []
  return { type: "toolCall", ...summary, details: rows.length ? { rows } : { raw: rawPayload } }
}

/* Tool results */

// `caldir` prints its agenda as dated groups of events; show those as a list.
function parseCaldirEvents(output: string): CaldirEvent[] | null {
  const datePattern = /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+[A-Z][a-z]{2}\s+\d{1,2}$/
  const eventPattern = /^\s+(all-day|\d{1,2}:\d{2})\s+(.+?)(?:\s+\[([^\]]+)\])?\s*$/
  const events: CaldirEvent[] = []
  let date: string | null = null

  // Terminal colour codes are dropped first.
  for (const line of output.replace(/\x1b\[[0-9;]*m/g, "").split("\n").map((l) => l.trimEnd())) {
    const dateMatch = line.trim().match(datePattern)
    if (dateMatch) {
      date = dateMatch[0]
      continue
    }
    const event = line.match(eventPattern)
    if (date && event) events.push({ date, time: event[1], title: event[2].trim(), calendar: event[3]?.trim() ?? null })
  }
  return events.length ? events : null
}

function renderToolResult(toolName: string | null, output: string, options: MarkdownOptions): RenderedReasoning {
  const text = output.replace(/\r\n?/g, "\n").trim()
  const shell = toolName?.toLowerCase() === "bash" || toolName?.toLowerCase() === "shell"
  const events = shell ? parseCaldirEvents(text) : null
  return {
    type: "toolResult",
    toolName,
    icon: shell ? "terminal" : "tool",
    long: text.length > 1800 || text.split("\n").length > 24,
    events,
    markdown: text && !events ? renderMarkdown(text, options) : null,
  }
}

function renderReasoning(item: ReasoningItem, options: MarkdownOptions): RenderedReasoning {
  if (item.type === "toolCall") return renderToolCall(item.payload, item.raw)
  if (item.type === "toolResult") return renderToolResult(item.toolName, item.output, options)
  return { type: "markdown", markdown: renderMarkdown(item.text, options) }
}

const skillLabel = (name: string) =>
  name
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ")

export function renderSession(session: ChatSession, options: MarkdownOptions): RenderedSession {
  return {
    sessionId: session.sessionId,
    name: session.name,
    createdAt: session.createdAt,
    modelsUsed: session.modelsUsed,
    messages: session.messages.map((message): RenderedMessage => {
      if (message.role === "user") {
        return message.skill
          ? { role: "user", source: message.source, skill: { label: skillLabel(message.skill.name), params: message.skill.params || message.text }, markdown: null }
          : { role: "user", source: message.source, skill: null, markdown: renderMarkdown(message.text, options) }
      }
      return {
        role: "assistant",
        source: message.source,
        model: message.model,
        reasoning: message.reasoning.map((item) => renderReasoning(item, options)),
        markdown: message.answer ? renderMarkdown(message.answer, options) : null,
      }
    }),
  }
}
