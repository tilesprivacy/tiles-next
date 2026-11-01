import type { MdsvexOptions } from "mdsvex"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { createHighlighter } from "shiki"

// Book pages, research notes and blog posts all go through this.
// Code is highlighted at build time, so no highlighter ships to the browser.
const highlighter = await createHighlighter({
  themes: ["github-light", "github-dark"],
  langs: ["bash", "shell", "sh", "json", "jsonc", "toml", "yaml", "rust", "python", "typescript", "javascript", "tsx", "html", "css", "diff", "text", "markdown"],
})

function escapeSvelte(html: string) {
  return html.replace(/[{}`\\]/g, (c) => `&#${c.charCodeAt(0)};`)
}

export const mdsvexOptions: MdsvexOptions = {
  extensions: [".md"],
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug],
  highlight: {
    highlighter: (code, lang) => {
      const language = lang && highlighter.getLoadedLanguages().includes(lang) ? lang : "text"
      const html = highlighter.codeToHtml(code, {
        lang: language,
        themes: { light: "github-light", dark: "github-dark" },
        defaultColor: false,
      })
      return `{@html \`${escapeSvelte(html)}\`}`
    },
  },
}
