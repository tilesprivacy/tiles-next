"use client"

import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

function isSafeMarkdownUrl(url: string): boolean {
  const trimmed = url.trim()
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return true
  }
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function roadmapUrlTransform(url: string): string | undefined {
  return isSafeMarkdownUrl(url) ? url : undefined
}

const roadmapMarkdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1
      {...props}
      className="mb-2 mt-0 scroll-mt-4 text-[1.05rem] font-semibold leading-snug tracking-[-0.02em] text-foreground first:mt-0"
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="mb-2 mt-5 scroll-mt-4 text-[0.98rem] font-semibold leading-snug tracking-[-0.015em] text-foreground first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="mb-1.5 mt-4 scroll-mt-4 text-[0.94rem] font-semibold leading-snug text-foreground first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 {...props} className="mb-1.5 mt-3 scroll-mt-4 text-[0.92rem] font-semibold leading-snug text-foreground first:mt-0">
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 {...props} className="mb-1 mt-3 scroll-mt-4 text-[0.9rem] font-medium leading-snug text-foreground first:mt-0">
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 {...props} className="mb-1 mt-3 scroll-mt-4 text-[0.88rem] font-medium leading-snug text-foreground/90 first:mt-0">
      {children}
    </h6>
  ),
  p: ({ children, ...props }) => (
    <p
      {...props}
      className="my-2 text-[0.92rem] leading-relaxed text-foreground first:mt-0 last:mb-0 [&+ul]:mt-2 [&+ol]:mt-2"
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      {...props}
      className="my-2 list-outside list-disc space-y-1.5 pl-5 text-[0.92rem] leading-relaxed text-foreground marker:text-foreground/80"
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      {...props}
      className="my-2 list-outside list-decimal space-y-1.5 pl-5 text-[0.92rem] leading-relaxed text-foreground marker:text-foreground/80"
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li
      {...props}
      className="pl-0.5 [&>ol]:mt-2 [&>ol]:pl-4 [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&>ul]:mt-2 [&>ul]:pl-4"
    >
      {children}
    </li>
  ),
  a: ({ href, children, ...props }) => {
    const safe = typeof href === "string" && isSafeMarkdownUrl(href) ? href : undefined
    const local = safe?.startsWith("/") || safe?.startsWith("#")
    return (
      <a
        {...props}
        href={safe}
        target={local ? undefined : "_blank"}
        rel={local ? undefined : "noopener noreferrer"}
        className="font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground/45"
      >
        {children}
      </a>
    )
  },
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em {...props} className="italic">
      {children}
    </em>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = typeof className === "string" && /\blanguage-[\w-]+\b/.test(className)
    if (isBlock) {
      return (
        <code {...props} className={cn("font-mono text-[0.82rem] leading-relaxed text-foreground", className)}>
          {children}
        </code>
      )
    }
    return (
      <code
        {...props}
        className="rounded bg-black/[0.08] px-1 py-0.5 font-mono text-[0.86em] text-foreground dark:bg-white/10"
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className="my-3 overflow-x-auto rounded-md border border-black/10 bg-black/[0.04] p-3 text-[0.82rem] dark:border-white/10 dark:bg-black/25"
    >
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="my-3 border-l-2 border-foreground/20 pl-3 text-[0.9rem] text-foreground/85"
    >
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-foreground/15" />,
  table: ({ children, ...props }) => (
    <div className="my-3 overflow-x-auto rounded-md border border-black/10 dark:border-white/10">
      <table {...props} className="w-full min-w-full border-collapse text-left text-[0.82rem]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props} className="bg-black/[0.04] dark:bg-white/[0.06]">
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th {...props} className="border-b border-black/10 px-3 py-2 font-medium dark:border-white/10">
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td {...props} className="border-b border-black/8 px-3 py-2 align-top dark:border-white/10">
      {children}
    </td>
  ),
}

export function RoadmapNotesMarkdown({
  content,
}: {
  content: string
  /** Full path+query before the hash, e.g. `/roadmap?item=security%2Fagent-sandbox` */
  permalinkPrefix?: string
}) {
  const normalized = content.replace(/\r\n?/g, "\n").trim()

  return (
    <div className="roadmap-notes-markdown max-w-none break-words text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={roadmapUrlTransform}
        components={roadmapMarkdownComponents}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  )
}
