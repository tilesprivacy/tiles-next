import type { Component } from "svelte"
import type { PageLoad } from "./$types"

// Prerendered pages plus anything else under /book, which renders the book 404.
export const prerender = "auto"

const pages = import.meta.glob<{ default: Component }>("/content/book/*.md")

export const load: PageLoad = async ({ data }) => {
  const file = `/content/book/${data.meta.slug || "index"}.md`
  const content = (await pages[file]()).default
  return { ...data, content }
}
