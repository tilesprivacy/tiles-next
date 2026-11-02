// What a shared Tiles chat is, read from its record. Two shapes exist:
// run.tiles.chat.sessionSnapshot (turns of typed messages) and the older
// run.tiles.session (plain strings with **[Reasoning]**-style markers). Both
// become the same structure here, which the viewer renders from; the marker
// text is only written out for the transcript download. Used on the server
// for public shares and in the browser for private ones, after decryption.

export type ToolCallPayload = Record<string, unknown>

export type ReasoningItem =
  | { type: "thinking"; text: string }
  | { type: "toolCall"; payload: ToolCallPayload | null; raw: string }
  | { type: "toolResult"; toolName: string | null; output: string }

export type ChatMessage =
  | {
      role: "user"
      text: string
      skill: { name: string; params: string } | null
      /** The message as the transcript download writes it. */
      source: string
    }
  | {
      role: "assistant"
      reasoning: ReasoningItem[]
      answer: string
      model: string | null
      source: string
    }

export interface ChatSession {
  sessionId: string
  name: string
  createdAt: string | null
  modelsUsed: string[]
  messages: ChatMessage[]
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const readString = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value : null)

const normalizeNewlines = (value: string) => value.replace(/\r\n?/g, "\n")

/* Labels some models write into their own output */

const REASONING_MARKER = /^\*\*\[Reasoning\]\*\*\s*\n+/
const ANSWER_DIVIDER = /\n---+\s*\n+(?:\*\*)?\[Answer\](?:\*\*)?\s*\n*/
const ANSWER_LABEL = /\n+(?:\*\*)?\[Answer\](?:\*\*)?\s*\n*/

function stripEmbeddedAnswer(thinking: string): string {
  return thinking
    .replace(/^\s*\*\*\[Reasoning\]\*\*\s*/i, "")
    .split(/\n---+\s*\n+(?:\*\*)?\[Answer\](?:\*\*)?/i)[0]
    .split(/\n+(?:\*\*)?\[Answer\](?:\*\*)?/i)[0]
    .trim()
}

function stripAnswerLabel(text: string): string {
  return text
    .replace(/^\s*---+\s*\n+(?:\*\*)?\[Answer\](?:\*\*)?\s*\n*/i, "")
    .replace(/^\s*(?:\*\*)?\[Answer\](?:\*\*)?\s*\n*/i, "")
    .trim()
}

/** Splits "**[Reasoning]** … [Answer] …" text, as the transcript and Copy use it. */
export function splitReasoning(content: string): { reasoning: string | null; answer: string } {
  const normalized = normalizeNewlines(content).trim()
  const marker = normalized.match(REASONING_MARKER)
  if (!marker) return { reasoning: null, answer: content }

  const rest = normalized.slice(marker[0].length)
  const split = rest.match(ANSWER_DIVIDER) ?? rest.match(ANSWER_LABEL)
  if (!split || split.index === undefined) return { reasoning: rest, answer: "" }
  return {
    reasoning: rest.slice(0, split.index).trim(),
    answer: rest.slice(split.index + split[0].length).trim(),
  }
}

/* Skills */

function decodeXmlAttribute(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
}

// Tiles sends a skill as <skill name="…">its instructions</skill> followed by
// what the user typed; show the skill and the typed part only.
function parseSkillTag(content: string): { name: string; params: string } | null {
  const tag = content.match(/^\s*<skill\b([^>]*)>[\s\S]*?<\/skill>\s*/i)
  if (!tag) return null
  const name = tag[1].match(/\sname=(["'])(.*?)\1/i)?.[2]
  const decoded = name ? decodeXmlAttribute(name).trim() : ""
  return decoded ? { name: decoded, params: content.slice(tag[0].length).trim() } : null
}

function userMessage(content: string, calledSkill: string | null): ChatMessage {
  const tagged = parseSkillTag(content)
  if (tagged) return { role: "user", text: tagged.params, skill: tagged, source: tagged.params }
  return {
    role: "user",
    text: content,
    skill: calledSkill ? { name: calledSkill, params: content } : null,
    source: content,
  }
}

/* run.tiles.chat.sessionSnapshot */

function toolCallPayload(item: Record<string, unknown>): ToolCallPayload {
  const raw = item.arguments
  let args: unknown = isObject(raw) ? raw : (readString(raw) ?? null)
  if (typeof args === "string") {
    try {
      args = JSON.parse(args) as unknown
    } catch {
      // Not JSON: shown as the string it is.
    }
  }
  return { tool: readString(item.name) ?? "Tool call", arguments: args }
}

interface MessageParts {
  reasoning: ReasoningItem[]
  // The transcript keeps the marker format the viewer has always exported.
  reasoningSource: string[]
  visible: string[]
}

function readParts(content: unknown): MessageParts {
  const parts: MessageParts = { reasoning: [], reasoningSource: [], visible: [] }

  const addVisible = (text: string) => {
    const visible = stripAnswerLabel(normalizeNewlines(text))
    if (visible) parts.visible.push(visible)
  }
  const addThinking = (thinking: string) => {
    const reasoning = stripEmbeddedAnswer(normalizeNewlines(thinking))
    if (!reasoning) return
    parts.reasoning.push({ type: "thinking", text: reasoning })
    parts.reasoningSource.push(`**[Reasoning]**\n\n${reasoning}`)
  }

  if (!Array.isArray(content)) {
    const text = readString(content)
    if (text) addVisible(text)
    return parts
  }

  for (const item of content) {
    if (!isObject(item)) continue
    if (item.type === "toolCall") {
      const payload = toolCallPayload(item)
      const raw = JSON.stringify(payload, null, 2)
      parts.reasoning.push({ type: "toolCall", payload, raw })
      parts.reasoningSource.push(`**[ToolCall]**\n${raw}`)
      continue
    }
    const text = readString(item.text)
    const thinking = readString(item.thinking)
    if (item.type === "thinking" && thinking) addThinking(thinking)
    else if (text) addVisible(text)
    else if (thinking) addThinking(thinking)
  }
  return parts
}

// Caldir turns show the user's request as a call to the Caldir skill. Only a
// tool call that actually runs caldir (its CLI or its SKILL.md) counts.
function turnCallsCaldir(messages: unknown[]): boolean {
  return messages.some(
    (message) =>
      isObject(message) &&
      Array.isArray(message.content) &&
      message.content.some(
        (item) =>
          isObject(item) &&
          item.type === "toolCall" &&
          /\bcaldir\b/i.test(typeof item.arguments === "string" ? item.arguments : JSON.stringify(item.arguments ?? "")),
      ),
  )
}

interface PendingAnswer {
  reasoning: ReasoningItem[]
  reasoningSource: string[]
  answers: string[]
  model: string | null
}

function snapshotMessages(turns: unknown[]): ChatMessage[] {
  const messages: ChatMessage[] = []
  let pending: PendingAnswer | null = null

  // Everything the assistant does until the next user message is one reply.
  const flush = () => {
    if (!pending) return
    const reasoning = pending.reasoningSource.join("\n\n").trim()
    const answer = pending.answers.join("\n\n").trim()
    const labelled = reasoning && !reasoning.startsWith("**[Reasoning]**") ? `**[Reasoning]**\n\n${reasoning}` : reasoning
    const source = labelled && answer ? `${labelled}\n\n**[Answer]**\n\n${answer}` : labelled || answer
    if (source) {
      messages.push({ role: "assistant", reasoning: pending.reasoning, answer, model: pending.model, source })
    }
    pending = null
  }

  for (const turn of turns) {
    if (!isObject(turn) || !Array.isArray(turn.messages)) continue
    const model = readString(turn.model)
    const calledSkill = turnCallsCaldir(turn.messages) ? "caldir" : null

    for (const message of turn.messages) {
      if (!isObject(message)) continue
      const parts = readParts(message.content)

      if (message.role === "user") {
        const content = [parts.reasoningSource.join("\n\n"), parts.visible.join("\n\n")].filter(Boolean).join("\n\n").trim()
        if (!content) continue
        flush()
        messages.push(userMessage(content, calledSkill))
      } else if (message.role === "assistant") {
        if (!parts.reasoning.length && !parts.visible.length) continue
        pending ??= { reasoning: [], reasoningSource: [], answers: [], model }
        pending.model ??= model
        pending.reasoning.push(...parts.reasoning)
        pending.reasoningSource.push(...parts.reasoningSource)
        const visible = parts.visible.join("\n\n").trim()
        if (visible) pending.answers.push(visible)
      } else if (message.role === "toolResult") {
        const output = parts.visible.join("\n\n").trim() || parts.reasoningSource.join("\n\n").trim()
        if (!output) continue
        const toolName = readString(message.toolName)
        pending ??= { reasoning: [], reasoningSource: [], answers: [], model }
        pending.model ??= model
        pending.reasoning.push({ type: "toolResult", toolName, output })
        pending.reasoningSource.push(`**[ToolResult]**\n${toolName ? `Tool: ${toolName}\n\n${output}` : output}`)
      }
    }
  }
  flush()
  return messages
}

/* run.tiles.session (legacy): markers inside the strings are the structure */

const SEGMENT_MARKER = /\*\*\[(Reasoning|ToolCall|ToolResult|ToolOutput)\]\*\*/g

function parseLegacyToolCall(content: string): ToolCallPayload | null {
  const trimmed = content.trim()
  try {
    const parsed = JSON.parse(trimmed) as unknown
    return isObject(parsed) ? parsed : null
  } catch {
    // Older text shape: "Tool: bash\nArguments: {…}"
  }
  const tool = trimmed.match(/^Tool:\s*(.+?)\s*$/im)?.[1]?.trim()
  if (!tool) return null
  const payload: ToolCallPayload = { tool }
  const args = trimmed.match(/^Arguments:\s*([\s\S]*)$/im)?.[1]?.trim()
  if (args) {
    try {
      payload.arguments = JSON.parse(args) as unknown
    } catch {
      payload.arguments = args
    }
  }
  return payload
}

function legacyReasoning(reasoning: string): ReasoningItem[] {
  const text = reasoning.trim()
  const items: ReasoningItem[] = []
  let kind = "Reasoning"
  let last = 0

  const push = (segment: string) => {
    const content = segment.trim()
    if (!content) return
    if (kind === "ToolCall") {
      items.push({ type: "toolCall", payload: parseLegacyToolCall(content), raw: content })
    } else if (kind === "ToolResult" || kind === "ToolOutput") {
      const tool = content.match(/^Tool:\s*(.+?)\s*(?:\n|$)/)
      items.push(
        tool
          ? { type: "toolResult", toolName: tool[1].trim(), output: content.slice(tool[0].length).trim() }
          : { type: "toolResult", toolName: null, output: content },
      )
    } else {
      items.push({ type: "thinking", text: content })
    }
  }

  for (const match of text.matchAll(SEGMENT_MARKER)) {
    push(text.slice(last, match.index))
    kind = match[1]
    last = (match.index ?? 0) + match[0].length
  }
  push(text.slice(last))
  return items
}

function legacyAssistant(content: string): ChatMessage {
  const { reasoning, answer } = splitReasoning(content)
  return { role: "assistant", reasoning: reasoning ? legacyReasoning(reasoning) : [], answer, model: null, source: content }
}

function legacyMessages(contents: unknown[]): ChatMessage[] {
  return contents.flatMap((entry): ChatMessage[] => {
    if (!isObject(entry)) return []
    const content = readString(entry.content)
    if (entry.role === "user" && content) return [userMessage(normalizeNewlines(content), null)]
    if (entry.role === "assistant" && content) return [legacyAssistant(normalizeNewlines(content))]

    const pair: ChatMessage[] = []
    const user = readString(entry.user)
    const assistant = readString(entry.assistant)
    if (user) pair.push(userMessage(normalizeNewlines(user), null))
    if (assistant) pair.push(legacyAssistant(normalizeNewlines(assistant)))
    return pair
  })
}

const uniqueStrings = (values: unknown[]) => [...new Set(values.map(readString).filter((v): v is string => v !== null))]

export function normalizeSession(payload: unknown): ChatSession {
  const record = isObject(payload) ? payload : {}

  if (Array.isArray(record.turns)) {
    return {
      sessionId: readString(record.sessionId) ?? "shared-session",
      name: readString(record.name) ?? "Shared session",
      createdAt: readString(record.createdAt),
      modelsUsed: uniqueStrings(record.turns.map((turn) => (isObject(turn) ? turn.model : null))),
      messages: snapshotMessages(record.turns),
    }
  }

  return {
    sessionId: readString(record.session_id) ?? "shared-session",
    name: readString(record.name) ?? "Shared session",
    createdAt: readString(record.created_at),
    modelsUsed: Array.isArray(record.models_used) ? uniqueStrings(record.models_used) : [],
    messages: Array.isArray(record.contents) ? legacyMessages(record.contents) : [],
  }
}

/** Every text that is rendered as markdown. */
export const sessionTexts = (session: ChatSession): string[] =>
  session.messages.flatMap((message) =>
    message.role === "user"
      ? [message.text]
      : [message.answer, ...message.reasoning.map((item) => (item.type === "thinking" ? item.text : item.type === "toolResult" ? item.output : ""))],
  )
