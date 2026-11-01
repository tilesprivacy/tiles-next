// Plain-text alternative for our own email HTML, roughly what html-to-text
// produces: headings upper-cased, links as "label url", images and
// `data-skip-in-text` elements dropped. Only ever fed trusted template output.

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  nbsp: " ",
}

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    const key = name.toLowerCase()
    if (key in ENTITIES) return ENTITIES[key]
    if (key.startsWith("#x")) return String.fromCodePoint(parseInt(name.slice(2), 16))
    if (key.startsWith("#")) return String.fromCodePoint(parseInt(name.slice(1), 10))
    return entity
  })
}

const stripTags = (html: string) => html.replace(/<[^>]+>/g, "")

export function toPlainText(html: string): string {
  let text = html
    .replace(/<head[\s\S]*?<\/head>/i, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Source line breaks are just whitespace, as in a browser.
    .replace(/\s+/g, " ")
    .replace(/<(div|span|p)\b[^>]*data-skip-in-text="true"[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<img\b[^>]*>/gi, "")
    // Upper-case heading text but not the URLs inside it.
    .replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, inner: string) =>
      `<p>${inner.replace(/(^|>)([^<]*)/g, (_m, close: string, text: string) => close + text.toUpperCase())}</p>`,
    )
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, inner: string) => {
      const label = stripTags(inner).replace(/\s+/g, " ").trim()
      const url = decode(href).replace(/^mailto:/, "")
      if (!label) return url
      return label === url ? label : `${label} ${url}`
    })
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|tr|table)>/gi, "\n\n")

  text = decode(stripTags(text))

  return text
    .split("\n")
    .map((line) => line.replace(/ +/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
