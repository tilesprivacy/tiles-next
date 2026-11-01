// Markdown to HTML for blog posts (prerendered pages and the RSS feed). The
// markup matches what the hand-written post pages used to produce, so app.css
// styles it unchanged.
// The conventions writers can use are documented in content/blog/README.md.
import type { Element, ElementContent, Root as HastRoot, RootContent as HastContent } from "hast"
import { toHtml } from "hast-util-to-html"
import type { Code, Html, Nodes, Paragraph, Parents, Root, RootContent } from "mdast"
import { fromMarkdown } from "mdast-util-from-markdown"
import { gfmFromMarkdown } from "mdast-util-gfm"
import { toHast } from "mdast-util-to-hast"
import { gfm } from "micromark-extension-gfm"
import { slugify, type TocItem } from "#lib/toc"

export interface RenderedMarkdown {
  html: string
  toc: TocItem[]
}

const escapeText = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const escapeAttr = (value: string) => escapeText(value).replace(/"/g, "&quot;")

/* Code blocks */

const rustKeywordPattern =
  /^(?:as|async|await|break|const|continue|crate|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|unsafe|use|where|while)$/
const rustTokenPattern = /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|[A-Za-z_][A-Za-z0-9_]*!|\b[A-Za-z_][A-Za-z0-9_]*\b)/g

function rustTokenClass(token: string, nextText: string): string | null {
  if (token.startsWith("//")) return "rust-comment"
  if (token.startsWith('"')) return "rust-string"
  if (token.endsWith("!")) return "rust-macro"
  if (rustKeywordPattern.test(token)) return "rust-keyword"
  if (/^[A-Z]/.test(token)) return "rust-type"
  if (/^[a-z_][A-Za-z0-9_]*$/.test(token) && /^\s*\(/.test(nextText)) return "rust-fn"
  return null
}

function highlightRust(code: string): string {
  let html = ""
  let last = 0
  for (const match of code.matchAll(rustTokenPattern)) {
    const token = match[0]
    const offset = match.index ?? 0
    html += escapeText(code.slice(last, offset))
    const className = rustTokenClass(token, code.slice(offset + token.length))
    html += className ? `<span class="${className}">${escapeText(token)}</span>` : escapeText(token)
    last = offset + token.length
  }
  return html + escapeText(code.slice(last))
}

const jsonTokenPattern =
  /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

function highlightJson(code: string): string {
  let html = ""
  let last = 0
  for (const match of code.matchAll(jsonTokenPattern)) {
    const offset = match.index ?? 0
    html += escapeText(code.slice(last, offset))
    if (match[1]) {
      html += `<span class="${match[2] ? "syntax-json-key" : "syntax-json-string"}">${escapeText(match[1])}</span>`
      if (match[2]) html += escapeText(match[2])
    } else {
      html += `<span class="${match[3] ? "syntax-json-literal" : "syntax-json-number"}">${escapeText(match[0])}</span>`
    }
    last = offset + match[0].length
  }
  return html + escapeText(code.slice(last))
}

function renderCode(node: Code): string {
  const lang = node.lang?.toLowerCase()
  if (lang === "rust") {
    return `<pre><code class="language-rust">${highlightRust(node.value)}</code></pre>`
  }
  if (lang === "json") {
    // Long JSON lines scroll sideways; the button (wired up by the post page)
    // lets readers wrap them instead.
    return (
      `<div class="article-code-block-shell">` +
      `<button type="button" class="article-code-wrap-toggle blog-print-screen-only" aria-pressed="false" aria-label="Wrap JSON lines">Wrap</button>` +
      `<pre data-wrap-control="true" data-code-wrap="false"><code class="language-json" data-syntax-highlighted="true">${highlightJson(node.value)}</code></pre>` +
      `</div>`
    )
  }
  const cls = lang ? ` class="language-${escapeAttr(lang)}"` : ""
  return `<pre><code${cls}>${escapeText(node.value)}</code></pre>`
}

/* Media conventions */

type Attrs = Record<string, string>

function parseAttrs(tag: string): Attrs {
  const attrs: Attrs = {}
  const body = tag.replace(/^<[\w-]+/, "").replace(/\/?>$/, "")
  for (const match of body.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ""
  }
  return attrs
}

/* Raw HTML allowlist */

// Posts come from the PDS in production, so raw HTML in them is checked
// rather than trusted: only the tags and attributes the writing conventions
// use (content/blog/README.md) get through. Anything else is shown as text,
// so a writer sees the problem instead of it silently disappearing.
const ALLOWED_HTML: Record<string, Set<string>> = {
  img: new Set(["src", "alt", "width", "height", "class", "loading", "decoding"]),
  picture: new Set(["class"]),
  source: new Set(["src", "srcset", "media", "type", "width", "height"]),
  video: new Set(["src", "poster", "width", "height", "class", "aria-label", "autoplay", "loop", "muted", "playsinline", "controls", "preload"]),
  figure: new Set(["class"]),
  figcaption: new Set(["class"]),
  a: new Set(["href", "title"]),
  code: new Set(["class"]),
  em: new Set([]),
  strong: new Set([]),
  br: new Set([]),
  span: new Set(["class"]),
}

const TAG_PATTERN = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g

/** Root-relative paths and https everywhere; links may also be http, mailto or in-page. */
export function isSafeUrl(value: string, kind: "link" | "media"): boolean {
  const url = value.trim()
  if (/^\/(?!\/)/.test(url) || /^https:\/\//i.test(url)) return true
  return kind === "link" && (/^#/.test(url) || /^http:\/\//i.test(url) || /^mailto:/i.test(url))
}

function isAllowedHtml(html: string): boolean {
  const markup = html.replace(/<!--[\s\S]*?-->/g, "")
  for (const match of markup.matchAll(TAG_PATTERN)) {
    const allowed = ALLOWED_HTML[match[1].toLowerCase()]
    if (!allowed) return false
    if (match[0].startsWith("</")) continue
    for (const [name, value] of Object.entries(parseAttrs(match[0]))) {
      if (!allowed.has(name)) return false
      if (name === "href" && !isSafeUrl(value, "link")) return false
      if ((name === "src" || name === "poster") && !isSafeUrl(value, "media")) return false
      if (name === "srcset" && !value.split(",").every((part) => isSafeUrl(part.trim().split(/\s+/)[0] ?? "", "media"))) {
        return false
      }
    }
  }
  // Anything still shaped like markup is something the pattern couldn't read.
  return !/[<>]/.test(markup.replace(TAG_PATTERN, ""))
}

function firstTag(html: string, name: string): Attrs | null {
  const match = html.match(new RegExp(`<${name}\\b[^>]*>`, "i"))
  return match ? parseAttrs(match[0]) : null
}

function sizeAttrs(attrs: Attrs): string {
  return (attrs.width ? ` width="${escapeAttr(attrs.width)}"` : "") + (attrs.height ? ` height="${escapeAttr(attrs.height)}"` : "")
}

function img(src: string, alt: string, size: string, className: string): string {
  return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${size} loading="lazy" decoding="async" class="${className}">`
}

const SCREENSHOT_CLASS = "h-auto w-full rounded-lg border border-black/10 dark:border-white/10"
const MEDIA_FRAME_CLASS = "my-6 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5"

function screenshot(attrs: Attrs): string {
  return `<div class="my-6">${img(attrs.src ?? "", attrs.alt ?? "", sizeAttrs(attrs), SCREENSHOT_CLASS)}</div>`
}

function videoType(src: string): string {
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase()
  if (ext === "webm") return "video/webm"
  if (ext === "m4v") return "video/x-m4v"
  if (ext === "mov") return "video/quicktime"
  return "video/mp4"
}

function transformHtmlBlock(raw: string): string {
  const html = raw.trim()
  const root = html.match(/^<([\w-]+)\b[^>]*>/)
  if (!root) return raw
  const tag = root[1].toLowerCase()
  const rootAttrs = parseAttrs(root[0])
  // An explicit class means the writer is styling it themselves.
  if ("class" in rootAttrs) return raw

  if (tag === "picture") {
    const image = firstTag(html, "img")
    const sources = [...html.matchAll(/<source\b[^>]*>/gi)].map((m) => parseAttrs(m[0]))
    const dark = sources.find((s) => (s.media ?? "").includes("dark"))
    if (!image) return raw
    const alt = image.alt ?? ""
    const light = img(image.src ?? "", alt, sizeAttrs(image), dark ? "block h-auto w-full dark:hidden" : "block h-auto w-full")
    const darkImg = dark
      ? img(dark.srcset ?? dark.src ?? "", alt, sizeAttrs(dark.width ? dark : image), "hidden h-auto w-full dark:block")
      : ""
    return `<div class="${MEDIA_FRAME_CLASS}">${light}${darkImg}</div>`
  }

  if (tag === "video") {
    const source = firstTag(html, "source")
    const src = rootAttrs.src ?? source?.src ?? ""
    const label = rootAttrs["aria-label"] ? ` aria-label="${escapeAttr(rootAttrs["aria-label"])}"` : ""
    const poster = rootAttrs.poster ? ` poster="${escapeAttr(rootAttrs.poster)}"` : ""
    // Silent clips start playing when scrolled near, so they never download
    // up front (browsers ignore preload="none" next to autoplay).
    const behaviour =
      "autoplay" in rootAttrs
        ? ` loop muted playsinline preload="none" data-play-on-approach`
        : ` controls playsinline preload="metadata"${"loop" in rootAttrs ? " loop" : ""}${"muted" in rootAttrs ? " muted" : ""}`
    return (
      `<div class="${MEDIA_FRAME_CLASS}"><video class="block h-auto w-full"${behaviour}${poster}${label}>` +
      `<source src="${escapeAttr(src)}" type="${escapeAttr(source?.type ?? videoType(src))}"></video></div>`
    )
  }

  if (tag === "figure") {
    const image = firstTag(html, "img")
    if (!image) return raw
    const caption = html.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1].trim()
    return (
      `<figure class="my-8 lg:my-10">${img(image.src ?? "", image.alt ?? "", sizeAttrs(image), "h-auto w-full rounded-lg")}` +
      (caption ? `<figcaption class="mt-2 text-sm text-black/48 dark:text-white/48">${caption}</figcaption>` : "") +
      `</figure>`
    )
  }

  if (tag === "img" && /^<img\b[^>]*>$/i.test(html)) return screenshot(rootAttrs)

  return raw
}

/* Tree passes */

function isHtmlOnlyParagraph(node: Paragraph): boolean {
  return (
    node.children.some((child) => child.type === "html") &&
    node.children.every((child) => child.type === "html" || (child.type === "text" && !child.value.trim()))
  )
}

function transformMdast(parent: Parents) {
  parent.children = parent.children.map((child) => {
    const node = child as Nodes
    if (node.type === "code") return { type: "html", value: renderCode(node) } satisfies Html
    if (node.type === "html") {
      if (!isAllowedHtml(node.value)) return { type: "text", value: node.value }
      return { type: "html", value: transformHtmlBlock(node.value) } satisfies Html
    }
    if (node.type === "paragraph") {
      const meaningful = node.children.filter((c) => !(c.type === "text" && !c.value.trim()))
      if (meaningful.length === 1 && meaningful[0].type === "image") {
        const image = meaningful[0]
        return { type: "html", value: screenshot({ src: image.url, alt: image.alt ?? "" }) } satisfies Html
      }
      if (isHtmlOnlyParagraph(node)) {
        const value = node.children.map((c) => ("value" in c ? c.value : "")).join("")
        if (isAllowedHtml(value)) return { type: "html", value: transformHtmlBlock(value) } satisfies Html
      }
    }
    if ("children" in node) transformMdast(node as Parents)
    return child
  }) as RootContent[]
}

const BLOCK_PARENTS = new Set(["ul", "ol", "blockquote", "figure", "table", "thead", "tbody", "tr"])

function textOf(node: ElementContent | HastContent): string {
  if (node.type === "text") return node.value
  if (node.type === "element") return node.children.map(textOf).join("")
  return ""
}

function transformHast(parent: HastRoot | Element, ctx: { toc: TocItem[]; used: Map<string, number>; inList: boolean }) {
  const dropWhitespace = parent.type === "root" || BLOCK_PARENTS.has(parent.tagName) ||
    (parent.tagName === "li" && parent.children.some((c) => c.type === "element" && c.tagName === "p"))
  if (dropWhitespace) {
    parent.children = parent.children.filter((c) => !(c.type === "text" && !c.value.trim())) as typeof parent.children
  }

  for (const child of parent.children) {
    if (child.type !== "element") continue
    const tag = child.tagName

    // Markdown links and images: drop URLs with other schemes (javascript:, data:).
    if (tag === "img" && !isSafeUrl(String(child.properties.src ?? ""), "media")) {
      delete child.properties.src
    }

    if (tag === "a") {
      const href = String(child.properties.href ?? "")
      if (href && !isSafeUrl(href, "link")) delete child.properties.href
      if (/^https?:\/\//.test(href)) {
        child.properties.target = "_blank"
        child.properties.rel = ["noopener", "noreferrer"]
      }
    }

    if (tag === "h2" || tag === "h3" || tag === "h4") {
      const text = textOf(child).trim()
      const base = slugify(text) || "section"
      const seen = ctx.used.get(base) ?? 0
      ctx.used.set(base, seen + 1)
      const id = seen === 0 ? base : `${base}-${seen + 1}`
      child.properties.id = id
      ctx.toc.push({ id, text, level: Number(tag[1]) as 2 | 3 | 4 })
    }

    // Nested lists sit a little apart from the item text above them.
    if ((tag === "ul" || tag === "ol") && ctx.inList) {
      child.properties.className = ["mt-2"]
    }

    transformHast(child, { ...ctx, inList: ctx.inList || tag === "li" })
  }
}

export function renderMarkdown(markdown: string): RenderedMarkdown {
  const mdast = fromMarkdown(markdown, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  }) as Root
  transformMdast(mdast)

  const hast = toHast(mdast, { allowDangerousHtml: true }) as HastRoot
  const toc: TocItem[] = []
  transformHast(hast, { toc, used: new Map(), inList: false })

  return { html: toHtml(hast, { allowDangerousHtml: true }), toc }
}
