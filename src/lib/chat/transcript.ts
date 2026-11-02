// The "Download transcript" Markdown file.
import type { RenderedSession } from "#lib/chat/render"

const filenamePart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)

export function transcriptMarkdown(session: RenderedSession, details: { sharedBy: string; sourceUri: string; pageUrl: string }): string {
  const lines = [
    `# ${session.name || "Shared Tiles conversation"}`,
    "",
    `- Shared by: ${details.sharedBy}`,
    `- Created: ${session.createdAt}`,
    `- Source: ${details.sourceUri}`,
    ...(details.pageUrl ? [`- Share link: ${details.pageUrl}`] : []),
    ...(session.modelsUsed.length ? [`- Models: ${session.modelsUsed.join(", ")}`] : []),
    "",
    "---",
    "",
  ]
  session.messages.forEach((message, index) => {
    lines.push(`## ${index + 1}. ${message.role === "assistant" ? "Assistant" : "User"}`, "")
    if (message.role === "assistant" && message.model) lines.push(`_Model: ${message.model}_`, "")
    lines.push(message.source.trim(), "")
  })
  return `${lines.join("\n").trim()}\n`
}

export const transcriptFilename = (session: RenderedSession) =>
  `${filenamePart(session.name) || filenamePart(session.sessionId) || "tiles-shared-chat"}.md`
