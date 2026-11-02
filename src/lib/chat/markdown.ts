// Markdown for shared chats: GFM and math, parsed to an HTML tree, cleaned
// with a strict allowlist, then given the markup the viewer has always had
// (Streamdown's elements and classes, which src/lib/components/chat/chat.css
// styles). Runs on the server for public shares and, loaded on demand, in
// the browser for private ones, so both render the same.
import type { Element, ElementContent, Properties, Root, RootContent } from "hast"
import { raw } from "hast-util-raw"
import { defaultSchema, sanitize } from "hast-util-sanitize"
import { toHtml } from "hast-util-to-html"
import type Katex from "katex"
import { fromMarkdown } from "mdast-util-from-markdown"
import { gfmFromMarkdown } from "mdast-util-gfm"
import { mathFromMarkdown } from "mdast-util-math"
import { toHast } from "mdast-util-to-hast"
import { gfm } from "micromark-extension-gfm"
import { math } from "micromark-extension-math"
import { COPY_ICON, DOWNLOAD_ICON, FULLSCREEN_ICON, TABLE_FORMATS } from "#lib/chat/table-icons"

export interface FrontmatterEntry {
  key: string
  value: string
}

export interface RenderedMarkdown {
  frontmatter: FrontmatterEntry[]
  html: string
}

export interface MarkdownOptions {
  /** Off for private shares: images become links so viewing a chat never pings a third party. */
  remoteImages: boolean
  /** KaTeX, passed in so the browser can skip loading it for chats without math. */
  katex: typeof Katex | null
}

/** Whether a text could contain math at all: $…$, or \( \[ before normalising. */
export const mayContainMath = (text: string) => /\$|\\\(|\\\[/.test(text)

/* Source preprocessing */

function splitFrontmatter(content: string): { frontmatter: FrontmatterEntry[]; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  if (!match) return { frontmatter: [], body: content }
  const frontmatter = match[1]
    .split("\n")
    .map((line) => line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/))
    .filter((entry): entry is RegExpMatchArray => entry !== null)
    .map(([, key, value]) => ({ key, value }))
  return { frontmatter, body: content.slice(match[0].length) }
}

// Tiles models write LaTeX as \( \) and \[ \]; the math syntax expects $.
// Code spans and fences are left alone.
function normalizeMathDelimiters(markdown: string): string {
  const convert = (text: string) =>
    text
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, tex: string) => `\n\n$$\n${tex.trim()}\n$$\n\n`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, tex: string) => `$${tex.trim()}$`)
  return markdown
    .split(/(```[\s\S]*?```)/g)
    .map((part) =>
      part.startsWith("```")
        ? part
        : part
            .split(/(`+[^`]*?`+)/g)
            .map((piece) => (piece.startsWith("`") ? piece : convert(piece)))
            .join(""),
    )
    .join("")
}

/* Links and images */

const LINK_CLASS =
  "font-medium text-black underline decoration-black/25 underline-offset-4 transition-colors hover:text-black/80 hover:decoration-black/45 dark:text-white dark:decoration-white/25 dark:hover:text-white/80 dark:hover:decoration-white/45"

function safeHref(value: unknown): string | null {
  if (typeof value !== "string") return null
  const href = value.trim()
  if (href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//"))) return href
  // "./x" and "../x" resolved to site paths before; keep that.
  if (href.startsWith("./") || href.startsWith("../")) {
    const url = new URL(href, "https://relative.invalid/")
    return url.pathname + url.search + url.hash
  }
  try {
    const url = new URL(href)
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null
  } catch {
    return null
  }
}

function safeImageSrc(value: unknown): string | null {
  const src = safeHref(value)
  return src && /^https?:/.test(src) ? src : null
}

/* Tree helpers */

const el = (tagName: string, properties: Properties, children: ElementContent[] = []): Element => ({
  type: "element",
  tagName,
  properties,
  children,
})
const text = (value: string) => ({ type: "text" as const, value })

function classes(base: string, element: Element): string {
  const own = element.properties.className
  const extra = Array.isArray(own) ? own.join(" ") : typeof own === "string" ? own : ""
  return extra ? `${base} ${extra}` : base
}

function textContent(node: ElementContent | RootContent): string {
  if (node.type === "text") return node.value
  if (node.type === "element") return node.children.map(textContent).join("")
  return ""
}

/* Math */

const KATEX_ERROR_COLOR = "var(--color-muted-foreground)"

function renderMath(tex: string, displayMode: boolean, katex: typeof Katex | null): ElementContent {
  if (!katex) return text(tex)
  let html: string
  try {
    html = katex.renderToString(tex, { displayMode, errorColor: KATEX_ERROR_COLOR, throwOnError: true })
  } catch (error) {
    try {
      html = katex.renderToString(tex, { displayMode, errorColor: KATEX_ERROR_COLOR, strict: "ignore", throwOnError: false })
    } catch {
      return el("span", { className: ["katex-error"], style: `color:${KATEX_ERROR_COLOR}`, title: String(error) }, [text(tex)])
    }
  }
  // KaTeX builds this markup from the TeX alone (no links or HTML pass
  // through with its default `trust: false`), after the allowlist has run.
  return { type: "raw", value: html } as unknown as ElementContent
}

const isMathCode = (node: ElementContent): node is Element =>
  node.type === "element" &&
  node.tagName === "code" &&
  Array.isArray(node.properties.className) &&
  node.properties.className.includes("language-math")

/* Code blocks */

function codeBlock(code: Element): Element {
  const language = (Array.isArray(code.properties.className) ? code.properties.className : [])
    .map(String)
    .map((name) => name.match(/^language-(\S+)/)?.[1])
    .find(Boolean) ?? ""
  const source = textContent(code).replace(/\n+$/, "")
  // One block per line, as Streamdown laid out its (unhighlighted) code.
  const lines = source.split("\n").map((line) => el("span", {}, [text(line || "\n")]))

  return el(
    "div",
    {
      className: ["my-4 flex w-full flex-col gap-2 rounded-xl border border-border bg-sidebar p-2"],
      dataLanguage: language,
      dataStreamdown: "code-block",
      style: "content-visibility:auto;contain-intrinsic-size:auto 200px",
    },
    [
      el("div", { className: ["flex h-8 items-center text-muted-foreground text-xs"], dataLanguage: language, dataStreamdown: "code-block-header" }, [
        el("span", { className: ["ml-1 font-mono lowercase"] }, [text(language)]),
      ]),
      el(
        "div",
        {
          className: [`${language ? `language-${language} ` : ""}overflow-x-auto rounded-md border border-border bg-background p-4 text-sm`],
          dataLanguage: language,
          dataStreamdown: "code-block-body",
        },
        [el("pre", {}, [el("code", {}, lines)])],
      ),
    ],
  )
}

/* Tables: the copy, download and fullscreen controls are wired up by table-actions.ts */

const TABLE_BUTTON = "cursor-pointer p-1 text-muted-foreground transition-all hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
const MENU = "absolute top-full right-0 z-20 mt-1 min-w-[120px] overflow-hidden rounded-md border border-border bg-background shadow-lg"
const MENU_ITEM = "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"

const svg = (size: number, paths: string[]) =>
  el(
    "svg",
    { color: "currentColor", height: size, strokeLinejoin: "round", viewBox: "0 0 16 16", width: size, ariaHidden: "true" },
    paths.map((d) => el("path", { clipRule: "evenodd", d, fill: "currentColor", fillRule: "evenodd" })),
  )

function menu(action: string, formats: readonly (readonly [string, string])[]): Element {
  return el(
    "div",
    { className: [MENU], hidden: true, dataTableMenu: action },
    formats.map(([format, label]) =>
      el("button", { className: [MENU_ITEM], type: "button", dataTableAction: action, dataFormat: format }, [text(label)]),
    ),
  )
}

function tableWrapper(table: Element): Element {
  return el("div", { className: ["my-4 flex flex-col gap-2 rounded-lg border border-border bg-sidebar p-2"], dataStreamdown: "table-wrapper" }, [
    el("div", { className: ["flex items-center justify-end gap-1"] }, [
      el("div", { className: ["relative"] }, [
        el("button", { className: [TABLE_BUTTON], title: "Copy table", type: "button", dataTableMenuToggle: "copy" }, [svg(14, [COPY_ICON])]),
        menu("copy", TABLE_FORMATS.copy),
      ]),
      el("div", { className: ["relative"] }, [
        el("button", { className: [TABLE_BUTTON], title: "Download table", type: "button", dataTableMenuToggle: "download" }, [svg(16, [DOWNLOAD_ICON])]),
        menu("download", TABLE_FORMATS.download),
      ]),
      el("button", { className: [TABLE_BUTTON], title: "View fullscreen", type: "button", dataTableAction: "fullscreen" }, [svg(16, [FULLSCREEN_ICON])]),
    ]),
    el("div", { className: ["border-collapse overflow-x-auto overflow-y-auto rounded-md border border-border bg-background"] }, [
      el("table", { className: [classes("w-full divide-y divide-border", table)], dataStreamdown: "table" }, table.children),
    ]),
  ])
}

/* Streamdown's element mapping */

const TABLE_PARTS = new Set(["table", "thead", "tbody", "tfoot", "tr"])

const HEADING_SIZES: Record<string, string> = { h1: "3xl", h2: "2xl", h3: "xl", h4: "lg", h5: "base", h6: "sm" }

const SIMPLE: Record<string, [string, string]> = {
  ol: ["list-inside list-decimal whitespace-normal [li_&]:pl-6", "ordered-list"],
  ul: ["list-inside list-disc whitespace-normal [li_&]:pl-6", "unordered-list"],
  li: ["py-1 [&>p]:inline", "list-item"],
  hr: ["my-6 border-border", "horizontal-rule"],
  blockquote: ["my-4 border-muted-foreground/30 border-l-4 pl-4 text-muted-foreground italic", "blockquote"],
  sup: ["text-sm", "superscript"],
  sub: ["text-sm", "subscript"],
  thead: ["bg-muted/80", "table-header"],
  tbody: ["divide-y divide-border", "table-body"],
  tr: ["border-border", "table-row"],
  th: ["whitespace-nowrap px-4 py-2 text-left font-semibold text-sm", "table-header-cell"],
  td: ["px-4 py-2 text-sm", "table-cell"],
}

const ALIGNMENTS = new Set(["left", "center", "right", "justify"])

function blockedLink(children: ElementContent[]): Element {
  return el("span", { title: "Blocked URL", className: ["text-gray-500"] }, [...children, text(" [blocked]")])
}

// mailto: and similar links kept their text but lost their href before; keep that.
const INERT_LINK = /^(?:mailto|ircs?|xmpp):/i

function link(element: Element, children: ElementContent[]): Element {
  const href = safeHref(element.properties.href)
  if (!href && !(typeof element.properties.href === "string" && INERT_LINK.test(element.properties.href.trim()))) {
    return blockedLink(children)
  }
  const local = href?.startsWith("/") || href?.startsWith("#")
  return el(
    "a",
    {
      ...element.properties,
      href: href ?? undefined,
      target: local ? undefined : "_blank",
      rel: local ? undefined : ["noopener", "noreferrer"],
      className: [classes(LINK_CLASS, element)],
    },
    children,
  )
}

function image(element: Element, options: MarkdownOptions): ElementContent {
  const src = safeImageSrc(element.properties.src)
  const alt = typeof element.properties.alt === "string" ? element.properties.alt : ""
  if (!src) {
    return el("span", { className: ["inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded text-sm"] }, [
      text(`[Image blocked: ${alt || "No description"}]`),
    ])
  }
  if (!options.remoteImages) return link(el("a", { href: src }, []), [text(alt || src)])
  return el("span", { className: ["group relative my-4 inline-block"], dataStreamdown: "image-wrapper" }, [
    el("img", {
      alt: element.properties.alt,
      title: element.properties.title,
      className: ["max-w-full rounded-lg"],
      dataStreamdown: "image",
      src,
      loading: "lazy",
      decoding: "async",
      referrerPolicy: "no-referrer",
    }),
    el("span", { className: ["pointer-events-none absolute inset-0 hidden rounded-lg bg-black/10 group-hover:block"] }),
  ])
}

function transformChildren(children: ElementContent[], options: MarkdownOptions): ElementContent[] {
  const out: ElementContent[] = []
  for (const child of children) {
    if (child.type !== "element") {
      out.push(child)
      continue
    }
    // Math first, as rehype-katex did: ```math fences and $$ blocks replace their <pre>.
    if (child.tagName === "pre" && child.children.length === 1 && isMathCode(child.children[0])) {
      out.push(renderMath(textContent(child.children[0]), true, options.katex))
      continue
    }
    if (isMathCode(child)) {
      out.push(renderMath(textContent(child), false, options.katex))
      continue
    }
    out.push(...transform(child, options))
  }
  return out
}

function transform(element: Element, options: MarkdownOptions): ElementContent[] {
  const { tagName } = element
  // Footnote ids get a prefix from both the converter and the allowlist; keep one.
  if (typeof element.properties.id === "string") {
    element.properties.id = element.properties.id.replace(/^(user-content-)+/, "user-content-")
  }

  // A paragraph holding just an image renders the image alone.
  if (tagName === "p") {
    const content = element.children.filter((child) => !(child.type === "text" && child.value === ""))
    if (content.length === 1 && content[0].type === "element" && content[0].tagName === "img") {
      return transformChildren(content, options)
    }
  }
  if (tagName === "pre") {
    const code = element.children.find((child): child is Element => child.type === "element" && child.tagName === "code")
    if (code) return [codeBlock(code)]
  }
  if (tagName === "img") return [image(element, options)]

  // Whitespace between table parts isn't content (React dropped it too).
  const own = TABLE_PARTS.has(tagName) ? element.children.filter((child) => !(child.type === "text" && !child.value.trim())) : element.children
  const children = transformChildren(own, options)

  if (tagName === "a") return [link(element, children)]
  if (tagName === "strong") return [el("span", { className: [classes("font-semibold", element)], dataStreamdown: "strong" }, children)]
  if (tagName === "code") {
    return [el("code", { ...element.properties, className: [classes("rounded bg-muted px-1.5 py-0.5 font-mono text-sm", element)], dataStreamdown: "inline-code" }, children)]
  }
  if (tagName === "table") return [tableWrapper({ ...element, children })]
  if (tagName in HEADING_SIZES) {
    return [
      el(tagName, { ...element.properties, className: [classes(`mt-6 mb-2 font-semibold text-${HEADING_SIZES[tagName]}`, element)], dataStreamdown: `heading-${tagName[1]}` }, children),
    ]
  }
  const simple = SIMPLE[tagName]
  if (simple) {
    const properties: Properties = { ...element.properties, className: [classes(simple[0], element)], dataStreamdown: simple[1] }
    // Table cell alignment becomes a style, as React rendered it. Raw HTML can
    // set align to anything, so only real alignments make it into the style.
    if (tagName === "th" || tagName === "td") {
      if (typeof properties.align === "string" && ALIGNMENTS.has(properties.align)) properties.style = `text-align:${properties.align}`
      delete properties.align
    }
    return [el(tagName, properties, children)]
  }
  return [{ ...element, children }]
}

function hasHtml(node: { type: string; children?: unknown[] }): boolean {
  return node.type === "html" || (node.children?.some((child) => hasHtml(child as typeof node)) ?? false)
}

export function renderMarkdown(content: string, options: MarkdownOptions): RenderedMarkdown {
  const { frontmatter, body } = splitFrontmatter(content.replace(/\r\n?/g, "\n"))
  const mdast = fromMarkdown(normalizeMathDelimiters(body), {
    extensions: [gfm(), math({ singleDollarTextMath: true })],
    mdastExtensions: [gfmFromMarkdown(), mathFromMarkdown()],
  })
  // HTML written in a message is parsed (only when there is some: it's the
  // slow part), then everything goes through GitHub's allowlist, which drops
  // scripts, event handlers, styles, iframes, forms and unsafe URLs. It is also
  // what the viewer allowed before.
  const hast = toHast(mdast, { allowDangerousHtml: true })
  const tree = sanitize(hasHtml(mdast) ? raw(hast) : hast, defaultSchema) as Root
  const children = transformChildren(tree.children as ElementContent[], options)
  return { frontmatter, html: toHtml({ type: "root", children }, { allowDangerousHtml: true }) }
}
