import { visit } from "unist-util-visit"

// Build-time markup for book pages (content/book/*.md) and research notes
// (content/research/*.md): permalink anchors on headings and the external-link
// arrow, plus a copy button on book code blocks. Doing it here keeps the
// rendered HTML final, with nothing patched in the browser.

type Node = {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: Node[]
}

const el = (tagName: string, properties: Record<string, unknown>, children: Node[] = []): Node => ({
  type: "element",
  tagName,
  properties,
  children,
})

const externalIcon = () =>
  el(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 12 12",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      className: ["h-2.5", "w-2.5", "inline-block", "ml-0.5", "align-baseline"],
      style: "vertical-align: baseline",
    },
    [el("path", { d: "M3 9L9 3M9 3H4.5M9 3V7.5", strokeLinecap: "round", strokeLinejoin: "round" })],
  )

const copyIcon = () =>
  el("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", height: "1em", className: ["book-copy-icon"] }, [
    el("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2" }),
    el("path", { d: "M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" }),
  ])

const checkIcon = () =>
  el("svg", { viewBox: "0 0 20 20", fill: "currentColor", height: "1em", className: ["book-check-icon"] }, [
    el("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z",
    }),
  ])

export function isExternalHref(href: string) {
  if (!/^https?:\/\//.test(href)) return false
  try {
    const host = new URL(href).hostname
    return !(host === "tiles.run" || host.endsWith(".tiles.run"))
  } catch {
    return false
  }
}

export function rehypeBook() {
  return (tree: Node, file: { filename?: string; path?: string }) => {
    const name = (file.filename ?? file.path ?? "").replaceAll("\\", "/")
    const isBook = name.includes("/content/book/")
    if (!isBook && !name.includes("/content/research/")) return

    visit(tree as never, (node: Node, index: number | undefined, parent: Node | undefined) => {
      if (node.type === "element" && node.tagName === "a") {
        const href = String(node.properties?.href ?? "")
        if (isExternalHref(href)) {
          const cls = node.properties?.className
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: "noopener noreferrer",
            className: [...(Array.isArray(cls) ? cls : cls ? [String(cls)] : []), "external-link"],
          }
          node.children = [...(node.children ?? []), externalIcon()]
        } else if (node.properties) {
          // mdsvex marks every absolute URL nofollow, including links to our own site.
          delete node.properties.rel
        }
        return
      }

      if (node.type === "element" && /^h[2-6]$/.test(node.tagName ?? "") && node.properties?.id) {
        const id = String(node.properties.id)
        node.children = [
          ...(node.children ?? []),
          el("a", { href: `#${id}`, className: ["subheading-anchor"], ariaLabel: "Permalink for this section" }),
        ]
        return
      }

      // Highlighted code arrives as a raw `{@html ...}` block from the mdsvex highlighter.
      if (isBook && node.type === "raw" && parent && index !== undefined && /^\{@html `<pre/.test(node.value ?? "")) {
        parent.children![index] = el("div", { className: ["book-code"], dataPagefindIgnore: "all" }, [
          node,
          el("button", { type: "button", className: ["book-code-copy"], title: "Copy code", ariaLabel: "Copy code" }, [copyIcon(), checkIcon()]),
        ])
        return "skip" as never
      }
    })
  }
}
